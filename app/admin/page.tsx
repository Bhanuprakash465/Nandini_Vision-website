"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Dashboard } from "@/components/admin/Dashboard";
import { BookingCalendar } from "@/components/admin/BookingCalendar";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { BookingDrawer } from "@/components/admin/BookingDrawer";
import type { AdminBooking, DashboardStats } from "@/lib/types";

type View = "dashboard" | "calendar" | "bookings";

/**
 * Owner dashboard — visually part of Nandini Vision (bone + ink + maroon),
 * never a generic SaaS admin template.
 */
export default function AdminPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/bookings"),
      ]);
      if (!statsRes.ok || !bookingsRes.ok) {
        const body = await statsRes.json().catch(() => ({}));
        throw new Error(body.detail ?? "Session expired or server unavailable.");
      }
      const statsData = await statsRes.json();
      const bookingsData = await bookingsRes.json();
      setStats(statsData);
      setBookings(bookingsData.bookings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => load());
    return () => cancelAnimationFrame(raf);
  }, [load, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => ["pending", "hold", "confirmed"].includes(b.status))
        .sort((a, b) => a.event_date.localeCompare(b.event_date)),
    [bookings],
  );

  return (
    <div className="admin-shell" data-testid="admin-dashboard">
      <AdminNav
        view={view}
        onView={setView}
        counts={{
          upcoming: upcoming.length,
          pending: stats?.pending_bookings ?? 0,
        }}
        onLogout={async () => {
          await fetch("/api/admin/logout", { method: "POST" });
          router.push("/login");
        }}
      />

      <div className="admin-main page-enter">
        <div className="admin-topbar">
          <div>
            <h1>
              {view === "dashboard"
                ? "Studio overview"
                : view === "calendar"
                  ? "Owner calendar"
                  : "Bookings"}
            </h1>
            <p className="meta">
              {view === "calendar"
                ? "Your calendar is the source of truth."
                : "Nandini Vision · Owner workspace"}
            </p>
          </div>
          <span className="demo-badge">Demo environment</span>
        </div>

        {error && !loading && (
          <p className="form-alert" role="alert" style={{ marginBottom: "var(--space-l)" }}>
            {error}
          </p>
        )}

        {view === "dashboard" && (
          <Dashboard stats={stats} upcoming={upcoming} loading={loading} onView={setView} />
        )}
        {view === "calendar" && (
          <BookingCalendar bookings={bookings} loading={loading} onSelect={setSelected} onCreate={setCreating} />
        )}
        {view === "bookings" && (
          <BookingsTable
            bookings={bookings}
            loading={loading}
            onSelect={setSelected}
            onCreate={() => setCreating(true)}
            onChanged={refresh}
          />
        )}
      </div>

      <BookingDrawer
        booking={selected}
        creating={creating}
        onClose={() => {
          setSelected(null);
          setCreating(false);
        }}
        onSaved={() => {
          setSelected(null);
          setCreating(false);
          load();
        }}
      />
    </div>
  );
}
