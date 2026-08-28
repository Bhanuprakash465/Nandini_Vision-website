from fastapi import APIRouter, HTTPException

from ..models import AvailabilityCheck
from ..services.availability import check_availability

router = APIRouter(prefix="/api/availability", tags=["availability"])


@router.get("")
def available_dates() -> dict:
    """Calendar summary for the availability UI (never hardcoded)."""
    from ..services.availability import find_blocking

    from datetime import date

    blocking = find_blocking(date.today(), 1)
    return {"count": len(blocking), "note": "Blocking statuses: pending, hold, confirmed"}


@router.post("/check")
def check(payload: AvailabilityCheck) -> dict:
    try:
        return check_availability(payload.event_date, payload.event_duration)
    except Exception:  # noqa: BLE001 — never leak internals
        raise HTTPException(status_code=503, detail="We couldn't check right now. Please try again.")
