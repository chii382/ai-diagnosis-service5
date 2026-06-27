import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { adminAccessDeniedPath } from "@/lib/admin/access-denied";
import { isAdminRole } from "@/lib/user/types";

export default NextAuth(authConfig).auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/diagnosis");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (!isAdminRole(req.auth?.user?.role)) {
      return NextResponse.redirect(new URL(adminAccessDeniedPath(), req.url));
    }
    return NextResponse.next();
  }

  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/diagnosis/:path*", "/admin/:path*"],
};
