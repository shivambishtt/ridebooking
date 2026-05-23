import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const role = token?.role;

  const { pathname } = req.nextUrl;
  const publicRoutes = ["/", "/signin", "/signup", "/captain-signup"];
  const captainRoutes = ["/dashboard", "/rides", "/vehicle", "/account"];
  const userRoutes = ["/book-ride", "/rides", "/account"];

  if (token && pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && captainRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (token) {
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
  }
}

export const config = {
  matcher: ["/signin", "/rides", "/vehicle", "/account"],
};

export default proxy;
