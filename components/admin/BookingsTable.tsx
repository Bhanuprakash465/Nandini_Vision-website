"use client";

import { useState } from "react";
import type { AdminBooking } from "@/lib/types";

const STATUS = ["pending", "hold", "confirmed", "completed", "cancelled"];

export function BookingsTable({
  bookings,
  loading,
  onSelect,
  onCreate,
  onChanged,
}: {
  bookings: AdminBooking[];
  loading: boolean;
  onSelect: (b: AdminBooking) => void;
  onCreate: () => void;
  onChanged: () => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const setStatus = async (b: AdminBooking, status: string) => {
    setBusyId(b._id);
    setError(null);
    const res = await fetch(`/api/admin/bookings/${b.booking_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const body = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      setError(body.detail ?? "Could not update the booking.");
      return;
    }
    onChanged();
  };

  const remove = async (b: AdminBooking) => {
    if (!window.confirm(`Delete booking ${b.booking_id} for ${b.client_name}?`)) return;
    setBusyId(b._id);
    setError(null);
    const res = await fetch(`/api/admin/bookings/${b.booking_id}`, {
      method: "DELETE",
    });
    setBusyId(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.detail ?? "Could not delete the booking.");
      return;
    }
    onChanged();
  };

  return (
    <div data-testid="bookings-table">
      <div className="calendar-toolbar">
        <div className="calendar-toolbar__views" role="group" aria-label="Filter bookings">
          <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
            All
          </button>
          {STATUS.map((s) => (
            <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn--maroon btn--sm" onClick={onCreate}>
          + New booking
        </button>
      </div>

      {error && <p className="form-alert" role="alert" style={{ marginBottom: "var(--space-m)" }}>{error}</p>}

      {loading ? (
        <div className="skeleton" style={{ height: "20rem" }} />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h2 style={{ fontSize: "var(--text-xl)" }}>No bookings here yet.</h2>
          <p>Create one, or wait for the first enquiry.</p>
        </div>
      ) : (
        <div className="bookings-table-wrap">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Client</th>
                <th>Event</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td><span className="muted">{b.booking_id}</span></td>
                  <td><span className="client">{b.client_name}</span></td>
                  <td>{b.event_type}</td>
                  <td>{b.event_date}</td>
                  <td>{b.event_location}</td>
                  <td><span className={`status-pill status-pill--${b.status}`}>{b.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <button type="button" className="icon-btn" aria-label={`Open ${b.client_name}`} onClick={() => onSelect(b)} title="Details / edit">
                        ✎
                      </button>
                      {b.status !== "confirmed" && b.status !== "completed" && b.status !== "cancelled" && (
                        <button type="button" className="icon-btn" disabled={busyId === b._id} aria-label="Confirm booking" onClick={() => setStatus(b, "confirmed")} title="Confirm">
                          ✓
                        </button>
                      )}
                      {b.status !== "cancelled" && (
                        <button type="button" className="icon-btn" disabled={busyId === b._id} aria-label="Cancel booking" onClick={() => setStatus(b, "cancelled")} title="Cancel">
                          ✕
                        </button>
                      )}
                      <button type="button" className="icon-btn icon-btn--danger" disabled={busyId === b._id} aria-label="Delete booking" onClick={() => remove(b)} title="Delete">
                        ⌫
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
