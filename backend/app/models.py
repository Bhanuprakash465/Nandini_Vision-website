from __future__ import annotations
from datetime import datetime, date
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


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
    event_type: str
    date: date
    location: str
    duration: str = "Full Day"


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
