import { NextResponse } from "next/server"

import { requireStudioPermission } from "@/lib/studio/studio-guard"
import {
  getStudioForUser,
  saveStudioPageConfig,
  studioHasActiveSubscription,
} from "@/lib/studio/studio-service"
import type { Block } from "@/lib/types"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  // Read access: any active member of the studio may load its config.
  const guard = await requireStudioPermission(request, id, "content:write")
  if (guard instanceof Response) return guard

  const studio = await getStudioForUser(guard.userId)
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

  const guard = await requireStudioPermission(request, id, "content:write")
  if (guard instanceof Response) return guard

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
