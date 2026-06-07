import { getSessionCookie } from "better-auth/cookies"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_APP_PREFIXES = ["/app/studio/"]
const PUBLIC_ADMIN_PATHS = ["/admin/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin")) {
    if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      return NextResponse.next()
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.next()
    }

    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  if (!pathname.startsWith("/app")) {
    return NextResponse.next()
  }

  if (PUBLIC_APP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.next()
  }

  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
}
