"""Pydantic schemas — validated request/response contracts."""
from __future__ import annotations

import re
from datetime import date, datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

STATUSES = ("available", "pending", "hold", "confirmed", "cancelled", "completed")

PHONE_RE = re.compile(r"^[+\d][\d\s\-()]{7,}$")


class AvailabilityCheck(BaseModel):
    event_date: date
    event_location: str = Field(min_length=2, max_length=200)
    event_type: str = Field(default="Wedding Photography", max_length=120)
    event_duration: int = Field(default=1, ge=1, le=30)


class BookingCreate(BaseModel):
    client_name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    phone: str = Field(min_length=8, max_length=32)
    event_type: str = Field(min_length=2, max_length=120)
    event_date: date
    event_location: str = Field(min_length=2, max_length=200)
    event_duration: int = Field(default=1, ge=1, le=30)
    guest_count: str | None = None
    services: list[str] = Field(default_factory=list)
    budget_range: str | None = None
    message: str | None = Field(default=None, max_length=5000)
    status: Literal["pending", "hold", "confirmed"] = "pending"

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, v: str) -> str:
        if not PHONE_RE.match(v):
            raise ValueError("Enter a valid phone number.")
        return v.strip()


class InquiryCreate(BaseModel):
    """Consultation / contact enquiry. Mirrors BookingCreate so the
    frontend can send one shape; the backend decides persistence."""
    name: str = Field(min_length=2, max_length=160)
    phone: str = Field(default="", max_length=32)
    email: EmailStr
    event_type: str = Field(min_length=2, max_length=120, default="Other")
    event_date: date | None = None
    event_location: str = Field(min_length=2, max_length=200)
    event_duration: int = Field(default=1, ge=1, le=30)
    guest_count: str | None = None
    services: list[str] = Field(default_factory=list)
    budget_range: str | None = None
    photography_requirements: str | None = Field(default=None, max_length=5000)
    message: str | None = Field(default=None, max_length=5000)

    @field_validator("phone")
    @classmethod
    def optional_phone(cls, v: str) -> str:
        if v and not PHONE_RE.match(v):
            raise ValueError("Enter a valid phone number.")
        return v.strip()


class BookingUpdate(BaseModel):
    client_name: str | None = Field(default=None, min_length=2, max_length=160)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, min_length=8, max_length=32)
    event_type: str | None = Field(default=None, min_length=2, max_length=120)
    event_date: date | None = None
    event_location: str | None = Field(default=None, min_length=2, max_length=200)
    event_duration: int | None = Field(default=None, ge=1, le=30)
    guest_count: str | None = None
    services: list[str] | None = None
    budget_range: str | None = None
    message: str | None = Field(default=None, max_length=5000)
    status: Literal["pending", "hold", "confirmed", "cancelled", "completed"] | None = None
    notes: str | None = Field(default=None, max_length=5000)


class AdminLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class BookingOut(BaseModel):
    _id: str
    booking_id: str
    client_name: str
    email: str
    phone: str
    event_type: str
    event_date: str
    event_location: str
    event_duration: int
    guest_count: str | None = None
    services: list[str] = Field(default_factory=list)
    budget_range: str | None = None
    message: str | None = None
    status: str
    notes: str | None = None
    created_at: str
    updated_at: str


class ApiError(BaseModel):
    detail: str
    code: str | None = None


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def to_pydantic_booking(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "_id": str(doc.get("_id", "")),
        "booking_id": doc.get("booking_id", ""),
        "client_name": doc.get("client_name", ""),
        "email": doc.get("email", ""),
        "phone": doc.get("phone", ""),
        "event_type": doc.get("event_type", ""),
        "event_date": str(doc.get("event_date", ""))[:10],
        "event_location": doc.get("event_location", ""),
        "event_duration": doc.get("event_duration", 1),
        "guest_count": doc.get("guest_count"),
        "services": doc.get("services", []),
        "budget_range": doc.get("budget_range"),
        "message": doc.get("message"),
        "status": doc.get("status", "pending"),
        "notes": doc.get("notes"),
        "created_at": str(doc.get("created_at", "")),
        "updated_at": str(doc.get("updated_at", "")),
    }
