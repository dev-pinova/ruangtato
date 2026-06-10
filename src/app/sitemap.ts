import type { MetadataRoute } from "next"

import { PUBLIC_STATIC_PATHS } from "@/lib/seo"
import { listPublishedStudios } from "@/lib/studio/studio-service"
import { SITE_URL, studioPublicUrl } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticEntries: MetadataRoute.Sitemap = PUBLIC_STATIC_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }))

  let studioEntries: MetadataRoute.Sitemap = []
  try {
    const studios = await listPublishedStudios()
    studioEntries = studios.map((studio) => ({
      url: studioPublicUrl(studio.slug),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch {
    studioEntries = []
  }

  return [...staticEntries, ...studioEntries]
}
