from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, Response

from ..config import get_settings
from ..database import repo
from ..models import AdminLogin, BookingCreate, BookingUpdate, to_pydantic_booking
from ..security import create_token, decode_token, hash_password, verify_password
from ..services.availability import check_availability, create_booking_record, update_booking_record
from ..services.calendar_sync import build_ics, export_summary
from ..services.notifications import notify

router = APIRouter(prefix="/api/admin", tags=["admin"])
settings = get_settings()


def _current_user(authorization: str | None = Header(default=None)) -> str:
    """Bearer token auth for admin endpoints."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated.")
    email = decode_token(authorization.split(" ", 1)[1].strip())
    if not email:
        raise HTTPException(status_code=401, detail="Session expired. Please sign in again.")
    return email


def _seed_admin() -> None:
    """Ensure the demo admin account exists (password from env)."""
    existing = repo.find_one("admin_users", {"email": settings.admin_email})
    if not existing:
        repo.insert(
            "admin_users",
            {
                "email": settings.admin_email,
                "password_hash": hash_password(settings.admin_password),
                "role": "owner",
                "created_at": datetime.now(timezone.utc).isoformat(),
            },
        )
        print(f"[nandini-vision] Seeded admin user: {settings.admin_email}")


_seed_admin()


@router.post("/login")
def login(payload: AdminLogin, response: Response) -> dict:
    record = repo.find_one("admin_users", {"email": payload.email.lower().strip()})
    if not record or not verify_password(payload.password, record["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    token = create_token(record["email"])
    response.set_cookie(
        key="nv_admin",
        value=token,
        httponly=True,
        samesite="lax",
        secure=settings.env == "production",
        max_age=settings.jwt_expiry_hours * 3600,
        path="/",
    )
    return {"ok": True, "token": token, "email": record["email"], "role": record.get("role", "owner")}


@router.post("/logout")
def logout(response: Response) -> dict:
    response.delete_cookie("nv_admin", path="/")
    return {"ok": True}


@router.get("/session")
def session(user: str = Depends(_current_user)) -> dict:
    return {"ok": True, "email": user}


@router.get("/stats")
def stats(user: str = Depends(_current_user)) -> dict:
    now = datetime.now(timezone.utc).isoformat()[:10]
    def count(status: str | None = None, upcoming: bool = False) -> int:
        all_bookings = repo.find("bookings")
        n = 0
        for b in all_bookings:
            if status and b.get("status") != status:
                continue
            if upcoming and str(b.get("event_date", ""))[:10] < now:
                continue
            n += 1
        return n

    return {
        "total_inquiries": repo.count("inquiries", {}),
        "total_bookings": repo.count("bookings", {}),
        "upcoming_bookings": count(upcoming=True),
        "pending_bookings": count("pending"),
        "confirmed_bookings": count("confirmed"),
        "hold_bookings": count("hold"),
        "cancelled_bookings": count("cancelled"),
        "completed_bookings": count("completed"),
    }


@router.get("/bookings")
def list_bookings(user: str = Depends(_current_user)) -> dict:
    records = repo.find("bookings", sort=[("event_date", 1)])
    return {"ok": True, "bookings": [to_pydantic_booking(b) for b in records]}


@router.post("/bookings")
def admin_create_booking(
    payload: BookingCreate,
    user: str = Depends(_current_user),
) -> dict:
    result = create_booking_record(**payload.model_dump())
    if not result.get("ok"):
        detail = result.get("detail", {})
        raise HTTPException(
            status_code=409,
            detail=detail.get("message", "This date conflicts with an existing booking."),
        )
    record = result["record"]
    notify(
        client_name=record["client_name"], phone=record["phone"], email=record["email"],
        event_type=record["event_type"], event_date=record["event_date"],
        event_location=record["event_location"], guest_count=record.get("guest_count"),
        budget_range=record.get("budget_range"), message=record.get("message"),
        enquiry_id=record["booking_id"],
    )
    return {"ok": True, "booking": to_pydantic_booking(record)}


@router.get("/bookings/{booking_id}")
def get_booking(booking_id: str, user: str = Depends(_current_user)) -> dict:
    record = repo.find_one("bookings", {"booking_id": booking_id})
    if not record:
        raise HTTPException(status_code=404, detail="Booking not found.")
    return {"ok": True, "booking": to_pydantic_booking(record)}


@router.patch("/bookings/{booking_id}")
def update_booking(
    booking_id: str,
    payload: BookingUpdate,
    user: str = Depends(_current_user),
) -> dict:
    record = repo.find_one("bookings", {"booking_id": booking_id})
    if not record:
        raise HTTPException(status_code=404, detail="Booking not found.")
    patch = {k: v for k, v in payload.model_dump().items() if v is not None}

    result = update_booking_record(str(record["_id"]), patch)
    if not result.get("ok"):
        if result.get("conflict"):
            detail = result.get("detail", {})
            raise HTTPException(
                status_code=409,
                detail=detail.get("message", "This date conflicts with an existing booking."),
            )
        raise HTTPException(status_code=422, detail="Could not update booking.")

    updated = repo.find_one("bookings", {"_id": str(record["_id"])})
    return {"ok": True, "booking": to_pydantic_booking(updated or record)}


@router.delete("/bookings/{booking_id}")
def delete_booking(booking_id: str, user: str = Depends(_current_user)) -> dict:
    record = repo.find_one("bookings", {"booking_id": booking_id})
    if not record:
        raise HTTPException(status_code=404, detail="Booking not found.")
    repo.delete("bookings", str(record["_id"]))
    return {"ok": True, "deleted": booking_id}


@router.get("/calendar")
def calendar(
    user: str = Depends(_current_user),
    month: str | None = None,
) -> dict:
    records = repo.find("bookings", sort=[("event_date", 1)])
    events = [
        {
            "booking_id": b.get("booking_id"),
            "client_name": b.get("client_name"),
            "event_type": b.get("event_type"),
            "event_date": str(b.get("event_date", ""))[:10],
            "event_duration": b.get("event_duration", 1),
            "event_location": b.get("event_location"),
            "status": b.get("status"),
        }
        for b in records
    ]
    return {"ok": True, "events": events, "month": month, "sync": export_summary()}


@router.get("/calendar/export.ics")
def export_ics(user: str = Depends(_current_user)) -> Response:
    ics = build_ics()
    return Response(
        content=ics,
        media_type="text/calendar",
        headers={"Content-Disposition": 'attachment; filename="nandini-vision.ics"'},
    )


@router.get("/inquiries")
def list_inquiries(user: str = Depends(_current_user)) -> dict:
    records = repo.find("inquiries", sort=[("created_at", -1)])
    return {"ok": True, "inquiries": records}
