import { isAdmin } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePath = ["/profile"];
const publicPath = ["/login", "/register"];
const adminPath = ["/manage"];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const path = request.nextUrl.pathname;
  const isAuth = Boolean(refreshToken);
  const checkAdmin = isAdmin(accessToken as string);

  if (isAuth && publicPath.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuth && privatePath.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!checkAdmin && adminPath.some((admin) => path.startsWith(admin))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (privatePath.includes(path) && !accessToken && refreshToken) {
    const url = new URL("/refresh-token", request.url);
    url.searchParams.set("refreshToken", refreshToken);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/profile", "/manage/:path*"],
};
