from datetime import date, timedelta

from tests.conftest import ADMIN_EMAIL, ADMIN_PASSWORD


def future(days=60) -> str:
    return (date.today() + timedelta(days=days)).isoformat()


def enquiry_payload(**overrides):
    payload = {
        "client_name": "Test Client",
        "phone": "+91 98765 43210",
        "email": "client@example.com",
        "event_type": "Wedding",
        "date": future(),
        "location": "Vijayawada",
        "guest_count": 120,
        "budget": "Prefer not to say",
    }
    payload.update(overrides)
    return payload


# ---------- health ----------

def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok", "service": "nandini-vision-api"}


# ---------- auth ----------

def test_login_success_and_wrong_password(client, admin_headers):
    bad = client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": "nope"})
    assert bad.status_code == 401
    assert bad.json()["detail"] == "Invalid email or password"


def test_login_unknown_email(client):
    r = client.post("/api/auth/login", json={"email": "nobody@example.com", "password": ADMIN_PASSWORD})
    assert r.status_code == 401


def test_protected_endpoints_reject_anonymous_requests(client):
    for method, path in [
        ("get", "/api/enquiries"),
        ("get", "/api/bookings"),
        ("get", "/api/bookings/64b000000000000000000000"),
        ("patch", "/api/bookings/64b000000000000000000000"),
        ("delete", "/api/bookings/64b000000000000000000000"),
        ("get", "/api/notifications"),
        ("get", "/api/notifications/unread-count"),
        ("patch", "/api/notifications/read-all"),
    ]:
        r = getattr(client, method)(path)
        assert r.status_code == 401, f"{method.upper()} {path} returned {r.status_code}"


def test_garbage_token_is_rejected(client):
    r = client.get("/api/bookings", headers={"Authorization": "Bearer not-a-real-token"})
    assert r.status_code == 401


# ---------- enquiries ----------

def test_create_enquiry_persists_and_mirrors_pending_booking(client, admin_headers, sent_emails):
    r = client.post("/api/enquiries", json=enquiry_payload())
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["enquiry_id"].startswith("NV-")
    assert body["status"] == "PENDING"
    assert ("owner", "client@example.com") in sent_emails

    enquiries = client.get("/api/enquiries", headers=admin_headers).json()
    assert [e["enquiry_id"] for e in enquiries] == [body["enquiry_id"]]

    bookings = client.get("/api/bookings", headers=admin_headers).json()
    assert len(bookings) == 1 and bookings[0]["status"] == "PENDING"

    assert client.get("/api/notifications/unread-count", headers=admin_headers).json() == {"count": 1}


def test_duplicate_submission_within_window_is_not_duplicated(client, admin_headers):
    first = client.post("/api/enquiries", json=enquiry_payload()).json()
    second = client.post("/api/enquiries", json=enquiry_payload()).json()
    assert first["enquiry_id"] == second["enquiry_id"]
    assert len(client.get("/api/enquiries", headers=admin_headers).json()) == 1


def test_enquiry_validation_errors(client):
    assert client.post("/api/enquiries", json=enquiry_payload(email="not-an-email")).status_code == 422
    assert client.post("/api/enquiries", json=enquiry_payload(client_name="A")).status_code == 422
    assert client.post("/api/enquiries", json=enquiry_payload(phone="123")).status_code == 422
    assert client.post("/api/enquiries", json=enquiry_payload(budget="a million")).status_code == 422
    missing = enquiry_payload()
    del missing["location"]
    assert client.post("/api/enquiries", json=missing).status_code == 422


def test_enquiry_for_a_past_date_is_rejected_with_a_readable_message(client):
    past = (date.today() - timedelta(days=30)).isoformat()
    r = client.post("/api/enquiries", json=enquiry_payload(date=past))
    assert r.status_code == 422
    assert "cannot be in the past" in r.text


def test_enquiry_for_today_is_accepted(client):
    r = client.post("/api/enquiries", json=enquiry_payload(date=date.today().isoformat()))
    assert r.status_code == 200, r.text


