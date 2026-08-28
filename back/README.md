# Nandini Vision API — FastAPI + MongoDB

Clean backend for availability, bookings, consultations, admin auth,
notification architecture and future calendar sync.

## Run

```bash
cd back
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # adjust as needed
./run.sh                    # http://localhost:8000
```

- Without MongoDB: the API uses an **in-memory dev fallback** so the whole
  platform works in sandboxes. Set `MONGODB_URI` (and optionally
  `REQUIRE_MONGODB=1`) for the real database.
- Production container: `docker compose up mongodb` (see root
  `docker-compose.yml`) then set `MONGODB_URI=mongodb://mongodb:27017`.

## Endpoints

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| GET  | `/api/health` | – | health + mode info |
| GET  | `/api/availability` | – | blocking calendar summary |
| POST | `/api/availability/check` | – | availability result (backend-driven) |
| POST | `/api/bookings` | – | create booking (double-booking protected) |
| GET  | `/api/bookings/{id}` | – | booking by reference |
| POST | `/api/inquiries` | – | consultation enquiry → Mongo + notification |
| POST | `/api/admin/login` | – | JWT + httpOnly cookie (set by Next proxy) |
| GET  | `/api/admin/session` | Bearer | validate session |
| GET  | `/api/admin/stats` | Bearer | dashboard stats |
| GET/POST | `/api/admin/bookings` | Bearer | list / create |
| PATCH/DELETE | `/api/admin/bookings/{id}` | Bearer | manage |
| GET  | `/api/admin/calendar` | Bearer | calendar events + sync info |
| GET  | `/api/admin/calendar/export.ics` | Bearer | real iCal export |
| GET  | `/api/admin/inquiries` | Bearer | consultation list |

## Double-booking protection

Date-range writes acquire a per-date lock, then re-check for blocking
statuses (`pending`, `hold`, `confirmed`) **inside** the critical section
before committing. Frontend checks are never trusted. See
`app/services/availability.py`.

## Notifications

`NOTIFY_MODE=mock|console|email` — mocked by default. Records persist to
the `notifications` collection with honest `delivery_status`. Real email
requires an API key (`RESEND_API_KEY`) plus a transport implementation in
`app/services/notifications.py`. Nothing claims an email was sent.

## Calendar sync

MongoDB is source of truth. `build_ics()` produces a real `.ics` export;
Google/Outlook providers are placeholders that raise "credentials not
configured" instead of faking sync.
