import { NextResponse } from "next/server"

import { listPublishedStudios } from "@/lib/studio-service"

export async function GET() {
  const studios = await listPublishedStudios()

  return NextResponse.json({
    studios: studios.map((studio) => ({
      id: studio.id,
      slug: studio.slug,
      name: studio.name,
      city: studio.city,
      description: studio.description,
      image: studio.image,
      artist: studio.artist,
      tags: studio.tags,
      viewCount: studio.viewCount,
      clickCount: studio.clickCount,
      isTrusted: studio.isTrusted,
      isPublished: studio.isPublished,
    })),
  })
}
