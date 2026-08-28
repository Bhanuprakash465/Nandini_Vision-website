import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/server";

/**
 * Admin login proxy — the FastAPI backend verifies credentials and issues
 * a JWT; the Next.js handler stores it in an httpOnly, same-site cookie so
 * the token never touches browser JavaScript.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const result = await apiFetch<{ ok: boolean; token: string }>(
      "/api/admin/login",
      { method: "POST", body: JSON.stringify(payload) },
    );
    const res = NextResponse.json({ ok: true });
    res.cookies.set("nv_admin", result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 72,
      path: "/",
    });
    return res;
  } catch (err) {
    const status = (err as { status?: number })?.status ?? 401;
    const message =
      (err as Error)?.message ?? "Incorrect email or password.";
    return NextResponse.json({ detail: message }, { status });
  }
}
