import { NextResponse, type NextRequest } from "next/server";

// Protected routes - routes that require authentication
const protectedRoutes = ["/profile", "/orders", "/reports", "/checkout"];

// Routes that should NOT be accessible when logged in
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  // We can't access localStorage in middleware, so we continue to use cookies
  // The auth hook will handle synchronizing the token between localStorage and cookies
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // If user is not logged in and trying to access a protected route, redirect to login
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is logged in and trying to access an auth route, redirect to home
  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
