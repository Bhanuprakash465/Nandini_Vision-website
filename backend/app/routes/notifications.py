from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException
from app.db import notifications
from app.models import NotificationOut
from app.auth import get_current_admin

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


def serialize(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("", response_model=list[NotificationOut])
async def list_notifications(admin=Depends(get_current_admin)):
    docs = await notifications.find().sort("created_at", -1).to_list(200)
    return [NotificationOut(**serialize(d)) for d in docs]


@router.get("/unread-count")
async def unread_count(admin=Depends(get_current_admin)):
    count = await notifications.count_documents({"read": False})
    return {"count": count}


@router.patch("/{notification_id}/read", response_model=NotificationOut)
async def mark_read(notification_id: str, admin=Depends(get_current_admin)):
    try:
        oid = ObjectId(notification_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid notification id")
    await notifications.update_one({"_id": oid}, {"$set": {"read": True}})
    doc = await notifications.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Notification not found")
    return NotificationOut(**serialize(doc))


@router.patch("/read-all")
async def mark_all_read(admin=Depends(get_current_admin)):
    result = await notifications.update_many({"read": False}, {"$set": {"read": True}})
    return {"updated": result.modified_count}
