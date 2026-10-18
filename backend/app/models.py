from __future__ import annotations
from datetime import datetime, date, timedelta, timezone
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


def _earliest_event_date() -> date:
    """Earliest date we accept for an event. One day of slack covers visitors who are
    ahead of UTC (e.g. India at 1am), so a legitimate "today" is never rejected."""
    return datetime.now(timezone.utc).date() - timedelta(days=1)


def _require_not_past(v: date) -> date:
    if v < _earliest_event_date():
        raise ValueError("Event date cannot be in the past")
    return v


class BookingStatus(str, Enum):
    PENDING = "PENDING"
    HOLD = "HOLD"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"


class AvailabilityStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    PENDING = "PENDING"
    HOLD = "HOLD"
    CONFIRMED = "CONFIRMED"
    UNAVAILABLE = "UNAVAILABLE"


class BudgetRange(str, Enum):
    UNDISCLOSED = "Prefer not to say"
    UNDER_50K = "Under \u20b950,000"
    B50K_1L = "\u20b950,000\u2013\u20b91,00,000"
    B1L_2L = "\u20b91,00,000\u2013\u20b92,00,000"
    B2L_3L = "\u20b92,00,000\u2013\u20b93,00,000"
    OVER_3L = "\u20b93,00,000+"
    BESPOKE = "Bespoke / Discuss"


# ---------- Enquiry / Consultation ----------

class ConsultationCreate(BaseModel):
    client_name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=7, max_length=20)
    email: EmailStr
    event_type: str
    date: date
    location: str
    guest_count: Optional[int] = None
    requirements: Optional[str] = None
    budget: BudgetRange = BudgetRange.UNDISCLOSED
    message: Optional[str] = None

    @field_validator("date")
    @classmethod
    def date_not_past(cls, v: date) -> date:
        return _require_not_past(v)

    @field_validator("phone")
    @classmethod
    def clean_phone(cls, v: str) -> str:
        digits = "".join(ch for ch in v if ch.isdigit() or ch == "+")
        if len(digits) < 7:
            raise ValueError("Phone number looks too short")
        return digits


class InquiryOut(BaseModel):
    enquiry_id: str
    client_name: str
    phone: str
    email: EmailStr
    event_type: str
    date: date
    location: str
    guest_count: Optional[int] = None
    requirements: Optional[str] = None
    budget: str
    message: Optional[str] = None
    created_at: datetime
    status: BookingStatus = BookingStatus.PENDING
    email_delivery: str = "mock"  # "sent" | "mock" | "failed"


# ---------- Availability ----------

class AvailabilityCheck(BaseModel):
    """Availability is decided by date alone. The other fields are optional context and do
    not change the result, so clients are not required to send them."""

    date: date
    event_type: Optional[str] = None
    location: Optional[str] = None
    duration: str = "Full Day"

    @field_validator("date")
    @classmethod
    def date_not_past(cls, v: date) -> date:
        return _require_not_past(v)


class AvailabilityResult(BaseModel):
    date: date
    status: AvailabilityStatus
    note: Optional[str] = None


# ---------- Bookings (admin) ----------

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    date: Optional[date] = None
    location: Optional[str] = None
    notes: Optional[str] = None


class BookingOut(BaseModel):
    id: str
    client_name: str
    phone: str
    email: EmailStr
    event_type: str
    date: date
    duration: Optional[str] = None
    location: str
    guest_count: Optional[int] = None
    requirements: Optional[str] = None
    budget: Optional[str] = None
    message: Optional[str] = None
    status: BookingStatus
    notes: Optional[str] = None
    enquiry_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    # Only set on the response to a status change that triggered a customer confirmation
    # email: "sent" | "mock" | "failed". Lets the admin UI report what really happened.
    confirmation_email: Optional[str] = None


# ---------- Auth ----------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Notifications ----------

class NotificationOut(BaseModel):
    id: str
    type: str
    title: str
    payload: dict
    read: bool
    created_at: datetime
