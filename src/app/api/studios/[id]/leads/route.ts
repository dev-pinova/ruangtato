import { NextResponse } from "next/server"

import { checkRateLimit } from "@/lib/admin/admin-rate-limit"
import { createStudioLead } from "@/lib/studio/studio-service"
import { parseJsonBody, z } from "@/lib/validation"

const LeadSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(120),
  message: z.string().trim().min(1, "message is required").max(2000),
  email: z
    .string()
    .trim()
    .max(254)
    .email("email is not valid")
    .optional()
    .or(z.literal("").transform(() => undefined)),
})

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

  // Public, unauthenticated endpoint — rate limit per IP+studio to curb spam.
  const ip = getClientIp(request)
  const rate = checkRateLimit(`lead:${ip}:${slug}`, 5, 60_000)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak permintaan. Coba lagi dalam ${rate.retryAfterSec} detik.` },
      { status: 429 },
    )
  }

  const parsed = await parseJsonBody(request, LeadSchema)
  if (!parsed.ok) return parsed.response
  const { name, message, email } = parsed.data

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
