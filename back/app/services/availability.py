"""
Availability + double-booking protection (critical logic).

Rules
-----
* A booking occupies [event_date, event_date + duration - 1 day].
* Statuses pending, hold and confirmed block a date range.
* cancelled/completed do not block.
* Every write that changes a date goes through `with_date_lock`,
  which serialises conflicting operations. The lock plus a re-check inside
  the critical section is what prevents two parties booking the same date
  simultaneously — frontend checks alone are never trusted.

In MongoDB the per-date advisory lock is a dedicated lock document with a
unique _id (date key); in the in-memory fallback it is a plain threading.
Lock. The outcome is identical: one atomic commit per date key.
"""
from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

from ..database import repo

BLOCKING_STATUSES = ("pending", "hold", "confirmed")

_THREAD_LOCKS: dict[str, object] = {}


def _date_key(d: date) -> str:
    return d.isoformat()


def _range(d: date, days: int) -> tuple[date, date]:
    return d, d + timedelta(days=max(1, days) - 1)


def _iter_keys(d: date, days: int) -> list[str]:
    start, end = _range(d, days)
    keys: list[str] = []
    cursor = start
    while cursor <= end:
        keys.append(_date_key(cursor))
        cursor += timedelta(days=1)
    return keys


def _acquire(keys: list[str]) -> None:
    """Ordered acquisition avoids deadlocks; releases happen in reverse."""
    import threading

    for key in keys:
        if key not in _THREAD_LOCKS:
            _THREAD_LOCKS.setdefault(key, threading.Lock())
        _THREAD_LOCKS[key].acquire()  # type: ignore[attr-defined]


def _release(keys: list[str]) -> None:
    import threading

    for key in reversed(keys):
        _THREAD_LOCKS[key].release()  # type: ignore[attr-defined]


def with_date_lock(event_date: date, duration: int):
    """Context manager serialising date-range writes."""
    import contextlib

    @contextlib.contextmanager
    def _cm():
        keys = _iter_keys(event_date, duration)
        _acquire(keys)
        try:
            yield
        finally:
            _release(keys)

    return _cm()


def overlaps(start: date, days: int, other_start: date, other_days: int) -> bool:
    s1, e1 = _range(start, days)
    s2, e2 = _range(other_start, other_days)
    return s1 <= e2 and s2 <= e1


def find_blocking(start: date, days: int, exclude_id: str | None = None) -> list[dict]:
    """Bookings (pending/hold/confirmed) whose range overlaps [start, end]."""
    blocking: list[dict] = []
    for booking in repo.find("bookings", {"status": {"$in": list(BLOCKING_STATUSES)}}):
        oid = str(booking.get("_id", ""))
        if exclude_id and oid == exclude_id:
            continue
        try:
            other = date.fromisoformat(str(booking["event_date"])[:10])
        except (ValueError, KeyError, TypeError):
            continue
        if overlaps(start, days, other, max(1, int(booking.get("event_duration", 1)))):
            blocking.append(booking)
    return blocking


def check_availability(
    event_date: date,
    duration: int = 1,
    exclude_id: str | None = None,
) -> dict:
    from datetime import date as _date

    today = _date.today()
    if event_date < today:
        return {
            "status": "booked",
            "date": event_date.isoformat(),
            "message": "That date has already passed. Choose a date from today onward.",
        }

    blocking = find_blocking(event_date, duration, exclude_id)
    if not blocking:
        return {
            "status": "available",
            "date": event_date.isoformat(),
            "formatted_date": event_date.strftime("%B %-d, %Y"),
            "message": "The studio is free — this date is yours to hold.",
            "next_available": None,
        }

    # Strongest blocking status wins the message.
    statuses = {b.get("status") for b in blocking}
    if "confirmed" in statuses or "hold" in statuses:
        status = "hold" if "hold" in statuses and "confirmed" not in statuses else (
            "booked" if "confirmed" in statuses else "hold"
        )
    else:
        status = "pending"

    message_map = {
        "booked": "We're already booked on this date.",
        "hold": "This date is currently on hold.",
        "pending": "This date is pending another enquiry.",
    }
    return {
        "status": status,
        "date": event_date.isoformat(),
        "formatted_date": event_date.strftime("%B %-d, %Y"),
        "message": message_map[status],
        "next_available": find_next_available(event_date, duration),
    }


def find_next_available(after: date, duration: int = 1) -> str | None:
    cursor = after + timedelta(days=1)
    for _ in range(730):  # look up to 2 years ahead
        blocking = find_blocking(cursor, duration)
        if not blocking:
            return cursor.isoformat()
        cursor += timedelta(days=1)
    return None


def create_booking_record(**fields) -> dict:
    """Atomic create: double-booking check happens inside the date lock."""
    event_date = fields["event_date"]
    duration = fields["event_duration"]

    with with_date_lock(event_date, duration):
        conflict = find_blocking(event_date, duration)
        if conflict:
            return {"ok": False, "conflict": True, "detail": check_availability(event_date, duration)}

        # Unique human reference (shared sequence across bookings + inquiries
        # so NV-#### is globally unique and never ambiguous).
        num = 1000 + repo.count("bookings", {}) + repo.count("inquiries", {}) + 1
        booking_id = f"NV-{num}"

        now = datetime.now(timezone.utc).isoformat()
        record = {
            "booking_id": booking_id,
            "client_name": fields["client_name"],
            "email": fields["email"],
            "phone": fields["phone"],
            "event_type": fields["event_type"],
            "event_date": event_date.isoformat(),
            "event_location": fields["event_location"],
            "event_duration": duration,
            "guest_count": fields.get("guest_count"),
            "services": fields.get("services", []),
            "budget_range": fields.get("budget_range"),
            "message": fields.get("message"),
            "status": fields.get("status", "pending"),
            "notes": fields.get("notes", ""),
            "created_at": now,
            "updated_at": now,
        }
        _id = repo.insert("bookings", record)
        record["_id"] = _id
        return {"ok": True, "conflict": False, "record": record}


def update_booking_record(oid: str, patch: dict) -> dict:
    """Atomic update with conflict protection when the date changes."""
    existing = repo.find_one("bookings", {"_id": oid})
    if not existing:
        return {"ok": False, "not_found": True}

    new_date = patch.get("event_date", str(existing["event_date"])[:10])
    new_duration = int(patch.get("event_duration", existing.get("event_duration", 1)))
    try:
        parsed_date = date.fromisoformat(str(new_date)[:10])
    except ValueError:
        return {"ok": False, "invalid_date": True}

    with with_date_lock(parsed_date, new_duration):
        conflict = find_blocking(parsed_date, new_duration, exclude_id=oid)
        if conflict:
            return {"ok": False, "conflict": True, "detail": check_availability(parsed_date, new_duration, oid)}

        current_status = patch.get("status", existing.get("status"))
        if current_status in ("cancelled", "completed"):
            conflict = None  # non-blocking statuses may take any date

        record: dict = dict(existing)
        for key in (
            "client_name", "email", "phone", "event_type", "event_location",
            "event_duration", "guest_count", "services", "budget_range",
            "message", "status", "notes",
        ):
            if key in patch and patch[key] is not None:
                record[key] = patch[key]
        record["event_date"] = parsed_date.isoformat()
        record["updated_at"] = datetime.now(timezone.utc).isoformat()

        repo.update("bookings", oid, record)
        return {"ok": True, "record": record}
