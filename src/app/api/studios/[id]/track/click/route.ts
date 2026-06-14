import { NextResponse } from "next/server"

import { checkRateLimit } from "@/lib/admin/admin-rate-limit"
import { incrementStudioClickCount } from "@/lib/studio/studio-service"

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

  // Public, unauthenticated metric — cap per IP+studio to limit count inflation.
  const ip = getClientIp(request)
  const rate = checkRateLimit(`track-click:${ip}:${slug}`, 20, 60_000)
  if (!rate.allowed) {
    return NextResponse.json({ ok: true, throttled: true })
  }

  try {
    const ok = await incrementStudioClickCount(slug)
    if (!ok) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to track click:", error)
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
  }
}
