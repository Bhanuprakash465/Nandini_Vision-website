from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.mongodb_uri)
db = client[settings.mongodb_db_name]

inquiries = db["inquiries"]
bookings = db["bookings"]
notifications = db["notifications"]
admin_users = db["admin_users"]


async def ensure_indexes():
    """Create indexes required for correctness (uniqueness, conflict prevention, lookups)."""
    await bookings.create_index([("date", 1), ("status", 1)])
    await inquiries.create_index([("enquiry_id", 1)], unique=True)
    await inquiries.create_index([("created_at", -1)])
    await notifications.create_index([("created_at", -1)])
    await notifications.create_index([("read", 1)])
    await admin_users.create_index([("email", 1)], unique=True)
