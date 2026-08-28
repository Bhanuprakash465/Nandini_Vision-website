import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

/**
 * Server-side proxy to the FastAPI backend. The browser only ever talks
 * to same-origin /api/* route handlers; the backend host never leaks.
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let cookieHeader = "";
  try {
    const store = await cookies();
    cookieHeader = store
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  } catch {
    // cookies() is unavailable during static generation — fine.
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { detail?: string })?.detail ??
      "We couldn't connect right now. Please try again or contact us on WhatsApp.";
    const error = new Error(message) as Error & { status: number; body: unknown };
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body as T;
}
