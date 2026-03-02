import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const role = token?.role;

  if (!token) {
    return;
  }
  const { pathname } = req.nextUrl;

  if (token && pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const publicRoutes = ["/", "/signin", "/signup"];
  const captainRoutes = ["/dashboard", "/my-rides", "earning"];
  const userRoutes = ["/book-ride"];

  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", req.url));
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
  matcher: ["/signin"],
};

export default proxy;
