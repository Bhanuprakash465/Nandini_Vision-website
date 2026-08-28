"use client";

import { useMemo, useState } from "react";
import type { AdminBooking } from "@/lib/types";

type ViewMode = "month" | "week" | "agenda";

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday-first
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const gridStart = startOfWeek(first);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(gridStart.getTime() + i * 86400000));
  }
  return cells;
}

export function BookingCalendar({
  bookings,
  loading,
  onSelect,
  onCreate,
}: {
  bookings: AdminBooking[];
  loading: boolean;
  onSelect: (b: AdminBooking) => void;
  onCreate: (open: boolean) => void;
}) {
  const [mode, setMode] = useState<ViewMode>("month");
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const byDate = useMemo(() => {
    const map = new Map<string, AdminBooking[]>();
    for (const b of bookings) {
      const key = b.event_date;
      const list = map.get(key) ?? [];
      list.push(b);
      map.set(key, list);
    }
    return map;
  }, [bookings]);

  const monthLabel = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const shift = (dir: 1 | -1) => {
    setCursor((c) => {
      if (mode === "month") return new Date(c.getFullYear(), c.getMonth() + dir, 1);
      return new Date(c.getFullYear(), c.getMonth(), c.getDate() + 7 * dir);
    });
  };

  const days = useMemo(
    () => (mode === "month" ? monthGrid(cursor.getFullYear(), cursor.getMonth()) : []),
    [cursor, mode],
  );

  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor);
    return Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * 86400000));
  }, [cursor]);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  return (
    <div data-testid="booking-calendar">
      <div className="calendar-toolbar">
        <div className="calendar-nav">
          <button type="button" onClick={() => shift(-1)} aria-label="Previous period">←</button>
          <span className="label">{mode === "month" ? monthLabel : `${weekDays[0].toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${weekDays[6].toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}</span>
          <button type="button" onClick={() => shift(1)} aria-label="Next period">→</button>
        </div>

        <div className="calendar-toolbar__views" role="group" aria-label="Calendar view">
          {(["month", "week", "agenda"] as ViewMode[]).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m}
            </button>
          ))}
        </div>

        <button type="button" className="btn btn--maroon btn--sm" onClick={() => onCreate(true)}>
          + New booking
        </button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: "24rem" }} aria-label="Loading calendar" />
      ) : mode === "month" ? (
        <div className="calendar-month" role="grid" aria-label={`Calendar ${monthLabel}`}>
          {DOW.map((d) => (
            <span key={d} className="calendar-month__dow">{d}</span>
          ))}
          {days.map((d, i) => {
            const key = fmt(d);
            const entries = byDate.get(key) ?? [];
            const inMonth = d.getMonth() === cursor.getMonth();
            return (
              <div key={i} className={`calendar-day ${inMonth ? "" : "calendar-day--muted"}`} role="gridcell">
                <span className="calendar-day__num">{d.getDate()}</span>
                <div className="calendar-day__entries">
                  {entries.map((b) => (
                    <button key={b._id} type="button" className={`cal-event cal-event--${b.status}`} onClick={() => onSelect(b)} title={`${b.client_name} — ${b.event_type}`}>
                      {b.client_name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : mode === "week" ? (
        <div className="calendar-week">
          {weekDays.map((d) => {
            const key = fmt(d);
            const entries = byDate.get(key) ?? [];
            return (
              <div key={key} className="calendar-week__row">
                <div className="calendar-week__day">
                  {d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </div>
                <div className="calendar-week__entries">
                  {entries.length === 0 && (
                    <span className="meta">—</span>
                  )}
                  {entries.map((b) => (
                    <button key={b._id} type="button" className={`cal-event cal-event--${b.status}`} onClick={() => onSelect(b)}>
                      {b.client_name} · {b.event_type} · {b.event_location}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="calendar-agenda">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <h2 style={{ fontSize: "var(--text-xl)" }}>Your calendar is beautifully quiet.</h2>
              <p>New enquiries will appear here.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <button key={b._id} type="button" className="calendar-agenda__item" onClick={() => onSelect(b)}>
                <span className="when">{b.event_date}</span>
                <span className="who">{b.client_name}</span>
                <span className="where">{b.event_type} · {b.event_location}</span>
                <span className={`status-pill status-pill--${b.status}`}>{b.status}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
