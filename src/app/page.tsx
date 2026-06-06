import { ShowcasePage } from "@/components/showcase/showcase-page"
import { listPublishedStudios } from "@/lib/studio-service"
import { getCitiesFromStudios } from "@/lib/studio-utils"

export default async function Home() {
  const studios = await listPublishedStudios()
  const cities = getCitiesFromStudios(studios)

  return <ShowcasePage studios={studios} cities={cities} />
}
