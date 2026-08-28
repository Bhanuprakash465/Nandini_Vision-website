import type {
  AvailabilityResult,
  ConsultationFormValues,
  InquiryConfirmation,
} from "@/lib/types";

/**
 * Client-side API helpers. All requests go to same-origin
 * /api/* Next.js route handlers, which proxy to the FastAPI backend —
 * the browser never talks to the backend host directly.
 */

export class ApiError extends Error {
  status: number;
  detail?: unknown;
  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { detail?: string })?.detail ?? "We couldn't connect right now. Please try again.";
    throw new ApiError(res.status, message, body);
  }
  return body as T;
}

export async function checkAvailability(payload: {
  event_type?: string;
  event_date: string;
  event_location: string;
  event_duration?: number;
}): Promise<AvailabilityResult> {
  return request<AvailabilityResult>("/api/availability/check", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitInquiry(
  values: ConsultationFormValues
): Promise<InquiryConfirmation> {
  return request<InquiryConfirmation>("/api/inquiries", {
    method: "POST",
    body: JSON.stringify(values),
  });
}
