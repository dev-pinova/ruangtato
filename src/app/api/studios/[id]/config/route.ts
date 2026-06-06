import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  getStudioForUser,
  saveStudioPageConfig,
  studioHasActiveSubscription,
  userCanAccessStudio,
} from "@/lib/studio-service"
import type { Block } from "@/lib/types"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const allowed = await userCanAccessStudio(session.user.id, id)
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio || studio.id !== id) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  return NextResponse.json({
    slug: studio.slug,
    blocks: studio.blocks,
    isPublished: studio.isPublished,
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const allowed = await userCanAccessStudio(session.user.id, id)
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const hasSubscription = await studioHasActiveSubscription(id)
  if (!hasSubscription) {
    return NextResponse.json({ error: "Subscription required" }, { status: 402 })
  }

  const body = await request.json().catch(() => null)
  if (!body || !Array.isArray(body.blocks)) {
    return NextResponse.json({ error: "blocks array is required" }, { status: 400 })
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : undefined
  const blocks = body.blocks as Block[]

  try {
    const studio = await saveStudioPageConfig(id, blocks, slug)
    if (!studio) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }
    return NextResponse.json({ studio })
  } catch (error) {
    console.error("Failed to save page config:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
