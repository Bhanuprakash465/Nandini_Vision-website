"use client";

import { studio } from "@/lib/content";

type View = "dashboard" | "calendar" | "bookings";

const items: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "Overview", icon: "◈" },
  { id: "calendar", label: "Calendar", icon: "▦" },
  { id: "bookings", label: "Bookings", icon: "▤" },
];

export function AdminNav({
  view,
  onView,
  counts,
  onLogout,
}: {
  view: View;
  onView: (v: View) => void;
  counts: { upcoming: number; pending: number };
  onLogout: () => void;
}) {
  return (
    <aside className="admin-sidebar">
      <div>
        <p className="admin-sidebar__brand">
          {studio.name}
          <small>Owner workspace</small>
        </p>
      </div>

      <nav aria-label="Admin">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onView(item.id)}
            aria-current={view === item.id ? "page" : undefined}
          >
            <span aria-hidden="true" style={{ marginRight: "0.5rem" }}>{item.icon}</span>
            {item.label}
            {item.id === "calendar" && counts.upcoming > 0 && (
              <span style={{ marginLeft: "auto", fontSize: "var(--text-xs)" }}>· {counts.upcoming}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="admin-sidebar__foot">
        <button type="button" onClick={onLogout} style={{ textAlign: "left", color: "var(--color-stone-light)" }}>
          Sign out
        </button>
        <span>Database-backed · availability updates automatically</span>
      </div>
    </aside>
  );
}