# ---------- availability ----------

def test_open_date_is_available(client):
    r = client.post("/api/availability/check", json={"date": future(90)})
    assert r.status_code == 200
    assert r.json()["status"] == "AVAILABLE"


def test_optional_fields_are_accepted_and_do_not_change_result(client):
    base = client.post("/api/availability/check", json={"date": future(91)}).json()
    full = client.post(
        "/api/availability/check",
        json={"date": future(91), "event_type": "Wedding", "location": "Anywhere", "duration": "Multi-Day"},
    ).json()
    assert base["status"] == full["status"] == "AVAILABLE"


def test_pending_then_confirmed_changes_availability(client, admin_headers):
    d = future(45)
    client.post("/api/enquiries", json=enquiry_payload(date=d))
    assert client.post("/api/availability/check", json={"date": d}).json()["status"] == "PENDING"

    booking = client.get("/api/bookings", headers=admin_headers).json()[0]
    r = client.patch(f"/api/bookings/{booking['id']}", json={"status": "CONFIRMED"}, headers=admin_headers)
    assert r.status_code == 200
    assert client.post("/api/availability/check", json={"date": d}).json()["status"] == "CONFIRMED"


def test_cancelled_booking_frees_the_date(client, admin_headers):
    d = future(46)
    client.post("/api/enquiries", json=enquiry_payload(date=d))
    booking = client.get("/api/bookings", headers=admin_headers).json()[0]
    client.patch(f"/api/bookings/{booking['id']}", json={"status": "CANCELLED"}, headers=admin_headers)
    assert client.post("/api/availability/check", json={"date": d}).json()["status"] == "AVAILABLE"


def test_availability_rejects_past_and_malformed_dates(client):
    past = (date.today() - timedelta(days=10)).isoformat()
    assert client.post("/api/availability/check", json={"date": past}).status_code == 422
    assert client.post("/api/availability/check", json={"date": "tomorrow"}).status_code == 422
    assert client.post("/api/availability/check", json={}).status_code == 422


# ---------- bookings: confirmation email + conflicts ----------

def _first_booking(client, admin_headers):
    return client.get("/api/bookings", headers=admin_headers).json()[0]


