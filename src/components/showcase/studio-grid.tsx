"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Store, SlidersHorizontal } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { MagicSpotlight } from "@/components/ui/magic-spotlight"
import { LaurelWreath } from "@/components/showcase/laurel-wreath"
import { VerifiedCheck } from "@/components/showcase/verified-check"
import { Button } from "@/components/ui/button"
import { SITE_NAME } from "@/lib/site"
import type { Studio } from "@/lib/types"

const GRID_PREVIEW_LIMIT = 8 // 4 kolom × 2 baris


type SortBy = "views" | "clicks" | "name"

export function StudioGrid({
  studios,
  searchQuery,
  sortBy,
  trustedOnly,
  selectedCity,
  onResetFilters,
}: {
  studios: Studio[]
  searchQuery: string
  sortBy: SortBy
  trustedOnly: boolean
  selectedCity: string
  onResetFilters?: () => void
}) {
  const [showAll, setShowAll] = useState(false)
  const query = searchQuery.toLowerCase()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset pagination to collapsed view whenever filter/sort inputs change
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
    // Distinguish "filters/search hide everything" from "no studios exist yet".
    const hasActiveFilters = Boolean(query || selectedCity || trustedOnly)

    return (
      <div className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-8 py-16 text-center text-neutral-900">
          {hasActiveFilters ? (
            <>
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500">
                <SlidersHorizontal className="size-5" />
              </div>
              <p className="text-base font-medium text-neutral-900">
                Tidak ada studio yang cocok dengan filtermu
              </p>
              <p className="mt-1 max-w-sm text-sm text-neutral-500">
                Coba ganti kota, hapus filter terverifikasi, atau ubah kata kunci pencarianmu.
              </p>
              {onResetFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetFilters}
                  className="mt-6 border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                >
                  Reset filter
                </Button>
              )}
            </>
          ) : (
            <>
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500">
                <Store className="size-5" />
              </div>
              <p className="text-base font-medium text-neutral-900">
                Belum ada studio yang tampil
              </p>
              <p className="mt-1 max-w-sm text-sm text-neutral-500">
                Direktori sedang bertumbuh. Jadilah studio pertama yang tampil di {SITE_NAME}.
              </p>
              <Button
                size="sm"
                nativeButton={false}
                className="mt-6 gap-2 border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50"
                render={<Link href="/register" />}
              >
                Tampilkan Studiomu
                <ArrowRight className="size-3.5" />
              </Button>
            </>
          )}
        </div>
    )
  }

  return (
    <div id="browse" className="scroll-mt-16">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {visibleStudios.map((studio, index) => {
          return (
            <BlurFade
              key={studio.id}
              inView
              delay={index * 0.07}
              duration={0.45}
              blur="8px"
              direction="up"
            >
              <StudioCard studio={studio} />
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
            className="gap-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          >
            Lihat Semua Studio
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function StudioCard({ studio }: { studio: Studio }) {
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
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow duration-300 hover:shadow-md text-neutral-900"
    >
      <MagicSpotlight size={240} />
      <div className="relative overflow-hidden bg-neutral-100 w-full aspect-[4/3]">
        {studio.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={studio.image}
            alt={studio.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

        {studio.isTrusted && (
          <div className="absolute left-2 top-2 md:left-3 md:top-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-1.5 py-0.5 text-[9px] md:px-2 md:py-1 md:text-[10px] font-medium text-white backdrop-blur-sm">
              <BadgeCheck className="size-2.5 md:size-3" />
              Trusted
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-2 pb-2 pt-8 md:px-4 md:pb-4 md:pt-10 text-center">
          <div className="flex items-center justify-center gap-1.5 md:gap-2">
            <LaurelWreath side="left" className="h-4 md:h-5 w-auto shrink-0 text-white/60" />
            <div className="min-w-0">
              <p className="line-clamp-2 text-xs md:text-sm lg:text-base font-bold leading-tight md:leading-snug tracking-tight text-white">
                {studio.name}
              </p>
              <p className="hidden sm:block mt-1 text-[10px] md:text-[11px] leading-none text-white/55">
                Built with{" "}
                <span className="font-medium text-white/90">{SITE_NAME}</span>
              </p>
            </div>
            <LaurelWreath side="right" className="h-4 md:h-5 w-auto shrink-0 text-white/60" />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-between p-3 md:p-5 w-full flex-1">
        <div className="flex flex-col gap-1.5 md:gap-3">

          <div className="flex items-center gap-1.5 md:gap-2">
            {avatarSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarSrc}
                alt={studio.artist}
                className="size-5 md:size-6 shrink-0 rounded-full object-cover ring-1 ring-neutral-200"
              />
            )}
            <p className="min-w-0 text-xs text-neutral-500">
              By{" "}
              <span className="font-medium text-neutral-800">
                {studio.artist}
              </span>
              {studio.isVerified && (
                <VerifiedCheck className="ml-1 inline size-3 md:size-3.5 align-[-2px]" />
              )}
            </p>
          </div>

          <p className="line-clamp-2 text-xs md:text-sm leading-normal text-neutral-600">
            {studio.description}
          </p>
        </div>

        {displayTags.length > 0 && (
          <div className="mt-3 md:mt-4 flex flex-wrap gap-1">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200 px-1.5 py-0.5 text-[10px] md:text-[11px] font-medium text-neutral-600 bg-neutral-50"
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
