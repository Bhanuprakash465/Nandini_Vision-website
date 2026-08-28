"""Backend content mirror — demo contact + WhatsApp deep links.
Frontend content lives in ../lib/content.ts (repo root); keep these in
sync when contact details change. Centralised for future CMS."""

STUDIO_PHONE_INTL = "919876543210"
STUDIO_PHONE_DISPLAY = "+91 98765 43210"

import urllib.parse


def whatsapp_url(
    name: str = "",
    event: str = "photography",
    date: str = "",
    location: str = "",
    ref: str = "",
) -> str:
    parts: list[str] = [
        f"Hello Nandini Vision, I would like to discuss my {event.lower()} booking"
    ]
    if date:
        parts.append(f"for {date}")
    if location:
        parts.append(f"in {location}")
    if ref:
        parts.append(f". My enquiry reference is {ref}")
    text = " ".join(parts).replace("  ", " ").strip() + "."
    return (
        f"https://wa.me/{STUDIO_PHONE_INTL}?text="
        + urllib.parse.quote(text)
    )
