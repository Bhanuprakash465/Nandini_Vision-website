# Nandini Vision — Project Progress

Last updated: build session of 2026-08-30.

## Completed

### Phase 1 — Foundation
- Next.js 14 (App Router) + Tailwind, brand color/type tokens, routing, nav, footer. ✅

### Phase 2 — Visual Experience
- Cinematic hero, scroll-reveal animations, hover interactions, expanding service rows,
  editorial asymmetric layout on homepage. ✅
- Preloader (NV → NANDINI → VISION) and custom "VIEW" cursor were built in the earlier
  static HTML preview; **not yet ported into the Next.js app** — see Remaining below.
- 3D/WebGL depth effects: **not implemented.** The spec's "tasteful 3D" (floating type,
  depth layers, WebGL) is real scope, not something to fake with a plain CSS approximation
  labeled as 3D. Flagging honestly rather than shipping a placeholder.

### Phase 3 — Work / Services / About
- Work archive with category filter, individual project pages (prev/next nav), services
  page, about page, testimonials, collections. ✅

### Phase 4 — Backend
- FastAPI + MongoDB (Motor), Pydantic schemas, indexes, CORS, error handling. ✅
- **Functionally tested** end-to-end against an in-memory Mongo mock (not just import-checked):
  login, enquiry creation + duplicate protection, availability logic, booking conflict
  prevention (409 on double-confirm), notifications. ✅

### Phase 5 — Booking System
- Consultation form → MongoDB → enquiry ID → personalized confirmation → WhatsApp handoff. ✅
- Availability checker queries real booking data, no hardcoded statuses. ✅
- Booking conflict prevention enforced server-side on status changes. ✅

### Phase 6 — Owner System
- Admin login (JWT + bcrypt), protected `/admin` routes on the API (frontend route itself
  redirects to `/login` if no token, but see Remaining — this is client-side only). ✅
- Dashboard, enquiry list, booking list with status changes, notifications with
  unread badge and mark-as-read. ✅
- Calendar: **agenda/list view only**, sourced from the same booking collection the public
  checker uses. Month/week grid views are not built yet.

### Phase 7 — Notifications
- Owner notification documents created on every enquiry, unread count, mark read/all-read. ✅
- Email service architecture with explicit mock mode — logs instead of sending, and the API
  response honestly reports `email_delivery: "mock"` rather than claiming delivery. Real
  sending activates automatically once `RESEND_API_KEY` is set. ✅
- WhatsApp: generates a prefilled `wa.me` link with enquiry details. ✅

### Phase 8 — SEO / Accessibility / Performance (partial)
- Metadata, Open Graph, JSON-LD LocalBusiness schema, `sitemap.ts`, `robots.ts`
  (disallowing `/admin`, `/login`, `/api`). ✅
- `data-testid` attributes on major sections. ✅
- Reduced-motion support in global CSS. ✅
- PhotographyService + Breadcrumb schema: **not yet added** (only LocalBusiness is in).
- Real image optimization (AVIF/WebP, `next/image`, responsive `srcset`): not applicable yet
  since all imagery is still placeholder blocks — wire this in once real photos exist.

## Remaining / Not Built

- **Real admin route protection is client-side only** (checks `localStorage` token and
  redirects). For production, add a Next.js middleware or server-side check so `/admin`
  never even flashes protected content pre-redirect.
- **3D/WebGL effects, full preloader + custom cursor** are not yet ported into the Next.js
  app (they exist in the earlier static preview file only).
- **Calendar month/week grid views**, Google/Outlook/iCal sync architecture.
- **Cinematic showreel** is a static poster frame — no real video asset exists yet.
- **Real photography** — every image is a labeled placeholder gradient. Swap by replacing
  `<Placeholder>` usages with `next/image` once real photos are supplied; `lib/data.ts` is
  the single place to update content.
- **Production deployment**: not performed. No hosting/DB credentials were provided, so
  nothing has been deployed — see "Deployment" below for what's needed.

## Environment Requirements

- Node.js 18+, Python 3.11+, a MongoDB instance (Atlas or self-hosted).
- Optional: a Resend API key to enable real owner emails (falls back to safe mock mode
  without one).

## Deployment Status

**Not deployed.** This is a complete, tested local project, not a live URL. To deploy for
real you'd need to supply: a MongoDB Atlas (or equivalent) connection string, hosting for
the FastAPI backend (Render/Fly/Railway/etc.), hosting for the Next.js frontend (Vercel is
the natural fit), and a Resend API key if you want real email delivery. See `README.md`.
