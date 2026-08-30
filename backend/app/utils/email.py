"""
Email notification service using Resend.
"""

from __future__ import annotations

import httpx

from app.config import settings


async def send_owner_enquiry_email(enquiry: dict) -> str:
    """
    Send a new enquiry notification to the studio owner.

    Returns:
        "sent"   - email was successfully accepted by Resend
        "mock"   - no Resend API key is configured
        "failed" - Resend request failed
    """

    subject = (
        f"New Nandini Vision Enquiry — "
        f"{enquiry['event_type']} — "
        f"{enquiry['date']}"
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
        print(
            "[email:mock] would send ->",
            settings.owner_email,
        )
        print("[email:mock] subject ->", subject)
        return "mock"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": (
                        f"Bearer {settings.resend_api_key}"
                    ),
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
        print("[email:failed]", exc)
        return "failed"


async def send_booking_confirmation_email(
    booking: dict,
) -> str:
    """
    Send a booking confirmation email to the customer.

    Returns:
        "sent"   - email was successfully accepted by Resend
        "mock"   - no Resend API key is configured
        "failed" - Resend request failed
    """

    customer_email = booking["email"]

    subject = (
        f"Nandini Vision — Booking Confirmed — "
        f"{booking['date']}"
    )

    body = (
        f"Hi {booking['client_name']},\n\n"
        "Great news! Your booking with Nandini Vision "
        "has been confirmed.\n\n"
        "BOOKING DETAILS\n"
        "-------------------------\n"
        f"Event: {booking['event_type']}\n"
        f"Date: {booking['date']}\n"
        f"Location: {booking['location']}\n"
        f"Guests: {booking.get('guest_count', 'N/A')}\n"
        f"Booking ID: {booking.get('enquiry_id', 'N/A')}\n\n"
        "We look forward to being part of your "
        "special occasion.\n\n"
        "Thank you for choosing Nandini Vision.\n\n"
        "Nandini Vision\n"
        "Photography for the beautifully lived."
    )

    if not settings.resend_api_key:
        print(
            "[email:mock] would send booking confirmation ->",
            customer_email,
        )
        print("[email:mock] subject ->", subject)
        return "mock"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": (
                        f"Bearer {settings.resend_api_key}"
                    ),
                    "Content-Type": "application/json",
                },
                json={
                    "from": settings.email_from,
                    "to": [customer_email],
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
            "[email:sent] booking confirmation ->",
            customer_email,
        )

        return "sent"

    except Exception as exc:
        print("[email:failed]", exc)
        return "failed"
