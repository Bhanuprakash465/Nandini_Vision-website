"""Test harness: runs the real FastAPI app against an in-memory MongoDB (mongomock-motor).

No production database, email provider or network is touched. Email sending is replaced
with a recorder so tests can assert exactly what would have been sent.
"""
import os

# Must be set before app.config is imported.
os.environ.setdefault("JWT_SECRET", "test-secret-test-secret-test-secret-1234")
os.environ.setdefault("FRONTEND_ORIGIN", "http://testserver")

import pytest
from fastapi.testclient import TestClient
from mongomock_motor import AsyncMongoMockClient

import app.db as db_module
import app.auth as auth_module
from app.auth import hash_password
from app.routes import auth as auth_routes
from app.routes import availability, bookings, enquiries, notifications

ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "correct horse battery staple"


@pytest.fixture()
def sent_emails(monkeypatch):
    """Replaces both email senders; returns the list of calls made."""
    calls = []

    async def fake_owner(doc):
        calls.append(("owner", doc["email"]))
        return "sent"

    async def fake_customer(doc):
        calls.append(("customer", doc["email"]))
        return "sent"

    monkeypatch.setattr(enquiries, "send_owner_enquiry_email", fake_owner)
    monkeypatch.setattr(bookings, "send_booking_confirmation_email", fake_customer)
    return calls


@pytest.fixture()
def client(monkeypatch, sent_emails):
    mongo = AsyncMongoMockClient()
    database = mongo["nandini_vision_test"]
    collections = {
        "inquiries": database["inquiries"],
        "bookings": database["bookings"],
        "notifications": database["notifications"],
        "admin_users": database["admin_users"],
    }
    # Modules do `from app.db import bookings`, so patch every place the name was bound.
    for module in (db_module, auth_module, auth_routes, availability, bookings, enquiries, notifications):
        for name, coll in collections.items():
            if hasattr(module, name):
                monkeypatch.setattr(module, name, coll)

    from app.main import app

    with TestClient(app) as c:
        c.collections = collections
        yield c


@pytest.fixture()
def admin_headers(client):
    import asyncio

    asyncio.run(client.collections["admin_users"].insert_one(
        {"email": ADMIN_EMAIL, "password_hash": hash_password(ADMIN_PASSWORD)}
    ))
    r = client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}
