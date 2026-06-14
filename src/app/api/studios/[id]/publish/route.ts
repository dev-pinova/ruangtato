import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { requireStudioPermission } from "@/lib/studio/studio-guard"
import {
  publishStudio,
  studioHasActiveSubscription,
} from "@/lib/studio/studio-service"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const guard = await requireStudioPermission(request, id, "publish")
  if (guard instanceof Response) return guard

  const hasSubscription = await studioHasActiveSubscription(id)
  if (!hasSubscription) {
    return NextResponse.json({ error: "Subscription required" }, { status: 402 })
  }

  try {
    const studio = await publishStudio(id)
    if (!studio) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }

    // The homepage and the studio's public page are statically cached (ISR).
    // Revalidate them on publish so the newly published studio appears
    // immediately instead of after the revalidate window elapses.
    revalidatePath("/")
    if (studio.slug) {
      revalidatePath(`/app/studio/${studio.slug}`)
    }

    return NextResponse.json({ studio })
  } catch (error) {
    console.error("Failed to publish studio:", error)
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 })
  }
}
