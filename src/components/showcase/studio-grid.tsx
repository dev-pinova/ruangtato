"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BadgeCheck } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { LaurelWreath } from "@/components/showcase/laurel-wreath"
import { VerifiedCheck } from "@/components/showcase/verified-check"
import { Button } from "@/components/ui/button"
import { BorderBeam } from "@/components/ui/border-beam"
import { SHOWCASE_GRID_SIZE } from "@/lib/studio/showcase-demos"
import { SITE_NAME } from "@/lib/site"
import type { Studio } from "@/lib/types"


const GRID_PREVIEW_LIMIT = SHOWCASE_GRID_SIZE // 3 kolom × 2 baris

type SortBy = "views" | "clicks" | "name"

export function StudioGrid({
  studios,
  searchQuery,
  sortBy,
  trustedOnly,
  selectedCity,
}: {
  studios: Studio[]
  searchQuery: string
  sortBy: SortBy
  trustedOnly: boolean
  selectedCity: string
}) {
  const [showAll, setShowAll] = useState(false)
  const query = searchQuery.toLowerCase()

  useEffect(() => {
    setShowAll(false)
  }, [searchQuery, sortBy, trustedOnly, selectedCity])

  const filtered = studios.filter((studio) => {
    if (trustedOnly && !studio.isTrusted) return false
    if (selectedCity && studio.city !== selectedCity) return false
    if (query) {
      const haystack = [
        studio.name,
        studio.city,
        studio.artist,
        ...studio.tags,
      ]
        .join(" ")
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "views") return b.viewCount - a.viewCount
    if (sortBy === "clicks") return b.clickCount - a.clickCount
    return a.name.localeCompare(b.name)
  })

  const hasMore = sorted.length > GRID_PREVIEW_LIMIT
  const visibleStudios = showAll ? sorted : sorted.slice(0, GRID_PREVIEW_LIMIT)

  if (sorted.length === 0) {
    return (
      <section
        id="browse"
        className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 md:px-6"
      >
        <div className="rounded-xl border border-border bg-card px-8 py-16 text-center">
          <p className="text-base font-medium text-foreground">
            Tidak ada studio ditemukan
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba ubah filter atau kata kunci pencarian Anda
          </p>
        </div>
      </section>
    )
  }

  // Bento layout mapping indices to ensure perfectly aligned grid rows
  const largeIndices = [0, 3, 7, 10, 14, 17, 21, 24, 28, 31, 35, 38]

  return (
    <section
      id="browse"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-10 md:px-6 md:py-14"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-12">
        {visibleStudios.map((studio, index) => {
          const isLarge = largeIndices.includes(index)
          return (
            <BlurFade
              key={studio.id}
              inView
              delay={index * 0.07}
              duration={0.45}
              blur="8px"
              direction="up"
              className={isLarge ? "sm:col-span-2 md:col-span-8" : "sm:col-span-1 md:col-span-4"}
            >
              <StudioCard studio={studio} isLarge={isLarge} />
            </BlurFade>
          )
        })}
      </div>

      {hasMore && !showAll && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowAll(true)}
            className="gap-2"
          >
            Lihat Semua Studio
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </section>
  )
}

function StudioCard({ studio, isLarge }: { studio: Studio; isLarge?: boolean }) {
  const avatarSrc = studio.artistImage || studio.image
  const displayTags = [
    ...studio.tags.slice(0, 3),
    ...(studio.city && !studio.tags.includes(studio.city) ? [studio.city] : []),
  ].slice(0, 4)

  return (
    <Link
      href={`/app/studio/${studio.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-md ${
        isLarge ? "md:flex-row md:min-h-[350px]" : ""
      }`}
    >
      {isLarge && (
        <BorderBeam
          size={350}
          duration={8}
          delay={0}
          colorFrom="var(--brand-scarlet)"
          colorTo="oklch(100% 0 0 / 10%)"
        />
      )}

      <div className={`relative overflow-hidden bg-muted ${
        isLarge ? "w-full md:w-1/2 aspect-square md:aspect-auto" : "w-full aspect-square"
      }`}>
        {studio.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={studio.image}
            alt={studio.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

        {studio.isTrusted && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              <BadgeCheck className="size-3" />
              Trusted
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 pt-10 text-center">
          <div className="flex items-center justify-center gap-2">
            <LaurelWreath side="left" className="h-5 w-auto shrink-0 text-white/60" />
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-white md:text-base">
                {studio.name}
              </p>
              <p className="mt-1 text-[10px] leading-none text-white/55 md:text-[11px]">
                Built with{" "}
                <span className="font-medium text-white/90">{SITE_NAME}</span>
              </p>
            </div>
            <LaurelWreath side="right" className="h-5 w-auto shrink-0 text-white/60" />
          </div>
        </div>
      </div>

      <div className={`flex flex-col justify-between p-6 ${
        isLarge ? "w-full md:w-1/2" : "w-full flex-1"
      }`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            {avatarSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarSrc}
                alt={studio.artist}
                className="size-9 shrink-0 rounded-full object-cover ring-1 ring-border"
              />
            )}
            <p className="min-w-0 text-sm text-foreground">
              By{" "}
              <span className="font-medium underline decoration-foreground/30 underline-offset-2">
                {studio.artist}
              </span>
              {studio.isVerified && (
                <VerifiedCheck className="ml-1 inline size-3.5 align-[-2px]" />
              )}
            </p>
          </div>

          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {studio.description}
          </p>
        </div>

        {displayTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground bg-muted/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
