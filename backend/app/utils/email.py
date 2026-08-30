
from __future__ import annotations

import asyncio
import smtplib
import ssl
from email.message import EmailMessage

import httpx

from app.config import settings


async def send_owner_enquiry_email(enquiry: dict) -> str:
    """Send a new enquiry notification to the studio owner."""

    subject = (
        f"Nandini Vision Enquiry - "
        f"{enquiry['event_type']} - {enquiry['date']}"
    )

    body = (
        "New enquiry received.\n\n"
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
        print("[email:mock] would send ->", settings.owner_email)
        print("[email:mock] subject ->", subject)
        return "mock"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": settings.email_from,
                    "to": [settings.owner_email],
                    "subject": subject,
                    "text": body,
                },
            )

            if response.status_code >= 400:
                print(
                    "[email:failed]",
                    response.status_code,
                    response.text,
                )
                return "failed"

            print(
                "[email:sent] owner enquiry ->",
                settings.owner_email,
            )
            return "sent"

    except Exception as exc:
        print(
            "[email:failed]",
            type(exc).__name__,
            str(exc),
        )
        return "failed"


async def send_booking_confirmation_email(booking: dict) -> str:
    """Send booking confirmation email to the customer."""

    customer_email = booking.get("email")

    if not customer_email:
        print("[booking-email:failed] Customer email is missing")
        return "failed"

    subject = (
        f"Nandini Vision - Booking Confirmed - "
        f"{booking['date']}"
    )

    body = (
        f"Hi {booking['client_name']},\n\n"
        "Great news! Your booking with Nandini Vision "
        "has been confirmed.\n\n"
        "Booking Details\n"
        "-------------------------\n"
        f"Event: {booking['event_type']}\n"
        f"Date: {booking['date']}\n"
        f"Location: {booking['location']}\n"
        f"Guests: {booking.get('guest_count', 'N/A')}\n"
        f"Booking ID: {booking.get('enquiry_id', 'N/A')}\n\n"
        "We look forward to being part of your special occasion.\n\n"
        "Thank you for choosing Nandini Vision.\n\n"
        "Nandini Vision\n"
        "Photography for the beautifully lived."
    )

    if not settings.smtp_email or not settings.smtp_app_password:
        print(
            "[booking-email:mock] would send ->",
            customer_email,
        )
        print("[booking-email:mock] subject ->", subject)
        return "mock"

    def _send_via_gmail() -> None:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = f"Nandini Vision <{settings.smtp_email}>"
        msg["To"] = customer_email
        msg.set_content(body)

        context = ssl.create_default_context()

        with smtplib.SMTP_SSL(
            settings.smtp_host,
            settings.smtp_port,
            context=context,
            timeout=10,
        ) as server:
            server.login(settings.smtp_email, settings.smtp_app_password)
            server.send_message(msg)

    try:
        # smtplib is blocking, so run it off the event loop.
        await asyncio.to_thread(_send_via_gmail)

        print(
            "[booking-email:sent] confirmation ->",
            customer_email,
        )
        return "sent"

    except smtplib.SMTPAuthenticationError as exc:
        print(
            "[booking-email:failed] Gmail auth rejected. "
            "Check SMTP_EMAIL / SMTP_APP_PASSWORD "
            "(must be a Gmail App Password, not the login password).",
            str(exc),
        )
        return "failed"

    except Exception as exc:
        print(
            "[booking-email:failed]",
            type(exc).__name__,
            str(exc),
        )
        return "failed"