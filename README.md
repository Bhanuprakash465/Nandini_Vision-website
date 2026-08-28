# Nandini Vision — Premium Photography Studio Website & Booking Platform

A premium photography studio website and booking platform for **Nandini Vision**
(Andhra Pradesh, India · bookings worldwide).

**Brand statement:** *Photography for the beautifully lived.*
**Supporting statement:** *The feeling between frames.*

## Stack

- **Frontend** — Next.js 16 (App Router), React 19, TypeScript
- **Backend** — FastAPI (added in Phase 5)
- **Database** — MongoDB (added in Phase 5)
- **Animations** — Framer Motion / lightweight equivalent (added in Phase 2)

## Design system

- Background `#F9F8F6` · Primary `#111111` · Secondary `#817B74`
- Maroon `#6B2226` · Antique gold `#C5A059`
- Typefaces: **Playfair Display** (editorial) + **Manrope** (UI), self-hosted via `next/font`

Design tokens live in `app/globals.css` under `:root`.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
npm run typecheck
```

## Phase plan

| Phase | Scope |
| ----- | ----- |
| 1 (current) | Project setup, design system, fonts, global styles |
| 2 | Homepage, navigation, preloader, showreel |
| 3 | Portfolio + filters + project pages |
| 4 | Services, About, Testimonials, Collections, Contact |
| 5 | FastAPI + MongoDB backend |
| 6 | Availability + booking + double-booking protection |
| 7 | Consultation form + confirmation + WhatsApp |
| 8 | Admin authentication + dashboard |
| 9 | Owner calendar + booking management |
| 10 | Notifications + future calendar integration layer |
| 11 | SEO, structured data, sitemap, robots |
| 12 | Image/video optimisation + performance |
| 13 | Mobile refinement + accessibility |
| 14 | Final QA + polish |

> **Development notice:** All imagery and contact information used in this
> development version are temporary placeholders.
