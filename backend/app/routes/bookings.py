from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException
from app.db import bookings
from app.models import BookingOut, BookingUpdate, BookingStatus
from app.auth import get_current_admin

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


def serialize(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("", response_model=list[BookingOut])
async def list_bookings(status: str | None = None, admin=Depends(get_current_admin)):
    query = {"status": status} if status else {}
    docs = await bookings.find(query).sort("date", 1).to_list(1000)
    return [BookingOut(**serialize(d)) for d in docs]


@router.get("/{booking_id}", response_model=BookingOut)
async def get_booking(booking_id: str, admin=Depends(get_current_admin)):
    try:
        oid = ObjectId(booking_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid booking id")
    doc = await bookings.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Booking not found")
    return BookingOut(**serialize(doc))


@router.patch("/{booking_id}", response_model=BookingOut)
async def update_booking(booking_id: str, payload: BookingUpdate, admin=Depends(get_current_admin)):
    try:
        oid = ObjectId(booking_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid booking id")

    current = await bookings.find_one({"_id": oid})
    if not current:
        raise HTTPException(status_code=404, detail="Booking not found")

    updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if "date" in updates:
        updates["date"] = updates["date"].isoformat()

    target_date = updates.get("date", current["date"])
    target_status = updates.get("status", current["status"])

    # Conflict prevention: only one CONFIRMED/HOLD booking per date (excluding this booking).
    if target_status in (BookingStatus.CONFIRMED.value, BookingStatus.HOLD.value):
        conflict = await bookings.find_one({
            "_id": {"$ne": oid},
            "date": target_date,
            "status": {"$in": [BookingStatus.CONFIRMED.value, BookingStatus.HOLD.value]},
        })
        if conflict:
            raise HTTPException(
                status_code=409,
                detail=f"Date {target_date} is already {BookingStatus(conflict['status']).value} for another client.",
            )

    updates["updated_at"] = datetime.now(timezone.utc)
    await bookings.update_one({"_id": oid}, {"$set": updates})
    doc = await bookings.find_one({"_id": oid})
    return BookingOut(**serialize(doc))


@router.delete("/{booking_id}")
async def delete_booking(booking_id: str, admin=Depends(get_current_admin)):
    try:
        oid = ObjectId(booking_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid booking id")
    result = await bookings.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"deleted": True}
