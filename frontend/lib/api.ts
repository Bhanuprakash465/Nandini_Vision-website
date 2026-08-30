const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("nv_admin_token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error("API request failed:", error);

    throw new Error(
      `Unable to connect to the backend at ${API_URL}`
    );
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;

    try {
      const body = await res.json();

      if (typeof body?.detail === "string") {
        detail = body.detail;
      } else if (Array.isArray(body?.detail)) {
        detail = body.detail
          .map((item: any) => {
            if (typeof item === "string") return item;

            if (item?.msg) {
              return item.msg;
            }

            return JSON.stringify(item);
          })
          .join(", ");
      } else if (body?.message) {
        detail =
          typeof body.message === "string"
            ? body.message
            : JSON.stringify(body.message);
      } else if (body) {
        detail = JSON.stringify(body);
      }
    } catch {
      if (res.statusText) {
        detail = res.statusText;
      }
    }

    console.error("API error:", {
      status: res.status,
      path,
      detail,
    });

    throw new Error(detail);
  }

  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}

export const api = {
  checkAvailability: (
    payload: {
      event_type: string;
      date: string;
      location: string;
      duration: string;
    }
  ) =>
    request("/api/availability/check", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createEnquiry: (payload: Record<string, unknown>) =>
    request("/api/enquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (email: string, password: string) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  listEnquiries: () =>
    request("/api/enquiries"),

  listBookings: (status?: string) =>
    request(
      `/api/bookings${status ? `?status=${status}` : ""}`
    ),

  updateBooking: (
    id: string,
    payload: Record<string, unknown>
  ) =>
    request(`/api/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteBooking: (id: string) =>
    request(`/api/bookings/${id}`, {
      method: "DELETE",
    }),

  listNotifications: () =>
    request("/api/notifications"),

  unreadCount: () =>
    request("/api/notifications/unread-count"),

  markNotificationRead: (id: string) =>
    request(`/api/notifications/${id}/read`, {
      method: "PATCH",
    }),

  markAllRead: () =>
    request("/api/notifications/read-all", {
      method: "PATCH",
    }),
};

export { API_URL };