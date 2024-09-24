import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePath = [""];
const publicPath = ["/login", "/register"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const path = request.nextUrl.pathname;
  if (accessToken && publicPath.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/register"],
};
