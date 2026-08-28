import { NextResponse, type NextRequest } from "next/server";
import { HR_COOKIE, configuredCredentials, isHrRoute, sessionToken } from "@/lib/session/hr";

/**
 * Keeps the HR side behind the gate. The cookie is checked here rather than in
 * each page, so a route added to HR_ROUTES is covered the moment it exists.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isHrRoute(pathname)) return NextResponse.next();

  const expected = configuredCredentials();
  const cookie = request.cookies.get(HR_COOKIE)?.value;
  if (cookie === sessionToken(expected.id, expected.passcode)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/hr";
  url.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/room/:path*", "/criteria/:path*", "/competencies/:path*", "/candidates/:path*", "/records/:path*"],
};