def test_confirming_a_booking_emails_the_customer_exactly_once(client, admin_headers, sent_emails):
    client.post("/api/enquiries", json=enquiry_payload())
    booking = _first_booking(client, admin_headers)
    sent_emails.clear()

    r = client.patch(f"/api/bookings/{booking['id']}", json={"status": "CONFIRMED"}, headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["confirmation_email"] == "sent"
    assert sent_emails == [("customer", "client@example.com")]

    # Saving CONFIRMED again must not email the customer a second time.
    again = client.patch(f"/api/bookings/{booking['id']}", json={"status": "CONFIRMED"}, headers=admin_headers)
    assert again.status_code == 200
    assert again.json()["confirmation_email"] is None
    assert sent_emails == [("customer", "client@example.com")]


def test_other_status_changes_do_not_email_the_customer(client, admin_headers, sent_emails):
    client.post("/api/enquiries", json=enquiry_payload())
    booking = _first_booking(client, admin_headers)
    sent_emails.clear()
    for status in ("HOLD", "CANCELLED", "COMPLETED", "PENDING"):
        r = client.patch(f"/api/bookings/{booking['id']}", json={"status": status}, headers=admin_headers)
        assert r.status_code == 200, r.text
        assert r.json()["confirmation_email"] is None
    assert sent_emails == []


def test_confirmation_email_failure_is_reported_not_hidden(client, admin_headers, monkeypatch):
    from app.routes import bookings as bookings_route

    async def failing(doc):
        return "failed"

    monkeypatch.setattr(bookings_route, "send_booking_confirmation_email", failing)
    client.post("/api/enquiries", json=enquiry_payload())
    booking = _first_booking(client, admin_headers)
    r = client.patch(f"/api/bookings/{booking['id']}", json={"status": "CONFIRMED"}, headers=admin_headers)
    assert r.status_code == 200  # the booking itself still saves
    assert r.json()["status"] == "CONFIRMED"
    assert r.json()["confirmation_email"] == "failed"


def test_two_confirmed_bookings_cannot_share_a_date(client, admin_headers):
    d = future(70)
    client.post("/api/enquiries", json=enquiry_payload(date=d, email="a@example.com"))
    client.post("/api/enquiries", json=enquiry_payload(date=d, email="b@example.com", client_name="Second Client"))
    first, second = client.get("/api/bookings", headers=admin_headers).json()
    assert client.patch(f"/api/bookings/{first['id']}", json={"status": "CONFIRMED"}, headers=admin_headers).status_code == 200
    clash = client.patch(f"/api/bookings/{second['id']}", json={"status": "CONFIRMED"}, headers=admin_headers)
    assert clash.status_code == 409
    assert "already" in clash.json()["detail"]


def test_booking_id_validation_and_404(client, admin_headers):
    assert client.get("/api/bookings/not-an-id", headers=admin_headers).status_code == 400
    assert client.get("/api/bookings/64b000000000000000000000", headers=admin_headers).status_code == 404
    assert client.patch("/api/bookings/64b000000000000000000000", json={"status": "HOLD"}, headers=admin_headers).status_code == 404


def test_invalid_status_value_is_rejected(client, admin_headers):
    client.post("/api/enquiries", json=enquiry_payload())
    booking = _first_booking(client, admin_headers)
    r = client.patch(f"/api/bookings/{booking['id']}", json={"status": "MAYBE"}, headers=admin_headers)
    assert r.status_code == 422


def test_delete_booking(client, admin_headers):
    client.post("/api/enquiries", json=enquiry_payload())
    booking = _first_booking(client, admin_headers)
    assert client.delete(f"/api/bookings/{booking['id']}", headers=admin_headers).json() == {"deleted": True}
    assert client.get("/api/bookings", headers=admin_headers).json() == []


# ---------- notifications ----------

def test_notifications_flow(client, admin_headers):
    client.post("/api/enquiries", json=enquiry_payload())
    items = client.get("/api/notifications", headers=admin_headers).json()
    assert len(items) == 1 and items[0]["read"] is False
    r = client.patch(f"/api/notifications/{items[0]['id']}/read", headers=admin_headers)
    assert r.status_code == 200 and r.json()["read"] is True
    assert client.get("/api/notifications/unread-count", headers=admin_headers).json() == {"count": 0}


def test_mark_all_read(client, admin_headers):
    client.post("/api/enquiries", json=enquiry_payload(email="a@example.com", date=future(80)))
    client.post("/api/enquiries", json=enquiry_payload(email="b@example.com", date=future(81)))
    assert client.patch("/api/notifications/read-all", headers=admin_headers).json() == {"updated": 2}


# ---------- email helpers ----------

def test_email_masking_keeps_logs_free_of_full_addresses():
    from app.utils.email import mask_email

    assert mask_email("jane.doe@example.com") == "j***@example.com"
    assert mask_email("") == "***"
    assert "jane" not in mask_email("jane.doe@example.com")


async def test_customer_email_is_mock_when_smtp_not_configured(monkeypatch):
    from app.config import settings
    from app.utils.email import send_booking_confirmation_email

    monkeypatch.setattr(settings, "smtp_email", "")
    monkeypatch.setattr(settings, "smtp_app_password", "")
    booking = {"email": "c@example.com", "client_name": "C", "event_type": "Wedding", "date": "2030-01-01", "location": "X"}
    assert await send_booking_confirmation_email(booking) == "mock"


async def test_customer_email_without_address_fails_cleanly():
    from app.utils.email import send_booking_confirmation_email

    assert await send_booking_confirmation_email({"client_name": "C"}) == "failed"
