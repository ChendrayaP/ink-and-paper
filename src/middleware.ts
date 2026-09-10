import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { devFixturesEnabled } from "@/lib/data/fixtures";

/*
  Runs ONLY for /studio (see matcher). It refreshes the session and, when the
  visitor is not authenticated, redirects to /auth. Author-role authorization
  is enforced in the Studio layout (server) and by RLS. Public pages never hit
  this middleware, so they stay fast and statically rendered.
*/
export async function middleware(request: NextRequest) {
  // Dev-preview only: let the Studio render without a session (flag never set in prod).
  if (devFixturesEnabled()) return NextResponse.next();

  const { response, user } = await updateSession(request);

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth";
    redirectUrl.search = ""; // never carry an attacker-controlled redirect target
    const redirect = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  // Reduce the chance of private pages lingering in the back/forward cache.
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  return response;
}

export const config = {
  matcher: ["/studio", "/studio/:path*"],
};
