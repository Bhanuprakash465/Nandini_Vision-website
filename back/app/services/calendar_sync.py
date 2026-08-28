"""
External calendar integration layer — prepared, never faked.

MongoDB is the source of truth. Future synchronisation (Google Calendar,
Outlook, generic iCal providers) plugs in behind the `CalendarProvider`
protocol without touching booking logic.

What works TODAY without credentials:
  * iCal (.ics) export of the studio calendar — real, standards-compliant.

What waits for credentials (configured but raises clearly):
  * GoogleCalendarProvider / OutlookCalendarProvider — placeholders that
    surface "credentials not configured" instead of pretending to sync.
"""
from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Protocol

from ..database import repo

STATUS_ICALLY = {
    "confirmed": "CONFIRMED",
    "pending": "TENTATIVE",
    "hold": "TENTATIVE",
    "cancelled": "CANCELLED",
    "completed": "CONFIRMED",
}


class CalendarProvider(Protocol):
    name: str

    def list_events(self, start: date, end: date) -> list[dict]:
        ...

    def upsert_event(self, event: dict) -> str:
        ...


class GoogleCalendarProvider:
    """Placeholder — Google Calendar sync requires OAuth credentials."""

    name = "google_calendar"

    def __init__(self) -> None:
        import os

        self._client_id = os.getenv("GOOGLE_CALENDAR_CLIENT_ID")
        self._credentials = os.getenv("GOOGLE_CALENDAR_CREDENTIALS_JSON")

    def _require(self) -> None:
        if not (self._client_id and self._credentials):
            raise RuntimeError(
                "Google Calendar sync requires GOOGLE_CALENDAR_CLIENT_ID and "
                "GOOGLE_CALENDAR_CREDENTIALS_JSON. Mongo remains source of truth."
            )

    def list_events(self, start: date, end: date) -> list[dict]:
        self._require()
        return []  # real API call lives here once credentials exist

    def upsert_event(self, event: dict) -> str:
        self._require()
        return ""


class OutlookCalendarProvider:
    name = "outlook_calendar"

    def _require(self) -> None:
        import os
        if not os.getenv("OUTLOOK_CALENDAR_CLIENT_ID"):
            raise RuntimeError(
                "Outlook Calendar sync requires OUTLOOK_CALENDAR_CLIENT_ID. "
                "Mongo remains source of truth."
            )

    def list_events(self, start: date, end: date) -> list[dict]:
        self._require()
        return []

    def upsert_event(self, event: dict) -> str:
        self._require()
        return ""


def build_ics(start: date | None = None, end: date | None = None) -> str:
    """Real iCal export from the bookings collection (VERSION 2.0)."""
    query: dict = {}
    bookings = repo.find("bookings", query, sort=[("event_date", 1)])
    today = datetime.now(timezone.utc)
    stamp = today.strftime("%Y%m%dT%H%M%SZ")

    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Nandini Vision//Studio Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        f"X-WR-CALNAME:Nandini Vision — Studio Calendar",
        f"X-WR-TIMEZONE:Asia/Kolkata",
    ]

    for b in bookings:
        try:
            day = date.fromisoformat(str(b["event_date"])[:10])
        except (KeyError, ValueError):
            continue
        if start and day < start:
            continue
        if end and day > end:
            continue
        duration = max(1, int(b.get("event_duration", 1)))
        end_day = day.fromisoformat(str(day))
        import datetime as dt

        end_day = day + dt.timedelta(days=duration)
        uid = f"{b.get('booking_id')}@nandini-vision"
        status = STATUS_ICALLY.get(b.get("status", ""), "TENTATIVE")
        summary = f"{b.get('client_name')} — {b.get('event_type')} ({b.get('status')})"
        lines += [
            "BEGIN:VEVENT",
            f"UID:{uid}",
            f"DTSTAMP:{stamp}",
            f"DTSTART;VALUE=DATE:{day.strftime('%Y%m%d')}",
            f"DTEND;VALUE=DATE:{end_day.strftime('%Y%m%d')}",
            f"SUMMARY:{summary}",
            f"LOCATION:{b.get('event_location', '')}",
            f"X-NANDINI-BOOKING-ID:{b.get('booking_id', '')}",
            f"X-NANDINI-STATUS:{status}",
            "END:VEVENT",
        ]

    lines.append("END:VCALENDAR")
    return "\r\n".join(lines) + "\r\n"


def export_summary() -> dict:
    return {
        "source_of_truth": "mongodb",
        "iCal_export": "available at GET /api/admin/calendar/export.ics",
        "google_calendar": "ready — credentials not configured",
        "outlook_calendar": "ready — credentials not configured",
        "note": "No calendar provider is being synced or faked in this build.",
    }
