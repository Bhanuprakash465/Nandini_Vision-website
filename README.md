# Nandini Vision — Premium Photography Studio Website & Booking Platform

A premium photography studio website and booking platform for **Nandini Vision**
(Andhra Pradesh, India · bookings worldwide).

**Brand statement:** *Photography for the beautifully lived.*
**Supporting statement:** *The feeling between frames.*

## How to run (everything, locally)

```bash
# 1) Install frontend dependencies
npm install

# 2) Start the API (FastAPI) — terminal A
cd back
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
./run.sh                 # → http://localhost:8000

# 3) Start the website — terminal B
npm run dev              # → http://localhost:3000  (open this)
```

Open **http://localhost:3000** in your browser. That is the full website —
public pages, live availability, consultation → WhatsApp flow, and a
password-protected owner dashboard at **http://localhost:3000/admin**.

### Demo admin credentials

```
Email:    admin@nandinistudio.demo
Password: Nandini@2026
```

(Configurable via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `back/.env`.)

### Database

The backend uses **MongoDB** when `MONGODB_URI` is set (e.g. Atlas, or
`docker compose up mongodb`). **Without MongoDB it transparently falls back
to an in-memory store** so the platform runs end-to-end in any sandbox/local
dev. Set `REQUIRE_MONGODB=1` to fail fast instead.

> Note: with the in-memory fallback, data resets when the API restarts.
> Use MongoDB for persistent data.

## The website

| Route | What it is |
| ----- | ---------- |
| `/` | Homepage: preloader, hero, cinematic showreel, philosophy, selected work, services, testimonials, collections, Instagram, availability, CTA |
| `/work` | Portfolio archive with animated category filters |
| `/work/[slug]` | Project detail pages (4 projects, editorial galleries, prev/next) |
| `/services` | 11 services in editorial numbered rows |
| `/about` | Studio story, philosophy, approach, team |
| `/availability` | Live availability checker (backend-driven, never hardcoded) |
| `/consultation` | Consultation form → MongoDB → personalized confirmation → WhatsApp |
| `/contact` | Contact details + enquiry form |
| `/login` | Owner login (JWT + httpOnly cookie) |
| `/admin` | Owner dashboard: stats, calendar (month/week/agenda), booking management |
| `/sitemap.xml`, `/robots.txt` | SEO |

## Backend (FastAPI + MongoDB)

`back/` — see `back/README.md` for endpoints. Highlights:

- **Double-booking protection**: date-range locks + re-check inside the
  critical section; two confirmed bookings can never occupy the same date.
  A 409 conflict is returned to the second attempt.
- **Availability** is always computed from the database (statuses:
  available / pending / hold / confirmed / cancelled / completed).
- **Notifications**: every enquiry is saved to MongoDB and routed through a
  pluggable notifier. Email is **mocked** (`NOTIFY_MODE=mock`) until a
  provider API key exists — the code never claims an email was sent.
- **Calendar integration layer**: real iCal `.ics` export built in; Google
  Calendar / Outlook providers are prepared but raise "credentials not
  configured" instead of faking sync. MongoDB is the source of truth.

## Tech

Next.js 16 (App Router, React 19, TypeScript) · FastAPI · MongoDB ·
self-hosted variable fonts (Playfair Display + Manrope) · next/image
(AVIF/WebP) · optimized mp4 showreel (2MB desktop, 900KB mobile) ·
CSS/IntersectionObserver animations · zero unnecessary dependencies.

## Development notice

All imagery in this build is **temporary generated placeholder content**
(clearly labelled on-page), and all contact details are **demo/placeholder**
information to be replaced before launch.

## Phase status

All phases complete: 1 setup/design system · 2 homepage · 3 portfolio ·
4 services/about/contact · 5 FastAPI+MongoDB · 6 availability+booking ·
7 consultation+WhatsApp · 8 admin auth+dashboard · 9 calendar+management ·
10 notifications+calendar layer · 11 SEO · 12 assets/performance ·
13 mobile/accessibility · 14 QA.
