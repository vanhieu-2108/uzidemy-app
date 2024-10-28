import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePath = ["/profile"];
const publicPath = ["/login", "/register"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const path = request.nextUrl.pathname;
  const isAuth = Boolean(refreshToken);

  if (isAuth && publicPath.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuth && privatePath.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (privatePath.some((path) => path.startsWith(path)) && !accessToken && refreshToken) {
    const url = new URL("/refresh-token", request.url);
    url.searchParams.set("refreshToken", refreshToken);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/register", "/profile"],
};
