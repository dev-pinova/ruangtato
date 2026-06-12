import type { MetadataRoute } from "next"
import { and, eq } from "drizzle-orm"

import { PUBLIC_STATIC_PATHS } from "@/lib/seo"
import { db, isDatabaseConfigured } from "@/db"
import { studios } from "@/db/schema"
import { SITE_URL, studioPublicUrl } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticEntries: MetadataRoute.Sitemap = PUBLIC_STATIC_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }))

  let studioEntries: MetadataRoute.Sitemap = []
  
  if (isDatabaseConfigured() && db) {
    try {
      const activeStudios = await db
        .select({
          slug: studios.slug,
          updatedAt: studios.updatedAt,
        })
        .from(studios)
        .where(and(eq(studios.isPublished, true), eq(studios.status, "active")))

      studioEntries = activeStudios.map((studio) => ({
        url: studioPublicUrl(studio.slug),
        lastModified: studio.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    } catch {
      studioEntries = []
    }
  }

  return [...staticEntries, ...studioEntries]
}
