"""Nandini Vision API — FastAPI entrypoint."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import repo
from .routers import admin, availability, bookings, inquiries

settings = get_settings()

app = FastAPI(
    title="Nandini Vision API",
    description="Booking, availability + consultation API for Nandini Vision.",
    version="1.0.0",
    docs_url="/docs" if settings.env != "production" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(availability.router)
app.include_router(bookings.router)
app.include_router(inquiries.router)
app.include_router(admin.router)


@app.get("/api/health")
def health() -> dict:
    return {
        "ok": True,
        "service": settings.app_name,
        "env": settings.env,
        "database": "mongodb" if repo.online else "in-memory (dev fallback)",
        "notifications": settings.notify_mode,
        "email_integration": "not configured",
    }


@app.get("/")
def root() -> dict:
    return {"ok": True, "service": settings.app_name}
