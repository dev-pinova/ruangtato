import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"
import { NOINDEX_PATHS } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/studio/"],
        disallow: ["/api/", ...NOINDEX_PATHS],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
