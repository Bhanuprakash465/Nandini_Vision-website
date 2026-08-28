from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from ..database import repo
from ..models import InquiryCreate
from ..services.notifications import notify
from ..services.availability import with_date_lock, find_blocking

router = APIRouter(prefix="/api/inquiries", tags=["inquiries"])


@router.post("")
def create_inquiry(payload: InquiryCreate) -> dict:
    """Save a consultation enquiry to MongoDB, record a notification
    (mocked email), return a personalised confirmation + WhatsApp link."""
    data = payload.model_dump()

    # Optional date lock: if the user gave a date, reserve nothing yet —
    # an enquiry alone does not block a date — but we surface availability
    # so the frontend can react. Real blocking happens on confirmation.
    if data.get("event_date"):
        with with_date_lock(data["event_date"], data.get("event_duration", 1)):
            conflict = find_blocking(data["event_date"], data.get("event_duration", 1))
            is_available = not conflict
    else:
        is_available = None

    num = 1000 + repo.count("bookings", {}) + repo.count("inquiries", {}) + 1
    inquiry_id = f"NV-{num}"
    now = datetime.now(timezone.utc).isoformat()

    record = {
        "inquiry_id": inquiry_id,
        "client_name": data["name"],
        "name": data["name"],
        "phone": data.get("phone", ""),
        "email": data["email"],
        "event_type": data["event_type"],
        "event_date": str(data["event_date"]) if data.get("event_date") else None,
        "event_location": data["event_location"],
        "event_duration": data.get("event_duration", 1),
        "guest_count": data.get("guest_count"),
        "services": data.get("services", []),
        "budget_range": data.get("budget_range"),
        "photography_requirements": data.get("photography_requirements"),
        "message": data.get("message"),
        "status": "pending",
        "created_at": now,
        "updated_at": now,
    }
    repo.insert("inquiries", record)

    # Notification architecture — mocked email, honest metadata.
    notify(
        client_name=record["client_name"],
        phone=record["phone"],
        email=record["email"],
        event_type=record["event_type"],
        event_date=record["event_date"] or "—",
        event_location=record["event_location"],
        guest_count=record.get("guest_count"),
        budget_range=record.get("budget_range"),
        photography_requirements=record.get("photography_requirements"),
        message=record.get("message"),
        enquiry_id=inquiry_id,
    )

    formatted_date = ""
    if record["event_date"]:
        try:
            parsed = datetime.fromisoformat(record["event_date"]).date()
            formatted_date = parsed.strftime("%B %-d, %Y")
        except ValueError:
            formatted_date = record["event_date"]

    from ..content import whatsapp_url  # local import to avoid cycles

    return {
        "ok": True,
        "inquiry_id": inquiry_id,
        "name": record["client_name"],
        "event_type": record["event_type"],
        "event_date": record["event_date"] or "",
        "formatted_date": formatted_date or "Date to be decided",
        "event_location": record["event_location"],
        "status": "pending",
        "was_available": is_available,
        "whatsapp_url": whatsapp_url(
            name=record["client_name"],
            event=record["event_type"],
            date=formatted_date or record["event_date"],
            location=record["event_location"],
            ref=inquiry_id,
        ),
        "notification": {
            "mode": "mock",
            "delivery_status": "recorded",
            "note": "Email delivery is not configured — no email was sent.",
        },
    }
