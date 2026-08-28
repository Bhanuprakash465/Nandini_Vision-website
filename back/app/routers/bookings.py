from fastapi import APIRouter, HTTPException

from ..models import BookingCreate, to_pydantic_booking
from ..services.availability import check_availability, create_booking_record
from ..services.notifications import notify

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("")
def create_booking(payload: BookingCreate) -> dict:
    """Public booking creation with server-side double-booking protection."""
    result = create_booking_record(
        **payload.model_dump(),
    )
    if not result.get("ok"):
        if result.get("conflict"):
            detail = result.get("detail", {})
            raise HTTPException(
                status_code=409,
                detail=detail.get("message", "This date was just booked by another client."),
            )
        raise HTTPException(status_code=422, detail="We couldn't create this booking.")

    record = result["record"]
    notify(
        client_name=record["client_name"],
        phone=record["phone"],
        email=record["email"],
        event_type=record["event_type"],
        event_date=record["event_date"],
        event_location=record["event_location"],
        guest_count=record.get("guest_count"),
        budget_range=record.get("budget_range"),
        message=record.get("message"),
        enquiry_id=record["booking_id"],
    )
    return {"ok": True, "booking": to_pydantic_booking(record)}


@router.get("/{booking_id}")
def get_booking(booking_id: str) -> dict:
    from ..database import repo

    record = repo.find_one("bookings", {"booking_id": booking_id})
    if not record:
        raise HTTPException(status_code=404, detail="Booking not found.")
    return {"ok": True, "booking": to_pydantic_booking(record)}
