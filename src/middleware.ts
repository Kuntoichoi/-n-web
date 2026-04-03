import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register") ||
      req.nextUrl.pathname.startsWith("/forgot-password");

    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isAdminPage) {
      if (!isAuth || req.nextauth.token?.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return null;
  },
  {
    callbacks: {
      authorized: () => true, // We handle redirects in the middleware func
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/login", "/register", "/forgot-password"],
};
