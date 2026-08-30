import secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from app.db import inquiries, bookings, notifications
from app.models import ConsultationCreate, InquiryOut, BookingStatus
from app.utils.email import send_owner_enquiry_email
from app.auth import get_current_admin

router = APIRouter(prefix="/api/enquiries", tags=["enquiries"])


def generate_enquiry_id() -> str:
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"NV-{today}-{secrets.token_hex(2).upper()}"


@router.post("", response_model=InquiryOut)
async def create_enquiry(payload: ConsultationCreate):
    # Duplicate-submission protection: same email + date + event within the last 2 minutes.
    window_start = datetime.now(timezone.utc) - timedelta(minutes=2)
    existing = await inquiries.find_one({
        "email": payload.email,
        "date": payload.date.isoformat(),
        "event_type": payload.event_type,
        "created_at": {"$gte": window_start},
    })
    if existing:
        existing["email_delivery"] = existing.get("email_delivery", "mock")
        return InquiryOut(**existing)

    enquiry_id = generate_enquiry_id()
    now = datetime.now(timezone.utc)

    doc = {
        "enquiry_id": enquiry_id,
        "client_name": payload.client_name,
        "phone": payload.phone,
        "email": payload.email,
        "event_type": payload.event_type,
        "date": payload.date.isoformat(),
        "location": payload.location,
        "guest_count": payload.guest_count,
        "requirements": payload.requirements,
        "budget": payload.budget.value,
        "message": payload.message,
        "status": BookingStatus.PENDING.value,
        "created_at": now,
    }

    email_status = await send_owner_enquiry_email(doc)
    doc["email_delivery"] = email_status
    await inquiries.insert_one(doc)

    # Mirror as a PENDING booking so the availability checker & calendar see it immediately.
    await bookings.insert_one({
        **{k: v for k, v in doc.items() if k != "email_delivery"},
        "duration": "Full Day",
        "notes": None,
        "updated_at": now,
    })

    await notifications.insert_one({
        "type": "new_enquiry",
        "title": f"New enquiry — {payload.event_type} — {payload.date.isoformat()}",
        "payload": {
            "enquiry_id": enquiry_id,
            "client_name": payload.client_name,
            "phone": payload.phone,
            "email": payload.email,
            "event_type": payload.event_type,
            "date": payload.date.isoformat(),
            "location": payload.location,
            "guest_count": payload.guest_count,
            "requirements": payload.requirements,
            "budget": payload.budget.value,
            "message": payload.message,
        },
        "read": False,
        "created_at": now,
    })

    return InquiryOut(**doc)


@router.get("", response_model=list[InquiryOut])
async def list_enquiries(admin=Depends(get_current_admin)):
    docs = await inquiries.find().sort("created_at", -1).to_list(500)
    for d in docs:
        d.setdefault("email_delivery", "mock")
    return [InquiryOut(**d) for d in docs]


@router.get("/{enquiry_id}", response_model=InquiryOut)
async def get_enquiry(enquiry_id: str, admin=Depends(get_current_admin)):
    doc = await inquiries.find_one({"enquiry_id": enquiry_id})
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Enquiry not found")
    doc.setdefault("email_delivery", "mock")
    return InquiryOut(**doc)
