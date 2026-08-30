from datetime import datetime, timezone
from fastapi import APIRouter
from app.db import bookings
from app.models import AvailabilityCheck, AvailabilityResult, AvailabilityStatus

router = APIRouter(prefix="/api/availability", tags=["availability"])

# Statuses on an existing booking that block a date outright.
BLOCKING_STATUSES = ["CONFIRMED", "HOLD"]
SOFT_STATUSES = ["PENDING"]


@router.post("/check", response_model=AvailabilityResult)
async def check_availability(payload: AvailabilityCheck):
    date_str = payload.date.isoformat()

    blocking = await bookings.find_one({"date": date_str, "status": {"$in": BLOCKING_STATUSES}})
    if blocking:
        return AvailabilityResult(
            date=payload.date,
            status=AvailabilityStatus(blocking["status"]),
            note="This date already has a confirmed or held booking with us.",
        )

    pending = await bookings.find_one({"date": date_str, "status": {"$in": SOFT_STATUSES}})
    if pending:
        return AvailabilityResult(
            date=payload.date,
            status=AvailabilityStatus.PENDING,
            note="We have a pending enquiry for this date — reach out soon to secure it.",
        )

    return AvailabilityResult(
        date=payload.date,
        status=AvailabilityStatus.AVAILABLE,
        note="This date is open. Book a consultation to hold it.",
    )
