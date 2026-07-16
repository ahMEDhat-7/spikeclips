import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/studio", "/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      const redirect = pathname.startsWith("/") && !pathname.includes("://")
        ? pathname
        : "/dashboard";
      loginUrl.searchParams.set("callbackUrl", redirect);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/dashboard/:path*", "/profile/:path*"],
};
