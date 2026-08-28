"""
Notification architecture.

Real email delivery is NOT configured (no API key). This module:
  1. persists a notification record to MongoDB (`notifications` collection)
  2. dispatches through a pluggable notifier:
       - MockNotifier  (default) — records "delivery_status: mocked", logs to console,
         and NEVER claims an email was sent.
       - EmailNotifier  — ready to be wired to Resend/SES/Postmark when
         NOTIFY_MODE=email and RESEND_API_KEY exist. Raises a clear error
         otherwise rather than silently "sending".
  3. keeps a payload identical to the studio-facing spec.
"""
from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

from ..database import repo


def build_payload(**data: Any) -> dict[str, Any]:
    return {
        "event": "New Nandini Vision Consultation",
        "client_name": data.get("client_name", ""),
        "phone": data.get("phone", ""),
        "email": data.get("email", ""),
        "event_type": data.get("event_type", ""),
        "event_date": data.get("event_date", ""),
        "event_location": data.get("event_location", ""),
        "guest_count": data.get("guest_count") or "—",
        "budget_range": data.get("budget_range") or "—",
        "photography_requirements": data.get("photography_requirements") or "—",
        "message": data.get("message") or "—",
        "enquiry_id": data.get("enquiry_id", ""),
        "submitted": data.get("submitted", ""),
    }


class MockNotifier:
    mode = "mock"

    def send(self, payload: dict[str, Any]) -> dict[str, Any]:
        # Log locally; mark clearly as mocked. No external call is made.
        print("[notify][MOCK] New enquiry:", payload.get("enquiry_id"))
        return {
            "mode": self.mode,
            "delivery_status": "mocked",
            "message": "Email delivery is not configured — notification recorded only.",
        }


class ConsoleNotifier:
    mode = "console"

    def send(self, payload: dict[str, Any]) -> dict[str, Any]:
        lines = [
            "\n========== NOTIFICATION ==========",
            payload.get("event", ""),
            f"Client: {payload.get('client_name', '')}",
            f"Phone: {payload.get('phone', '')}",
            f"Email: {payload.get('email', '')}",
            "Event:",
            f"  {payload.get('event_type', '')}",
            f"  {payload.get('event_date', '')}",
            f"  {payload.get('event_location', '')}",
            f"Guest Count: {payload.get('guest_count', '')}",
            f"Budget: {payload.get('budget_range', '')}",
            f"Photography Requirements: {payload.get('photography_requirements', '')}",
            f"Message: {payload.get('message', '')}",
            f"Enquiry ID: {payload.get('enquiry_id', '')}",
            f"Submitted: {payload.get('submitted', '')}",
            "===============================\n",
        ]
        print("\n".join(lines))
        return {"mode": self.mode, "delivery_status": "printed"}


class EmailNotifier:
    """Wired for a real provider (Resend/SES) — requires credentials."""

    mode = "email"

    def send(self, payload: dict[str, Any]) -> dict[str, Any]:
        api_key = os.getenv("RESEND_API_KEY") or os.getenv("EMAIL_API_KEY")
        if not api_key:
            return {
                "mode": self.mode,
                "delivery_status": "not_sent",
                "message": (
                    "Email integration requires credentials (RESEND_API_KEY). "
                    "No email was sent."
                ),
            }
        # Real provider call would go here (import + POST). Intentionally
        # unimplemented until a provider + key is configured — never fake it.
        raise NotImplementedError(
            "Email provider configured but transport not implemented. "
            "Wire Resend/SES in transport.py before enabling NOTIFY_MODE=email."
        )


_NOTIFIERS = {
    "mock": MockNotifier(),
    "console": ConsoleNotifier(),
    "email": EmailNotifier(),
}


def notify(mode: str | None = None, **data: Any) -> dict[str, Any]:
    """Persist + dispatch a studio notification. Always returns truthful
    delivery metadata."""
    payload = build_payload(**data)
    if not payload.get("enquiry_id"):
        payload["enquiry_id"] = f"NTF-{int(datetime.now(timezone.utc).timestamp())}"
    if not payload.get("submitted"):
        payload["submitted"] = datetime.now(timezone.utc).isoformat()

    notifier = _NOTIFIERS.get(mode or os.getenv("NOTIFY_MODE", "mock"), _NOTIFIERS["mock"])
    result = notifier.send(payload)

    record = {
        "notification_id": payload["enquiry_id"],
        "payload": payload,
        "mode": result.get("mode", notifier.mode),
        "delivery_status": result.get("delivery_status", "recorded"),
        "message": result.get("message", ""),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    repo.insert("notifications", record)
    return payload
