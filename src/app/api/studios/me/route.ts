import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  getStudioForUser,
  getStudioSuspendedFlagForUser,
  getSubscriptionForStudio,
  updateStudioProfile,
} from "@/lib/studio-service"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (await getStudioSuspendedFlagForUser(session.user.id)) {
    return NextResponse.json({ error: "Account suspended", suspended: true }, { status: 403 })
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  const subscription = await getSubscriptionForStudio(studio.id)

  return NextResponse.json({
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null,
    },
    studio,
    subscription: subscription
      ? {
          planType: subscription.planType,
          status: subscription.status,
          expiresAt: subscription.expiresAt?.toISOString() ?? null,
          midtransOrderId: subscription.midtransOrderId ?? null,
          createdAt: subscription.createdAt.toISOString(),
        }
      : null,
  })
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (await getStudioSuspendedFlagForUser(session.user.id)) {
    return NextResponse.json({ error: "Account suspended", suspended: true }, { status: 403 })
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const slug = typeof body.slug === "string" ? body.slug.trim() : ""
  const city = typeof body.city === "string" ? body.city.trim() : ""
  const waNumber = typeof body.waNumber === "string" ? body.waNumber.trim() : ""
  const description =
    typeof body.description === "string" ? body.description.trim() : ""
  const image = typeof body.image === "string" ? body.image.trim() : ""

  if (!name) {
    return NextResponse.json({ error: "Nama studio wajib diisi" }, { status: 400 })
  }

  try {
    const updated = await updateStudioProfile(studio.id, {
      name,
      slug,
      city,
      waNumber,
      description,
      image,
    })

    if (!updated) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }

    return NextResponse.json({ studio: updated })
  } catch (error) {
    console.error("Failed to update studio profile:", error)
    return NextResponse.json(
      { error: "Gagal menyimpan profil studio" },
      { status: 500 },
    )
  }
}
