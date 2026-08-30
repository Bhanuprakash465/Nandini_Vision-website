const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("nv_admin_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {}
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  checkAvailability: (payload: { event_type: string; date: string; location: string; duration: string }) =>
    request("/api/availability/check", { method: "POST", body: JSON.stringify(payload) }),

  createEnquiry: (payload: Record<string, unknown>) =>
    request("/api/enquiries", { method: "POST", body: JSON.stringify(payload) }),

  login: (email: string, password: string) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  listEnquiries: () => request("/api/enquiries"),
  listBookings: (status?: string) => request(`/api/bookings${status ? `?status=${status}` : ""}`),
  updateBooking: (id: string, payload: Record<string, unknown>) =>
    request(`/api/bookings/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteBooking: (id: string) => request(`/api/bookings/${id}`, { method: "DELETE" }),

  listNotifications: () => request("/api/notifications"),
  unreadCount: () => request("/api/notifications/unread-count"),
  markNotificationRead: (id: string) => request(`/api/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => request("/api/notifications/read-all", { method: "PATCH" }),
};

export { API_URL };
