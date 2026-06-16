"use client"

import Link from "next/link"
import { ArrowRight, ChevronRight, Search, Sparkles } from "lucide-react"

import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { Marquee } from "@/components/ui/marquee"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Studio } from "@/lib/types"
import { VerifiedCheck } from "@/components/showcase/verified-check"
import { GradualSpacing } from "@/components/ui/gradual-spacing"
import { BorderBeam } from "@/components/ui/border-beam"
import { RetroGrid } from "@/components/ui/retro-grid"

const POPULAR_TAGS = ["Fine Line", "Blackwork", "Japanese", "Realism", "Jakarta", "Bali"]

const HERO_BACKGROUND_IMAGE = "/ruang-tato/ruang-tato.jpg"

function StudioChip({ studio }: { studio: Studio }) {
  return (
    <Link
      href={`/app/studio/${studio.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group/chip flex min-w-[140px] shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-black/60"
    >
      {studio.image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={studio.image}
          alt=""
          className="size-5 shrink-0 rounded-full object-cover"
        />
      )}
      <span className="max-w-[110px] truncate font-medium">{studio.name}</span>
      {studio.isVerified && <VerifiedCheck className="size-3.5 shrink-0" />}
      <ChevronRight className="ml-auto size-3 shrink-0 text-white/40 transition-transform duration-200 group-hover/chip:translate-x-0.5" />
    </Link>
  )
}

export function ShowcaseHero({
  searchQuery,
  onSearch,
  featuredStudios = [],
  popularTags = POPULAR_TAGS,
}: {
  searchQuery: string
  onSearch: (query: string) => void
  featuredStudios?: Studio[]
  popularTags?: string[]
}) {
  return (
    <section
      aria-label="Cari studio tato"
      className="relative isolate overflow-hidden border-b border-border"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_BACKGROUND_IMAGE}
          alt=""
          className="h-full w-full object-cover object-[65%_center] md:object-[70%_center]"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <RetroGrid className="opacity-20 z-0" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center md:px-6 md:py-28">

        {/* Badge */}
        <div className="flex justify-center">
          <div className="group relative flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-black/40">
            <Sparkles className="size-3.5 text-brand-scarlet" />
            <AnimatedShinyText className="text-xs font-medium text-white/80" shimmerWidth={80}>
              DIREKTORI STUDIO TATO PROFESIONAL
            </AnimatedShinyText>
            <ArrowRight className="size-3 text-white/50" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl md:leading-tight flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <GradualSpacing text="Bandingkan" />
            <AnimatedGradientText className="[--bg-size:200%] font-semibold leading-tight tracking-tight">
              Studio Tato
            </AnimatedGradientText>
          </span>
          <GradualSpacing text="Lihat Portofolio." />
          <GradualSpacing text="Chat Langsung." />
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          Jelajahi portofolio, cek studio yang sudah terverifikasi kebersihannya, lalu chat artist pilihanmu langsung lewat WhatsApp.
        </p>

        {/* Search bar */}
        <div className="relative mx-auto mt-10 max-w-2xl rounded-full p-[1px] overflow-hidden bg-white/5 backdrop-blur-sm shadow-2xl">
          <div className="relative flex items-center bg-black/50 rounded-full">
            <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground" />
            <Input
              aria-label="Cari studio tato"
              placeholder="Cari studio, kota, gaya tato, atau artist..."
              className="h-12 w-full rounded-full border-0 bg-transparent pl-11 text-sm text-white placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <BorderBeam size={160} duration={8} borderWidth={1.5} />
        </div>

        {/* Studio Marquee */}
        {featuredStudios.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs text-white/60">Studio populer:</p>
            <Marquee
              pauseOnHover
              className="-mx-4 [--duration:35s] [--gap:0.5rem]"
            >
              {featuredStudios.map((studio) => (
                <StudioChip key={studio.id} studio={studio} />
              ))}
            </Marquee>
          </div>
        )}

        {/* Popular tags */}
        <div className="mt-5">
          <p className="mb-3 text-xs text-white/60">Gaya populer:</p>
          <div
            className={cn(
              "relative -mx-4 px-4 md:mx-0 md:px-0",
              "[mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]",
            )}
          >
            <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide justify-center flex-wrap">
              {popularTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="inverse"
                  size="xs"
                  className="shrink-0 snap-start rounded-full transition-transform duration-200 hover:scale-105"
                  onClick={() => onSearch(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 px-4 py-3 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
          STANDAR KEAMANAN & ESTETIKA TATO INDONESIA
        </p>
      </div>
    </section>
  )
}
