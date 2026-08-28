"""Admin authentication — password hashing + signed JWT (HS256)."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

import jwt

from .config import get_settings

settings = get_settings()

_ALGO = "HS256"

# Standard-library pbkdf2_hmac (no extra dependency; bcrypt/argon2 can be
# swapped in later without touching callers).
import hashlib
import hmac
import secrets

_ITERATIONS = 200_000


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), bytes.fromhex(salt), _ITERATIONS
    ).hex()
    return f"pbkdf2_sha256${_ITERATIONS}${salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    try:
        _, iterations, salt, digest = stored.split("$")
        calc = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode(),
            bytes.fromhex(salt),
            int(iterations),
        ).hex()
        return hmac.compare_digest(calc, digest)
    except (ValueError, TypeError):
        return False


def create_token(email: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": email,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=settings.jwt_expiry_hours)).timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=_ALGO)


def decode_token(token: str) -> str | None:
    """Returns the subject email if the token is valid, else None."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[_ALGO])
        return str(payload.get("sub", ""))
    except jwt.PyJWTError:
        return None
