import { Suspense } from "react"
import { listPublishedStudios } from "@/lib/studio/studio-service"
import { getCitiesFromStudios } from "@/lib/studio/studio-utils"
import { ExplorePage } from "@/components/explore/explore-page"
import { JsonLd } from "@/components/seo/json-ld"
import { buildWebSiteJsonLd, buildOrganizationJsonLd } from "@/lib/seo"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Explore() {
  const studios = await listPublishedStudios()
  const cities = getCitiesFromStudios(studios)

  return (
    <>
      <JsonLd data={[buildWebSiteJsonLd(), buildOrganizationJsonLd()]} />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ExplorePage studios={studios} cities={cities} hideHero={true} hideCta={true} />
      </Suspense>
    </>
  )
}
