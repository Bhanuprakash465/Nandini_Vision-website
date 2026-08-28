"use client";

import type { AdminBooking, DashboardStats } from "@/lib/types";

type View = "dashboard" | "calendar" | "bookings";

function StatCard({
  label,
  value,
  tone = "",
  loading,
}: {
  label: string;
  value: number | string;
  tone?: string;
  loading: boolean;
}) {
  return (
    <div className={`stat-card ${tone}`}>
      <p className="stat-card__value">{loading ? "—" : value}</p>
      <p className="stat-card__label">{label}</p>
    </div>
  );
}

export function Dashboard({
  stats,
  upcoming,
  loading,
  onView,
}: {
  stats: DashboardStats | null;
  upcoming: AdminBooking[];
  loading: boolean;
  onView: (v: View) => void;
}) {
  if (loading) {
    return (
      <div className="stat-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="stat-card skeleton" style={{ height: "6.5rem" }} />
        ))}
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="stat-grid">
        <StatCard label="Total enquiries" value={stats?.total_inquiries ?? 0} loading={false} />
        <StatCard label="Upcoming bookings" value={stats?.upcoming_bookings ?? 0} tone="stat-card--maroon" loading={false} />
        <StatCard label="Pending enquiries" value={stats?.pending_bookings ?? 0} loading={false} />
        <StatCard label="Confirmed bookings" value={stats?.confirmed_bookings ?? 0} tone="stat-card--maroon" loading={false} />
        <StatCard label="Hold dates" value={stats?.hold_bookings ?? 0} loading={false} />
        <StatCard label="Cancelled bookings" value={stats?.cancelled_bookings ?? 0} loading={false} />
      </div>

      <div className="consultation-form" data-testid="admin-upcoming" style={{ marginTop: "var(--space-l)" }}>
        <div className="admin-topbar" style={{ marginBottom: "var(--space-m)" }}>
          <h2 style={{ fontSize: "var(--text-xl)" }}>Upcoming</h2>
          <button type="button" className="link-underline" onClick={() => onView("calendar")}>
            Open calendar →
          </button>
        </div>

        {upcoming.length === 0 ? (
          <p className="lead" style={{ color: "var(--color-stone)" }}>
            Your calendar is beautifully quiet.
          </p>
        ) : (
          <div className="calendar-agenda">
            {upcoming.slice(0, 6).map((b) => (
              <div key={b._id} className="calendar-agenda__item">
                <div>
                  <span className="when">{b.event_date}</span>
                </div>
                <span className="who">{b.client_name}</span>
                <span className="where">{b.event_type} · {b.event_location}</span>
                <span className={`status-pill status-pill--${b.status}`}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
