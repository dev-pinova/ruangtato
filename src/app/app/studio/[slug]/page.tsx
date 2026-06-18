import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Eye, MousePointerClick } from "lucide-react"

import { JsonLd } from "@/components/seo/json-ld"
import { buildStudioJsonLd, createPageMetadata } from "@/lib/seo"
import {
  getPublishedStudioBySlug,
  getSuspendedStudioBySlug,
  listPublishedStudios,
} from "@/lib/studio/studio-service"
import { getVisibleBlocks } from "@/lib/studio/studio-utils"
import { BlockHeader } from "@/components/blocks/header"
import { BlockHeaderOverlay } from "@/components/blocks/header-overlay"
import { BlockHero } from "@/components/blocks/hero"
import { BlockHeroSlider } from "@/components/blocks/hero-slider"
import { BlockGoals } from "@/components/blocks/goals"
import { BlockGallery } from "@/components/blocks/gallery"
import { BlockOverview } from "@/components/blocks/overview"
import { BlockFeatures } from "@/components/blocks/features"
import { BlockServicesCards } from "@/components/blocks/services-cards"
import { BlockHowItWorks } from "@/components/blocks/how-it-works"
import { BlockCreatorBio } from "@/components/blocks/creator-bio"
import { BlockArtistsGrid } from "@/components/blocks/artists-grid"
import { BlockStatsCounter } from "@/components/blocks/stats-counter"
import { BlockTestimonials } from "@/components/blocks/testimonials"
import { BlockLatestNews } from "@/components/blocks/latest-news"
import { BlockNewsletter } from "@/components/blocks/newsletter"
import { BlockFAQ } from "@/components/blocks/faq"
import { BlockAppointmentForm } from "@/components/blocks/appointment-form"
import { BlockFinalCTA } from "@/components/blocks/final-cta"
import { BlockFooter } from "@/components/blocks/footer"
import { BlockLeadForm } from "@/components/blocks/lead-form"
import { StudioTracker } from "@/components/studio/studio-tracker"
import { FloatingWhatsAppButton } from "@/components/studio/floating-whatsapp"
import type { AppointmentFormData, BlockType } from "@/lib/types"
import { getLocale } from "@/lib/i18n/actions"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  try {
    const published = await listPublishedStudios()
    return published.map((studio) => ({
      slug: studio.slug,
    }))
  } catch {
    return []
  }
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const t = await getDictionary(locale)
  const studio = await getPublishedStudioBySlug(slug)

  if (!studio) {
    return createPageMetadata({
      title: t.notFoundStudio.title,
      description: t.notFoundStudio.description,
      path: `/app/studio/${slug}`,
      noIndex: true,
    })
  }

  const description =
    studio.description ||
    (locale === "en"
      ? `${studio.name} tattoo studio in ${studio.city}. View portfolio and book consultation via WhatsApp.`
      : `Studio tato ${studio.name} di ${studio.city}. Lihat portofolio dan booking konsultasi lewat WhatsApp.`)

  const titleFormat = locale === "en"
    ? `${studio.name} — Tattoo Studio in ${studio.city}`
    : `${studio.name} — Studio Tato ${studio.city}`

  return createPageMetadata({
    title: titleFormat,
    description,
    path: `/app/studio/${slug}`,
    image: studio.image,
    keywords: [
      studio.name,
      studio.city,
      studio.artist,
      ...studio.tags,
      locale === "en" ? "tattoo studio" : "studio tato",
      locale === "en" ? "tattoo booking" : "booking tato",
    ],
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlockComponent = React.ComponentType<{ data: any; waNumber?: string; slug?: string }>

const BLOCK_COMPONENTS: Partial<Record<BlockType, BlockComponent>> = {
  Header: BlockHeader,
  HeaderOverlay: BlockHeaderOverlay,
  Hero: BlockHero,
  HeroSlider: BlockHeroSlider,
  Goals: BlockGoals,
  Gallery: BlockGallery,
  Overview: BlockOverview,
  Features: BlockFeatures,
  ServicesCards: BlockServicesCards,
  HowItWorks: BlockHowItWorks,
  CreatorBio: BlockCreatorBio,
  ArtistsGrid: BlockArtistsGrid,
  StatsCounter: BlockStatsCounter,
  Testimonials: BlockTestimonials,
  LatestNews: BlockLatestNews,
  Newsletter: BlockNewsletter,
  FAQ: BlockFAQ,
  FinalCTA: BlockFinalCTA,
  Footer: BlockFooter,
}

/** Map BlockType ke anchor id supaya nav HeaderOverlay (#home, #about, dst)
 *  bisa scroll-to-section di single-page preset. Block yang tidak ada di map
 *  ini tidak dibungkus div anchor (mis. HeaderOverlay, Footer). */
const BLOCK_ANCHOR_IDS: Partial<Record<BlockType, string>> = {
  HeroSlider: "home",
  Hero: "home",
  Goals: "about",
  Overview: "about",
  Gallery: "gallery",
  ArtistsGrid: "artists",
  ServicesCards: "services",
  Features: "services",
  LatestNews: "news",
  AppointmentForm: "contact",
  FinalCTA: "contact",
}

export default async function StudioRendererPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const t = await getDictionary(locale)

  const suspended = await getSuspendedStudioBySlug(slug)
  if (suspended) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">{suspended.name}</h1>
          <p className="mt-3 text-sm text-white/70">
            {t.suspended.description}
          </p>
        </div>
      </main>
    )
  }

  const studio =
    await getPublishedStudioBySlug(slug)

  if (!studio) {
    notFound()
  }

  const visibleBlocks = getVisibleBlocks(studio)
  const hasAppointmentBlock = visibleBlocks.some((b) => b.type === "AppointmentForm")

  return (
    <main className="studio-template relative min-h-screen bg-black font-body text-white">
      <JsonLd
        data={buildStudioJsonLd({
          name: studio.name,
          slug: studio.slug,
          description: studio.description,
          city: studio.city,
          image: studio.image,
          artist: studio.artist,
        })}
      />
      <StudioTracker slug={slug} />
      {visibleBlocks.map((block) => {
        const anchorId = BLOCK_ANCHOR_IDS[block.type]
        const wrapperProps = anchorId ? { id: anchorId } : {}

        if (block.type === "AppointmentForm") {
          return (
            <div key={block.id} {...wrapperProps}>
              <BlockAppointmentForm
                data={block.data as AppointmentFormData}
                studioSlug={slug}
                studioName={studio.name}
              />
            </div>
          )
        }

        const Component = BLOCK_COMPONENTS[block.type]
        if (!Component) return null

        const usesSlug =
          block.type === "Hero" ||
          block.type === "HeroSlider" ||
          block.type === "FinalCTA"

        return (
          <div key={block.id} {...wrapperProps}>
            <Component
              data={block.data}
              waNumber={studio.waNumber}
              {...(usesSlug ? { slug } : {})}
            />
            {block.type === "Header" && (
              <div className="border-b border-white/10 bg-black">
                <div className="mx-auto flex max-w-6xl items-center justify-center gap-6 px-4 py-2.5 text-[10px] uppercase tracking-[0.32em] text-white/50 md:px-6">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="size-3" />
                    {studio.viewCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")} views
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MousePointerClick className="size-3" />
                    {studio.clickCount.toLocaleString(locale === "en" ? "en-US" : "id-ID")} clicks
                  </span>
                </div>
              </div>
            )}
            {block.type === "FAQ" && !hasAppointmentBlock && (
              <BlockLeadForm studioSlug={slug} studioName={studio.name} />
            )}
          </div>
        )
      })}
      <FloatingWhatsAppButton waNumber={studio.waNumber} />
    </main>
  )
}

