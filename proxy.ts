// middleware.ts → rename file to proxy.ts

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "smc_auth";

// before: export function middleware(req: NextRequest) {
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/login";
  const isAuthApi = pathname === "/api/login";

  if (isAuthApi) return NextResponse.next();

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const isAuthed = !!cookie && cookie === process.env.SESSION_SECRET;

  if (!isAuthed && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthed && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};