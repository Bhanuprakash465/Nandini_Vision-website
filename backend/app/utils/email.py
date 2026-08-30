"""
Email notification service.

No Resend API key is configured by default, so this runs in MOCK MODE:
emails are logged/stored but never actually sent, and every response
clearly reports delivery status as "mock" rather than falsely claiming
delivery. Set RESEND_API_KEY in the environment to enable real sending
(swap the mock branch below for a real Resend/SMTP call).
"""
from __future__ import annotations
import httpx
from app.config import settings


async def send_owner_enquiry_email(enquiry: dict) -> str:
    """Returns one of: 'sent', 'mock', 'failed'."""
    subject = f"New Nandini Vision Enquiry — {enquiry['event_type']} — {enquiry['date']}"
    body = (
        f"New enquiry received.\n\n"
        f"Enquiry ID: {enquiry['enquiry_id']}\n"
        f"Client: {enquiry['client_name']}\n"
        f"Phone: {enquiry['phone']}\n"
        f"Email: {enquiry['email']}\n"
        f"Event: {enquiry['event_type']}\n"
        f"Date: {enquiry['date']}\n"
        f"Location: {enquiry['location']}\n"
        f"Guests: {enquiry.get('guest_count', 'N/A')}\n"
        f"Budget: {enquiry.get('budget', 'N/A')}\n"
        f"Requirements: {enquiry.get('requirements', 'N/A')}\n"
        f"Message: {enquiry.get('message', 'N/A')}\n"
    )

    if not settings.resend_api_key:
        # MOCK MODE — no provider configured. Log only.
        print("[email:mock] would send ->", settings.owner_email)
        print("[email:mock] subject ->", subject)
        return "mock"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json={
                    "from": settings.email_from,
                    "to": [settings.owner_email],
                    "subject": subject,
                    "text": body,
                },
            )
            if resp.status_code >= 400:
                print("[email:failed]", resp.status_code, resp.text)
                return "failed"
            return "sent"
    except Exception as exc:  # noqa: BLE001
        print("[email:failed]", exc)
        return "failed"
