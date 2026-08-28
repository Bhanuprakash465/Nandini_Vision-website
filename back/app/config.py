"""
Nandini Vision backend configuration — everything comes from environment
variables; secrets never reach the frontend.

MONGODB_URI   e.g. mongodb://localhost:27017 (or an Atlas URI)
              If unset or unreachable, the API falls back to an in-memory
              store so the platform runs end-to-end in sandbox/dev.
"""
from __future__ import annotations

import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:
    # --- General -------------------------------------------------------
    app_name: str = "Nandini Vision API"
    env: str = os.getenv("APP_ENV", "development")

    # --- Database ------------------------------------------------------
    mongodb_uri: str = os.getenv("MONGODB_URI", "")
    mongodb_db: str = os.getenv("MONGODB_DB", "nandini_vision")
    # Keep the API usable without MongoDB in sandbox/dev:
    # set REQUIRE_MONGODB=1 to fail fast instead of falling back.
    require_mongodb: bool = os.getenv("REQUIRE_MONGODB", "0") == "1"

    # --- Auth ----------------------------------------------------------
    # Strong default is REQUIRED in production. The dev default exists so
    # the demo dashboard is reachable without setup.
    admin_email: str = os.getenv("ADMIN_EMAIL", "admin@nandinistudio.demo")
    admin_password: str = os.getenv("ADMIN_PASSWORD", "Nandini@2026")
    jwt_secret: str = os.getenv(
        "JWT_SECRET",
        "dev-only-secret-change-me-before-production",
    )
    jwt_expiry_hours: int = int(os.getenv("JWT_EXPIRY_HOURS", "72"))

    # --- Notifications -------------------------------------------------
    # Real email delivery is NOT configured. NOTIFY_MODE stays "mock"
    # until a provider/API key exists. We never claim an email was sent.
    notify_mode: str = os.getenv("NOTIFY_MODE", "mock")  # mock | console | email
    email_from: str = os.getenv("EMAIL_FROM", "hello@nandinistudio.demo")

    # --- CORS ----------------------------------------------------------
    cors_origins: list[str] = [
        o.strip()
        for o in os.getenv(
            "CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
        ).split(",")
        if o.strip()
    ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
