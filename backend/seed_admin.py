"""
Run once to create the first admin user:
    python seed_admin.py
Reads ADMIN_EMAIL / ADMIN_PASSWORD from .env.
"""
import asyncio
from app.config import settings
from app.db import admin_users
from app.auth import hash_password


async def main():
    existing = await admin_users.find_one({"email": settings.admin_email})
    if existing:
        print(f"Admin user already exists: {settings.admin_email}")
        return
    await admin_users.insert_one({
        "email": settings.admin_email,
        "password_hash": hash_password(settings.admin_password),
    })
    print(f"Created admin user: {settings.admin_email}")


if __name__ == "__main__":
    asyncio.run(main())
