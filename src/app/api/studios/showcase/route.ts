import { NextResponse } from "next/server"

import { buildShowcaseStudios } from "@/lib/studio/showcase-demos"
import { listPublishedStudios } from "@/lib/studio/studio-service"

export async function GET() {
  const studios = buildShowcaseStudios(await listPublishedStudios())

  return NextResponse.json({
    studios: studios.map((studio) => ({
      id: studio.id,
      slug: studio.slug,
      name: studio.name,
      city: studio.city,
      description: studio.description,
      image: studio.image,
      artist: studio.artist,
      artistImage: studio.artistImage,
      tags: studio.tags,
      viewCount: studio.viewCount,
      clickCount: studio.clickCount,
      isTrusted: studio.isTrusted,
      isVerified: studio.isVerified,
      isPublished: studio.isPublished,
    })),
  })
}
