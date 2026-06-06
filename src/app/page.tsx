import type { Metadata } from "next"

import { JsonLd } from "@/components/seo/json-ld"
import { ShowcasePage } from "@/components/showcase/showcase-page"
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  createPageMetadata,
} from "@/lib/seo"
import { buildShowcaseStudios } from "@/lib/showcase-demos"
import { listPublishedStudios } from "@/lib/studio-service"
import { getCitiesFromStudios } from "@/lib/studio-utils"

export const dynamic = "force-dynamic"

export const metadata: Metadata = createPageMetadata({
  title: "Direktori Studio Tattoo Indonesia",
  description:
    "Temukan studio tattoo terpercaya di Indonesia. Jelajahi portofolio artist, filter berdasarkan kota dan gaya, lalu booking konsultasi lewat WhatsApp.",
  path: "/",
})

export default async function Home() {
  const published = await listPublishedStudios()
  const studios = buildShowcaseStudios(published)
  const cities = getCitiesFromStudios(studios)

  return (
    <>
      <JsonLd data={[buildWebSiteJsonLd(), buildOrganizationJsonLd()]} />
      <ShowcasePage studios={studios} cities={cities} />
    </>
  )
}
