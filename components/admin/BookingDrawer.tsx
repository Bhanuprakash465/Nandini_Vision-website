"use client";

import { useState } from "react";
import { budgetRanges, durationOptions, eventTypes } from "@/lib/content";
import type { AdminBooking, BookingStatus } from "@/lib/types";

const STATUSES: BookingStatus[] = ["pending", "hold", "confirmed", "completed", "cancelled"];

const empty = {
  client_name: "",
  email: "",
  phone: "",
  event_type: eventTypes[0],
  event_date: "",
  event_location: "",
  event_duration: 1,
  guest_count: "",
  budget_range: budgetRanges[0],
  message: "",
  notes: "",
};

/**
 * Booking details / create drawer. The inner form is remounted per
 * booking via `key` so its local state always starts from the record
 * (no effect-driven state syncing needed).
 */
export function BookingDrawer({
  booking,
  creating,
  onClose,
  onSaved,
}: {
  booking: AdminBooking | null;
  creating: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const open = !!booking || creating;
  const formKey = creating ? "new" : booking?._id ?? "closed";

  return (
    <>
      <div
        className={`drawer-scrim ${open ? "drawer-scrim--open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${open ? "drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={creating ? "Create booking" : "Booking details"}
        data-testid="booking-details"
        aria-hidden={!open}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        {open && (
          <DrawerForm
            key={formKey}
            booking={booking}
            creating={creating}
            onClose={onClose}
            onSaved={onSaved}
          />
        )}
      </aside>
    </>
  );
}

function DrawerForm({
  booking,
  creating,
  onClose,
  onSaved,
}: {
  booking: AdminBooking | null;
  creating: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const initial: Record<string, string | number> = booking
    ? {
        client_name: booking.client_name,
        email: booking.email,
        phone: booking.phone,
        event_type: booking.event_type,
        event_date: booking.event_date,
        event_location: booking.event_location,
        event_duration: booking.event_duration,
        guest_count: booking.guest_count ?? "",
        budget_range: booking.budget_range ?? budgetRanges[0],
        message: booking.message ?? "",
        notes: booking.notes ?? "",
      }
    : empty;

  const [form, setForm] = useState<Record<string, string | number>>(initial);
  const [status, setStatus] = useState<BookingStatus>(booking?.status ?? "pending");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: key === "event_duration" ? Number(value) : value }));
      setError(null);
    };

  const save = async () => {
    if (
      !form.client_name ||
      !form.event_date ||
      !form.event_location ||
      !form.email ||
      !form.phone
    ) {
      setError("Name, email, phone, date and location are required.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch(
      creating ? "/api/admin/bookings" : `/api/admin/bookings/${booking?.booking_id}`,
      {
        method: creating ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      },
    );
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(body.detail ?? "Could not save the booking.");
      return;
    }
    onSaved();
  };

  const remove = async () => {
    if (!booking) return;
    if (!window.confirm(`Delete ${booking.booking_id}?`)) return;
    setSaving(true);
    const res = await fetch(`/api/admin/bookings/${booking.booking_id}`, { method: "DELETE" });
    setSaving(false);
    if (!res.ok) {
      setError("Could not delete the booking.");
      return;
    }
    onSaved();
  };

  return (
    <>
      <div className="drawer__head">
        <div>
          <span className="meta">{creating ? "New booking" : booking?.booking_id}</span>
          <h2 style={{ marginTop: "0.25rem" }}>
            {creating ? "Create a booking" : booking?.client_name}
          </h2>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="form-grid">
          <div className="field span-2">
            <label htmlFor="bk-name">Client name</label>
            <input id="bk-name" value={form.client_name} onChange={set("client_name")} />
          </div>
          <div className="field">
            <label htmlFor="bk-email">Email</label>
            <input id="bk-email" type="email" value={form.email} onChange={set("email")} />
          </div>
          <div className="field">
            <label htmlFor="bk-phone">Phone</label>
            <input id="bk-phone" type="tel" value={form.phone} onChange={set("phone")} />
          </div>
          <div className="field">
            <label htmlFor="bk-type">Event type</label>
            <select id="bk-type" value={form.event_type} onChange={set("event_type")}>
              {eventTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="bk-date">Event date</label>
            <input id="bk-date" type="date" value={form.event_date} onChange={set("event_date")} />
          </div>
          <div className="field">
            <label htmlFor="bk-duration">Duration</label>
            <select id="bk-duration" value={form.event_duration} onChange={set("event_duration")}>
              {durationOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="bk-location">Location</label>
            <input id="bk-location" value={form.event_location} onChange={set("event_location")} />
          </div>
          <div className="field">
            <label htmlFor="bk-notes">Notes</label>
            <input
              id="bk-notes"
              value={form.notes}
              onChange={set("notes")}
              placeholder="Internal notes"
            />
          </div>
          <div className="field span-2">
            <label htmlFor="bk-guests">Guest count</label>
            <input
              id="bk-guests"
              value={form.guest_count}
              onChange={set("guest_count")}
              placeholder="Approximately"
            />
          </div>
          <div className="field span-2">
            <label htmlFor="bk-budget">Budget range</label>
            <select id="bk-budget" value={form.budget_range} onChange={set("budget_range")}>
              {budgetRanges.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field" style={{ marginTop: "var(--space-m)" }}>
          <label>Status</label>
          <div className="drawer__status" role="group" aria-label="Booking status">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="form-alert" role="alert" style={{ marginTop: "var(--space-m)" }}>
            {error}
          </p>
        )}

        <div
          style={{
            marginTop: "var(--space-l)",
            display: "flex",
            gap: "var(--space-s)",
            flexWrap: "wrap",
          }}
        >
          <button type="submit" className="btn btn--maroon" disabled={saving}>
            {saving ? "Saving…" : "Save booking"}
          </button>
          {booking && (
            <button type="button" className="btn btn--ghost" onClick={remove} disabled={saving}>
              Delete
            </button>
          )}
        </div>

        <p className="form-note" style={{ marginTop: "var(--space-m)" }}>
          Availability updates automatically. Conflicting dates are rejected by the backend.
        </p>
      </form>
    </>
  );
}
