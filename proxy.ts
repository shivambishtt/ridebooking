import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = token?.role;
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/", "/signin", "/signup", "/captain-signup"];

  const captainRoutes = ["/dashboard", "/rides", "/vehicle", "/account"];

  const userRoutes = ["/rides", "/account"];

  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (!token) {
    return NextResponse.next();
  }

  if (!token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    role === "captain" &&
    !captainRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    role === "user" &&
    !userRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/captain-signup",
    "/rides/:path*",
    "/vehicle/:path*",
    "/account/:path*",
  ],
};

export default proxy;
