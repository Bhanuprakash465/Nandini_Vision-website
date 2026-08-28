import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/server";

/**
 * Generic authenticated admin proxy: forwards /api/admin/* calls (except
 * login/logout) to FastAPI, attaching the httpOnly cookie as a Bearer token
 * (backend expects Authorization header; the API session cookie from the
 * backend is short-lived in dev, so we translate).
 */
function toBackendPath(pathname: string): string {
  return pathname.replace(/^\/api/, "/api");
}

async function handle(
  req: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await params;
  const pathname = `/api/admin/${path.join("/")}`;
  const cookieHeader = req.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("nv_admin="))
    ?.split("=")[1]
    ?.trim();

  if (!token) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  try {
    const payload = ["POST", "PATCH", "PUT", "DELETE"].includes(req.method)
      ? await req.json().catch(() => undefined)
      : undefined;

    const result = await apiFetch(toBackendPath(pathname), {
      method: req.method,
      ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(result);
  } catch (err) {
    const status = (err as { status?: number })?.status ?? 500;
    const message =
      (err as Error)?.message ?? "We couldn't reach the studio server.";
    return NextResponse.json({ detail: message }, { status });
  }
}

export {
  handle as GET,
  handle as POST,
  handle as PATCH,
  handle as PUT,
  handle as DELETE,
};
