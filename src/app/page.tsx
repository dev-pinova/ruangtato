import type { Metadata } from "next"

import { JsonLd } from "@/components/seo/json-ld"
import { ShowcasePage } from "@/components/showcase/showcase-page"
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  staticPageMetadata,
} from "@/lib/seo"
import { listPublishedStudios } from "@/lib/studio/studio-service"
import { getCitiesFromStudios } from "@/lib/studio/studio-utils"

export const revalidate = 300

export const metadata: Metadata = staticPageMetadata("/")

export default async function Home() {
  const studios = await listPublishedStudios()
  const cities = getCitiesFromStudios(studios)

  return (
    <>
      <JsonLd data={[buildWebSiteJsonLd(), buildOrganizationJsonLd()]} />
      <ShowcasePage studios={studios} cities={cities} />
    </>
  )
}
