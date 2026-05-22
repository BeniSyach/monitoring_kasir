import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

type JwtPayload = {
  exp: number;
};

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  // halaman auth
  const isAuthPage =
    pathname === "/signin" || pathname === "/signup";

  // skip asset
  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".gif") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js");

  if (isAsset) {
    return NextResponse.next();
  }

  // belum login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // sudah login tapi buka signin/signup
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // cek expired jwt
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        const response = NextResponse.redirect(
          new URL("/signin", request.url)
        );

        response.cookies.delete("token");

        return response;
      }
    } catch {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};