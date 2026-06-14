import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { checkRateLimit } from "@/lib/admin/admin-rate-limit"
import { incrementStudioViewCount } from "@/lib/studio/studio-service"

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]!.trim()
  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: slug } = await params

  // Cookie dedup below handles normal browsers; this IP cap is a second layer
  // against bots/scripts that drop cookies to inflate the view count.
  const ip = getClientIp(request)
  const rate = checkRateLimit(`track-view:${ip}:${slug}`, 10, 60_000)
  if (!rate.allowed) {
    return NextResponse.json({ ok: true, throttled: true })
  }

  try {
    const cookieStore = await cookies()
    const cookieName = `sv_${slug}`

    if (cookieStore.get(cookieName)) {
      return NextResponse.json({ ok: true, duplicated: true })
    }

    const ok = await incrementStudioViewCount(slug)
    if (!ok) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }

    // Set a session cookie to prevent subsequent increments
    cookieStore.set(cookieName, "1", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to track view:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}
