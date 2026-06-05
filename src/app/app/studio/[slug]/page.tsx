import { notFound } from "next/navigation"
import { Eye, MousePointerClick } from "lucide-react"

import { getStudioBySlug, getVisibleBlocks } from "@/lib/mock-data"
import { BlockHeader } from "@/components/blocks/header"
import { BlockHero } from "@/components/blocks/hero"
import { BlockGoals } from "@/components/blocks/goals"
import { BlockOverview } from "@/components/blocks/overview"
import { BlockFeatures } from "@/components/blocks/features"
import { BlockHowItWorks } from "@/components/blocks/how-it-works"
import { BlockCreatorBio } from "@/components/blocks/creator-bio"
import { BlockTestimonials } from "@/components/blocks/testimonials"
import { BlockFAQ } from "@/components/blocks/faq"
import { BlockFinalCTA } from "@/components/blocks/final-cta"
import { BlockFooter } from "@/components/blocks/footer"
import { BlockLeadForm } from "@/components/blocks/lead-form"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BLOCK_COMPONENTS: Record<string, React.ComponentType<{ data: any; waNumber?: string }>> = {
  Header: BlockHeader,
  Hero: BlockHero,
  Goals: BlockGoals,
  Overview: BlockOverview,
  Features: BlockFeatures,
  HowItWorks: BlockHowItWorks,
  CreatorBio: BlockCreatorBio,
  Testimonials: BlockTestimonials,
  FAQ: BlockFAQ,
  FinalCTA: BlockFinalCTA,
  Footer: BlockFooter,
}

export default async function StudioRendererPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const studio = getStudioBySlug(slug)

  if (!studio) {
    notFound()
  }

  const visibleBlocks = getVisibleBlocks(studio)

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {visibleBlocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.type]
        if (!Component) return null

        return (
          <div key={block.id}>
            <Component data={block.data} waNumber={studio.waNumber} />
            {block.type === "Header" && (
              <div className="border-y border-white/5 bg-zinc-950/70 py-3">
                <div className="container mx-auto flex items-center justify-center gap-6 px-4 text-sm font-medium text-white/70">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-primary" />
                    {studio.viewCount.toLocaleString("id-ID")} views
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MousePointerClick className="h-4 w-4 text-primary" />
                    {studio.clickCount.toLocaleString("id-ID")} clicks
                  </span>
                </div>
              </div>
            )}
            {block.type === "FAQ" && (
              <BlockLeadForm studioName={studio.name} />
            )}
          </div>
        )
      })}
    </main>
  )
}
