# Nandini Vision

Premium photography studio website — Next.js frontend + FastAPI/MongoDB backend.

This is a real, tested local project (not a hosted demo). See `PROJECT_PROGRESS.md` for
exactly what's built vs. still pending.

## Quick Start (local development)

### 1. MongoDB

Easiest: use the included Docker Compose to run Mongo + the API together —

```bash
docker compose up mongo -d
```

Or point at a MongoDB Atlas free-tier cluster instead — either works, you just need a URI.

### 2. Backend

```bash
cd backend
cp .env.example .env        # edit JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI
pip install -r requirements.txt
python seed_admin.py         # creates your first owner login
uvicorn app.main:app --reload --port 8000
```

API docs at http://localhost:8000/docs once running.

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run build && npm start   # or `npm run dev` for hot reload
```

Site at http://localhost:3000. Admin at http://localhost:3000/login using the
ADMIN_EMAIL / ADMIN_PASSWORD you set in `backend/.env`.

## What's real vs. simulated

- **Availability checker, consultation form, admin dashboard, notifications** all hit the
  real FastAPI + MongoDB backend. Availability is decided by **date only**: a date is
  reported as open only when no PENDING, HOLD or CONFIRMED booking exists for it.
  Event type and location are optional and only pre-fill the enquiry form.
- **Owner notification email** (new enquiry) uses Resend (`RESEND_API_KEY`, `EMAIL_FROM`,
  `OWNER_EMAIL`). Without a key it runs in mock mode and says so.
- **Customer confirmation email** (sent once, when an admin changes a booking to CONFIRMED)
  uses Gmail SMTP (`SMTP_EMAIL`, `SMTP_APP_PASSWORD`). Resend's `onboarding@resend.dev`
  sender can only deliver to the Resend account owner, so it cannot email customers until a
  domain is verified. The admin dashboard reports whether the email was really sent,
  not configured, or failed.
- **Imagery**: every photograph is a labelled placeholder until real files are added. See
  `frontend/public/images/README.md`.
- **Contact details** (email, Instagram, WhatsApp) and the showreel come from
  `NEXT_PUBLIC_*` variables and are hidden when unset. See `frontend/.env.example`.
- **Testimonials** in `frontend/lib/data.ts` are sample copy and are not shown until each is
  marked `verified: true` by someone with permission to publish it.

## Tests and checks

```bash
# Backend (in-memory MongoDB, no network, no real email)
cd backend
pip install -r requirements-dev.txt
python -m pytest

# Frontend
cd frontend
npm ci
npx tsc --noEmit
npm run lint
npm run build
```

## Deploying for real

1. **Database**: create a MongoDB Atlas cluster (free tier is fine to start), get its
   connection string.
2. **Backend**: deploy `backend/` (Dockerfile included) to Render, Fly.io, Railway, or
   similar. Set the same env vars as `.env.example`, pointing `MONGODB_URI` at Atlas.
3. **Frontend**: deploy `frontend/` to Vercel (native Next.js support). Set
   `NEXT_PUBLIC_API_URL` to your deployed backend URL, and set `FRONTEND_ORIGIN` on the
   backend to your deployed frontend URL (for CORS).
4. **Email**: sign up for Resend, add `RESEND_API_KEY` to the backend env to switch from
   mock to real delivery.
5. Run `python seed_admin.py` once against the production database to create the owner
   login.

None of this has been done for you — it requires accounts and credentials only you can
provide. This project is fully ready for that step whenever you are.
