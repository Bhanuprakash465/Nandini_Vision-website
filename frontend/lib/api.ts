const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type BookingStatus = "PENDING" | "HOLD" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type Booking = {
  id: string;
  client_name: string;
  phone: string;
  email: string;
  event_type: string;
  date: string;
  duration?: string | null;
  location: string;
  guest_count?: number | null;
  requirements?: string | null;
  budget?: string | null;
  message?: string | null;
  status: BookingStatus;
  notes?: string | null;
  enquiry_id?: string | null;
  created_at: string;
  updated_at: string;
  /** Present only on the response to a change to CONFIRMED: what happened to the client email. */
  confirmation_email?: "sent" | "mock" | "failed" | null;
};

export type Enquiry = {
  enquiry_id: string;
  client_name: string;
  phone: string;
  email: string;
  event_type: string;
  date: string;
  location: string;
  guest_count?: number | null;
  requirements?: string | null;
  budget: string;
  message?: string | null;
  created_at: string;
  status: BookingStatus;
  email_delivery: "sent" | "mock" | "failed" | string;
};

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  payload: Record<string, string | number | null | undefined>;
  read: boolean;
  created_at: string;
};

export type AvailabilityResult = { date: string; status: string; note?: string | null };

export type EnquiryPayload = {
  client_name: string;
  phone: string;
  email: string;
  event_type: string;
  date: string;
  location: string;
  guest_count?: number | null;
  requirements?: string | null;
  budget: string;
  message?: string | null;
};

export const TOKEN_KEY = "nv_admin_token";

/** Thrown for any non-2xx response so callers can branch on `status`. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function tidy(msg: string): string {
  // FastAPI/pydantic prefixes custom validator messages with "Value error, ".
  return msg.replace(/^Value error,\s*/i, "");
}

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("The server could not be reached. Check your connection and try again.", 0);
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") {
        detail = body.detail;
      } else if (Array.isArray(body?.detail)) {
        detail = body.detail
          .map((item: unknown) => {
            if (typeof item === "string") return item;
            const msg = (item as { msg?: string })?.msg;
            const loc = (item as { loc?: (string | number)[] })?.loc;
            const field = loc && loc.length > 1 ? String(loc[loc.length - 1]).replace(/_/g, " ") : "";
            return msg ? (field ? `${field}: ${tidy(msg)}` : tidy(msg)) : JSON.stringify(item);
          })
          .join(", ");
      } else if (body?.message) {
        detail = typeof body.message === "string" ? body.message : JSON.stringify(body.message);
      }
    } catch {
      if (res.statusText) detail = res.statusText;
    }
    throw new ApiError(tidy(detail), res.status);
  }

  if (res.status === 204) return null as T;
  const contentType = res.headers.get("content-type") || "";
  return (contentType.includes("application/json") ? res.json() : res.text()) as Promise<T>;
}

export const api = {
  checkAvailability: (payload: { date: string; event_type?: string; location?: string }) =>
    request<AvailabilityResult>("/api/availability/check", { method: "POST", body: JSON.stringify(payload) }),

  createEnquiry: (payload: EnquiryPayload) =>
    request<Enquiry>("/api/enquiries", { method: "POST", body: JSON.stringify(payload) }),

  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  listEnquiries: () => request<Enquiry[]>("/api/enquiries"),

  listBookings: (status?: string) => request<Booking[]>(`/api/bookings${status ? `?status=${status}` : ""}`),

  updateBooking: (id: string, payload: Partial<Pick<Booking, "status" | "date" | "location" | "notes">>) =>
    request<Booking>(`/api/bookings/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),

  deleteBooking: (id: string) => request<{ deleted: boolean }>(`/api/bookings/${id}`, { method: "DELETE" }),

  listNotifications: () => request<NotificationItem[]>("/api/notifications"),

  unreadCount: () => request<{ count: number }>("/api/notifications/unread-count"),

  markNotificationRead: (id: string) =>
    request<NotificationItem>(`/api/notifications/${id}/read`, { method: "PATCH" }),

  markAllRead: () => request<{ updated: number }>("/api/notifications/read-all", { method: "PATCH" }),
};

export { API_URL };
