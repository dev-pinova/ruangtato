import { ShowcasePage } from "@/components/showcase/showcase-page"
import { listPublishedStudios } from "@/lib/studio-service"
import { getCitiesFromStudios } from "@/lib/studio-utils"

export const dynamic = "force-dynamic"

export default async function Home() {
  const studios = await listPublishedStudios()
  const cities = getCitiesFromStudios(studios)

  return <ShowcasePage studios={studios} cities={cities} />
}
