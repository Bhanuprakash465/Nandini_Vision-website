"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Tab = "dashboard" | "enquiries" | "bookings" | "notifications" | "calendar";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-greige",
  HOLD: "text-gold",
  CONFIRMED: "text-maroon",
  CANCELLED: "text-ink/30 line-through",
  COMPLETED: "text-ink/50",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [e, b, n, u] = await Promise.all([
        api.listEnquiries(),
        api.listBookings(),
        api.listNotifications(),
        api.unreadCount(),
      ]);
      setEnquiries(e);
      setBookings(b);
      setNotifications(n);
      setUnread(u.count);
    } catch (err: any) {
      if (String(err.message).toLowerCase().includes("not authenticated")) {
        localStorage.removeItem("nv_admin_token");
        router.push("/login");
        return;
      }
      setError(err.message || "Could not reach the API.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!localStorage.getItem("nv_admin_token")) {
      router.push("/login");
      return;
    }
    loadAll();
  }, [loadAll, router]);

  async function updateStatus(id: string, status: string) {
    try {
      await api.updateBooking(id, { status });
      loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function markRead(id: string) {
    await api.markNotificationRead(id);
    loadAll();
  }

  function logout() {
    localStorage.removeItem("nv_admin_token");
    router.push("/login");
  }

  if (loading) return <p className="px-6 md:px-12 pt-36">Loading dashboard…</p>;
  if (error)
    return (
      <div className="px-6 md:px-12 pt-36">
        <p className="text-maroon">{error}</p>
        <p className="text-sm text-greige mt-2">Is the backend running at NEXT_PUBLIC_API_URL?</p>
      </div>
    );

  const pending = bookings.filter((b) => b.status === "PENDING");
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const upcoming = [...bookings].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
  const byDate = [...bookings].sort((a, b) => a.date.localeCompare(b.date));

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "enquiries", label: `Enquiries (${enquiries.length})` },
    { id: "bookings", label: `Bookings (${bookings.length})` },
    { id: "notifications", label: `Notifications ${unread ? `🔔 ${unread}` : ""}` },
    { id: "calendar", label: "Calendar" },
  ];

  return (
    <section className="px-6 md:px-12 pt-32 pb-32" data-testid="admin-dashboard">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-display text-4xl">Studio Admin</h1>
        <button onClick={logout} className="text-xs uppercase tracking-[0.14em] border-b border-ink pb-1">
          Sign Out
        </button>
      </div>

      <div className="flex flex-wrap gap-6 border-b border-ink/10 mb-10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-4 text-xs uppercase tracking-[0.14em] border-b-2 -mb-px ${
              tab === t.id ? "border-maroon text-maroon" : "border-transparent text-greige"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard label="Pending Enquiries" value={pending.length} />
          <StatCard label="Confirmed Bookings" value={confirmed.length} />
          <StatCard label="Unread Notifications" value={unread} />
          <div className="md:col-span-3 border border-ink/10 p-6 mt-4">
            <h2 className="font-display text-xl mb-4">Upcoming</h2>
            {upcoming.length === 0 && <p className="text-sm text-greige">No bookings yet.</p>}
            {upcoming.map((b) => (
              <div key={b.id} className="flex justify-between text-sm py-2 border-t border-ink/5 first:border-t-0">
                <span>{b.client_name} · {b.event_type} · {b.location}</span>
                <span className="text-greige">{b.date} · <span className={STATUS_COLORS[b.status]}>{b.status}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "enquiries" && (
        <div className="space-y-4">
          {enquiries.length === 0 && <p className="text-sm text-greige">No enquiries yet.</p>}
          {enquiries.map((e) => (
            <div key={e.enquiry_id} className="border border-ink/10 p-5 text-sm">
              <div className="flex justify-between mb-2">
                <strong>{e.client_name}</strong>
                <span className="text-greige">{e.enquiry_id}</span>
              </div>
              <p className="text-greige">{e.event_type} · {e.date} · {e.location}</p>
              <p className="text-greige">{e.phone} · {e.email}</p>
              {e.requirements && <p className="mt-2">{e.requirements}</p>}
              {e.message && <p className="mt-1 italic text-greige">&ldquo;{e.message}&rdquo;</p>}
              <p className="text-xs text-greige mt-2">Budget: {e.budget} · Email: {e.email_delivery}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "bookings" && (
        <div className="space-y-3">
          {byDate.map((b) => (
            <div key={b.id} className="flex flex-wrap justify-between items-center gap-3 border border-ink/10 p-4 text-sm">
              <div>
                <strong>{b.client_name}</strong> · {b.event_type} · {b.location} · <span className="text-greige">{b.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs uppercase tracking-[0.1em] ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                <select
                  value={b.status}
                  onChange={(e) => updateStatus(b.id, e.target.value)}
                  className="border border-ink/20 text-xs py-1 px-2"
                >
                  {["PENDING", "HOLD", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "notifications" && (
        <div className="space-y-3">
          {notifications.length === 0 && <p className="text-sm text-greige">No notifications yet.</p>}
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full text-left border p-4 text-sm ${n.read ? "border-ink/10 opacity-60" : "border-maroon"}`}
            >
              <div className="flex justify-between">
                <strong>{n.read ? "" : "🔔 "}{n.title}</strong>
                <span className="text-xs text-greige">{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <p className="text-greige mt-1">
                {n.payload.client_name} · {n.payload.phone} · {n.payload.email}
              </p>
            </button>
          ))}
        </div>
      )}

      {tab === "calendar" && (
        <div>
          <p className="text-sm text-greige mb-6">
            Agenda view — grouped by date, sourced from the same booking records used by the public availability
            checker. Month/week grid and Google/Outlook/iCal sync are noted as future work in PROJECT_PROGRESS.md.
          </p>
          <div className="space-y-2">
            {byDate.map((b) => (
              <div key={b.id} className="flex justify-between text-sm py-2 border-t border-ink/10">
                <span className="text-greige w-32">{b.date}</span>
                <span className="flex-1">{b.client_name} · {b.event_type} · {b.location}</span>
                <span className={STATUS_COLORS[b.status]}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ink/10 p-6">
      <div className="text-[11px] uppercase tracking-[0.14em] text-greige mb-2">{label}</div>
      <div className="font-display text-4xl">{value}</div>
    </div>
  );
}
