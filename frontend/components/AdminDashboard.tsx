"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  api,
  ApiError,
  TOKEN_KEY,
  type Booking,
  type BookingStatus,
  type Enquiry,
  type NotificationItem,
} from "@/lib/api";
import { formatDate, todayISO } from "@/lib/validation";

type Tab = "dashboard" | "enquiries" | "bookings" | "notifications" | "calendar";

const STATUSES: BookingStatus[] = ["PENDING", "HOLD", "CONFIRMED", "COMPLETED", "CANCELLED"];
const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Pending",
  HOLD: "On hold",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
const STATUS_STYLE: Record<BookingStatus, string> = {
  PENDING: "border border-black/50 text-black",
  HOLD: "border border-dashed border-cobalt text-cobalt",
  CONFIRMED: "border border-cobalt bg-cobalt text-white",
  COMPLETED: "border border-black/10 bg-black/10 text-black",
  CANCELLED: "border border-black/20 text-black/50 line-through",
};
const EMAIL_NOTICE: Record<string, string> = {
  sent: "Owner email sent",
  mock: "Owner email not sent (email provider not configured)",
  failed: "Owner email failed to send",
};

function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`inline-block px-2.5 py-1 text-sm ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | BookingStatus>("ALL");

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/login");
  }, [router]);

  const loadAll = useCallback(async () => {
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
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      setError(err instanceof Error ? err.message : "Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    // Client-side convenience only. Every admin API route enforces authentication on the server.
    if (!localStorage.getItem(TOKEN_KEY)) {
      router.push("/login");
      return;
    }
    loadAll();
  }, [loadAll, router]);

  async function updateStatus(b: Booking, status: BookingStatus) {
    if (status === b.status) return;
    setSavingId(b.id);
    setNotice(null);
    try {
      const saved = await api.updateBooking(b.id, { status });
      await loadAll();
      let text = `${b.client_name}: status changed to ${STATUS_LABEL[status].toLowerCase()}.`;
      let kind: "ok" | "error" = "ok";
      if (saved.confirmation_email === "sent") text += ` A confirmation email was sent to ${b.email}.`;
      else if (saved.confirmation_email === "mock") {
        text += " No confirmation email was sent because email (SMTP) is not configured on the server.";
        kind = "error";
      } else if (saved.confirmation_email === "failed") {
        text += " The status was saved, but the confirmation email failed to send. Check the server logs.";
        kind = "error";
      }
      setNotice({ kind, text });
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) return signOut();
      setNotice({ kind: "error", text: err instanceof Error ? err.message : "Could not update the booking." });
    } finally {
      setSavingId(null);
    }
  }

  async function markRead(id: string) {
    try {
      await api.markNotificationRead(id);
      await loadAll();
    } catch (err: unknown) {
      setNotice({ kind: "error", text: err instanceof Error ? err.message : "Could not update the notification." });
    }
  }

  async function markAllRead() {
    try {
      await api.markAllRead();
      await loadAll();
    } catch (err: unknown) {
      setNotice({ kind: "error", text: err instanceof Error ? err.message : "Could not update notifications." });
    }
  }

  const byDate = useMemo(() => [...bookings].sort((a, b) => a.date.localeCompare(b.date)), [bookings]);
  const today = todayISO();
  const upcoming = useMemo(
    () => byDate.filter((b) => b.date >= today && ["PENDING", "HOLD", "CONFIRMED"].includes(b.status)).slice(0, 6),
    [byDate, today]
  );
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const visibleBookings = statusFilter === "ALL" ? byDate : byDate.filter((b) => b.status === statusFilter);

  if (loading) {
    return (
      <p className="page-pad py-24 text-[17px]" role="status">
        Loading dashboard…
      </p>
    );
  }
  if (error) {
    return (
      <div className="page-pad py-24" role="alert">
        <p className="font-display text-3xl">The dashboard couldn&rsquo;t load.</p>
        <p className="mt-3 text-black/70">{error}</p>
        <button type="button" className="btn-cobalt-on-light mt-8" onClick={() => { setLoading(true); loadAll(); }}>
          Try again
        </button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Overview" },
    { id: "enquiries", label: `Enquiries (${enquiries.length})` },
    { id: "bookings", label: `Bookings (${bookings.length})` },
    { id: "notifications", label: unread ? `Notifications (${unread} unread)` : "Notifications" },
    { id: "calendar", label: "Agenda" },
  ];

  return (
    <section className="page-pad pb-28 pt-14" data-testid="admin-dashboard">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl leading-none md:text-7xl">Studio admin</h1>
        <button type="button" onClick={signOut} className="btn-ghost-dark">Sign out</button>
      </div>

      <div role="tablist" aria-label="Admin sections" className="mb-10 flex flex-wrap gap-x-8 gap-y-2 border-b border-black/15">
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`-mb-px min-h-[48px] border-b-2 text-[15px] font-medium transition-colors ${
              tab === t.id ? "border-cobalt text-cobalt" : "border-transparent text-black/65 hover:text-black"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" role="status" className="empty:hidden">
        {notice && (
          <p className={`mb-8 border-l-2 p-4 text-[15px] ${notice.kind === "ok" ? "border-cobalt bg-cobalt/10" : "border-black bg-black/[0.06] font-medium"}`}>
            {notice.text}
          </p>
        )}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "dashboard" && (
          <div className="grid gap-px bg-black/15 md:grid-cols-3">
            <Stat label="Pending requests" value={pendingCount} />
            <Stat label="Confirmed bookings" value={confirmedCount} />
            <Stat label="Unread notifications" value={unread} />
            <div className="bg-white py-8 md:col-span-3">
              <h2 className="mb-4 font-display text-3xl">Coming up</h2>
              {upcoming.length === 0 && <p className="text-black/65">No upcoming pending, held or confirmed dates.</p>}
              <ul>
                {upcoming.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 py-4 first:border-t-0">
                    <span>
                      <span className="font-medium">{b.client_name}</span>
                      <span className="text-black/65"> · {b.event_type} · {b.location}</span>
                    </span>
                    <span className="flex items-center gap-4 text-[15px]">
                      <span className="text-black/65">{formatDate(b.date)}</span>
                      <StatusBadge status={b.status} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "enquiries" && (
          <ul className="grid gap-4">
            {enquiries.length === 0 && <p className="text-black/65">No enquiries yet. New enquiries from the consultation form appear here.</p>}
            {enquiries.map((e) => (
              <li key={e.enquiry_id} className="border border-black/15 p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-2xl">{e.client_name}</h2>
                  <span className="text-sm text-black/60">{e.enquiry_id}</span>
                </div>
                <p className="mt-2 text-black/75">{e.event_type} · {formatDate(e.date)} · {e.location}{e.guest_count ? ` · ${e.guest_count} guests` : ""}</p>
                <p className="text-black/75">
                  <a className="link-line" href={`tel:${e.phone}`}>{e.phone}</a> · <a className="link-line" href={`mailto:${e.email}`}>{e.email}</a>
                </p>
                {e.requirements && <p className="mt-3">{e.requirements}</p>}
                {e.message && <p className="mt-2 italic text-black/70">&ldquo;{e.message}&rdquo;</p>}
                <p className="mt-4 text-sm text-black/60">Budget: {e.budget} · {EMAIL_NOTICE[e.email_delivery] ?? e.email_delivery}</p>
              </li>
            ))}
          </ul>
        )}

        {tab === "bookings" && (
          <div>
            <div className="mb-6 max-w-xs">
              <label htmlFor="status-filter" className="field-label">Show</label>
              <select id="status-filter" className="field-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "ALL" | BookingStatus)}>
                <option value="ALL">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>
            {visibleBookings.length === 0 && <p className="text-black/65">No bookings match this filter.</p>}
            <ul className="grid gap-3">
              {visibleBookings.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-4 border border-black/15 p-5">
                  <div>
                    <p>
                      <span className="font-medium">{b.client_name}</span>
                      <span className="text-black/65"> · {b.event_type} · {b.location}</span>
                    </p>
                    <p className="text-[15px] text-black/65">{formatDate(b.date)} · {b.phone} · {b.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={b.status} />
                    <label className="sr-only" htmlFor={`status-${b.id}`}>Change status for {b.client_name}</label>
                    <select
                      id={`status-${b.id}`}
                      value={b.status}
                      disabled={savingId === b.id}
                      onChange={(e) => updateStatus(b, e.target.value as BookingStatus)}
                      className="min-h-[44px] border border-black/30 bg-white px-3 text-[15px] disabled:opacity-50"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "notifications" && (
          <div>
            {notifications.length > 0 && unread > 0 && (
              <button type="button" onClick={markAllRead} className="btn-ghost-dark mb-6">Mark all as read</button>
            )}
            {notifications.length === 0 && <p className="text-black/65">No notifications yet.</p>}
            <ul className="grid gap-3">
              {notifications.map((n) => (
                <li key={n.id} className={`flex flex-wrap items-start justify-between gap-4 border p-5 ${n.read ? "border-black/10 text-black/65" : "border-cobalt"}`}>
                  <div>
                    <p className={n.read ? "" : "font-medium text-black"}>
                      {!n.read && <span className="mr-2 inline-block h-2 w-2 bg-cobalt align-middle" aria-hidden="true" />}
                      {!n.read && <span className="sr-only">Unread: </span>}
                      {n.title}
                    </p>
                    <p className="mt-1 text-[15px]">{String(n.payload.client_name ?? "")} · {String(n.payload.phone ?? "")} · {String(n.payload.email ?? "")}</p>
                    <p className="mt-1 text-sm text-black/55">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                  {!n.read && <button type="button" onClick={() => markRead(n.id)} className="btn-ghost-dark !min-h-[44px] !py-2">Mark as read</button>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "calendar" && (
          <div>
            <p className="mb-6 text-black/65">All bookings in date order. This agenda uses the same records as the public availability check.</p>
            {byDate.length === 0 && <p className="text-black/65">No bookings yet.</p>}
            <ul>
              {byDate.map((b) => (
                <li key={b.id} className="grid grid-cols-[8.5rem_1fr_auto] items-center gap-4 border-t border-black/10 py-4 max-sm:grid-cols-1">
                  <span className="text-black/65">{formatDate(b.date)}</span>
                  <span>{b.client_name} · {b.event_type} · {b.location}</span>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white py-8 md:pr-8">
      <p className="text-[15px] text-black/65">{label}</p>
      <p className="mt-2 font-display text-7xl leading-none text-cobalt">{value}</p>
    </div>
  );
}
