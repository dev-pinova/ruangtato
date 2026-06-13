import { NextResponse } from "next/server"

import { checkRateLimit } from "@/lib/admin/admin-rate-limit"
import { createStudioLead } from "@/lib/studio/studio-service"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME_LENGTH = 120
const MAX_MESSAGE_LENGTH = 2000

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]!.trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: slug } = await params

  // Public, unauthenticated endpoint — rate limit per IP+studio to curb spam.
  const ip = getClientIp(request)
  const rate = checkRateLimit(`lead:${ip}:${slug}`, 5, 60_000)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak permintaan. Coba lagi dalam ${rate.retryAfterSec} detik.` },
      { status: 429 },
    )
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body.name !== "string" || typeof body.message !== "string") {
    return NextResponse.json(
      { error: "name and message are required" },
      { status: 400 },
    )
  }

  const name = body.name.trim()
  const message = body.message.trim()
  const email = typeof body.email === "string" ? body.email.trim() : undefined

  if (!name || !message) {
    return NextResponse.json({ error: "name and message are required" }, { status: 400 })
  }

  if (name.length > MAX_NAME_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: "Nama atau pesan terlalu panjang." },
      { status: 400 },
    )
  }

  if (email && !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 })
  }

  try {
    const lead = await createStudioLead({ slug, name, email, message })
    if (!lead) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }
    return NextResponse.json({ lead }, { status: 201 })
  } catch (error) {
    console.error("Failed to create lead:", error)
    return NextResponse.json({ error: "Failed to submit lead" }, { status: 500 })
  }
}
