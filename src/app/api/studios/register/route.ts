import { NextResponse } from "next/server"

import { isDatabaseConfigured } from "@/db"
import { auth } from "@/lib/auth"
import { createStudioForUser, getStudioForUser } from "@/lib/studio-service"

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

  const existing = await getStudioForUser(session.user.id)
  if (existing) {
    return NextResponse.json({ studio: existing })
  }

  const body = await request.json().catch(() => ({}))
  const studioName = typeof body.studioName === "string" ? body.studioName.trim() : ""

  if (!studioName) {
    return NextResponse.json({ error: "studioName is required" }, { status: 400 })
  }

  try {
    const city = typeof body.city === "string" ? body.city.trim() : "Jakarta"
    const waNumber =
      typeof body.waNumber === "string" ? body.waNumber.replace(/[^\d]/g, "") : ""

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
