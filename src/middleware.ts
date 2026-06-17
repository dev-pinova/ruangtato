import { getSessionCookie } from "better-auth/cookies"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_APP_PREFIXES = ["/app/studio/"]
const PUBLIC_ADMIN_PATHS = ["/admin/login"]
const AUTH_REQUIRED_PATHS = ["/checkout"]

/**
 * Returns a 503 response when a protected route is accessed but the database
 * is not configured. Fail-closed: better to show an error than to silently
 * allow unauthenticated access.
 */
function databaseNotConfiguredResponse() {
  return new NextResponse(
    JSON.stringify({ error: "Service unavailable: database not configured" }),
    {
      status: 503,
      headers: { "Content-Type": "application/json" },
    },
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  if (pathname.startsWith("/admin")) {
    if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      return NextResponse.next({ request: { headers: requestHeaders } })
    }

    // Fail-closed: do NOT let unauthenticated requests through when DB is absent.
    if (!process.env.DATABASE_URL) {
      return databaseNotConfiguredResponse()
    }

    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (!pathname.startsWith("/app")) {
    // Checkout & halaman success memerlukan sesi — redirect ke login jika belum
    if (AUTH_REQUIRED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      if (!process.env.DATABASE_URL) {
        return databaseNotConfiguredResponse()
      }

      const sessionCookie = getSessionCookie(request)
      if (!sessionCookie) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("next", pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (PUBLIC_APP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Fail-closed: do NOT let unauthenticated requests through when DB is absent.
  if (!process.env.DATABASE_URL) {
    return databaseNotConfiguredResponse()
  }

  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/checkout/:path*", "/checkout"],
}
