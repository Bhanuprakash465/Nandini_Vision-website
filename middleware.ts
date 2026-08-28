import { NextRequest, NextResponse } from "next/server";

/**
 * Route protection (UX layer). Real authorization always happens on the
 * FastAPI backend; this only bounces unauthenticated browsers to /login.
 */
export function middleware(req: NextRequest) {
  const hasCookie = req.cookies.has("nv_admin");

  if (req.nextUrl.pathname.startsWith("/admin") && !hasCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", "/admin");
    return NextResponse.redirect(url);
  }

  if (req.nextUrl.pathname === "/login" && hasCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
