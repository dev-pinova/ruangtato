import { NextResponse } from "next/server"

import { isDatabaseConfigured } from "@/db"
import { auth } from "@/lib/auth/auth"
import { createStudioForUser, getStudioForUser, getStudioSuspendedFlagForUser } from "@/lib/studio/studio-service"
import { parseJsonBody, z } from "@/lib/validation"

const StudioRegisterSchema = z.object({
  studioName: z.string().trim().min(1, "studioName is required").max(120),
  city: z.string().trim().min(1).max(80).optional(),
  waNumber: z.string().optional(),
})

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured. Set DATABASE_URL in .env." },
      { status: 503 },
    )
  }

  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const isSuspended = await getStudioSuspendedFlagForUser(session.user.id)
  if (isSuspended) {
    return NextResponse.json(
      { error: "Akun Anda telah ditangguhkan. Silakan hubungi admin." },
      { status: 403 }
    )
  }

  const existing = await getStudioForUser(session.user.id)
  if (existing) {
    return NextResponse.json({ studio: existing })
  }

  const parsed = await parseJsonBody(request, StudioRegisterSchema)
  if (!parsed.ok) return parsed.response

  const studioName = parsed.data.studioName

  try {
    const city = parsed.data.city?.trim() || "Jakarta"
    const waNumber = parsed.data.waNumber
      ? parsed.data.waNumber.replace(/[^\d]/g, "")
      : ""

    const studio = await createStudioForUser({
      userId: session.user.id,
      studioName,
      ownerName: session.user.name,
      city,
      waNumber,
    })
    return NextResponse.json({ studio }, { status: 201 })
  } catch (error) {
    console.error("Failed to create studio:", error)
    const message =
      error instanceof Error ? error.message : "Failed to create studio"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
