import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const result = await apiFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const status = (err as { status?: number })?.status ?? 503;
    const message =
      (err as Error)?.message ??
      "We couldn't connect right now. Please try again or contact us on WhatsApp.";
    return NextResponse.json({ detail: message }, { status });
  }
}
