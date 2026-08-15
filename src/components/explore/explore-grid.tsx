"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BadgeCheck, SlidersHorizontal, Store, ArrowRight, Search } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SITE_NAME } from "@/lib/site"
import { useLanguage } from "@/lib/i18n/language-provider"
import type { Studio } from "@/lib/types"
import { VerifiedCheck } from "@/components/showcase/verified-check"
import { LaurelWreath } from "@/components/showcase/laurel-wreath"

type SortBy = "views" | "clicks" | "name"

export function ExploreGrid({
  studios,
  searchQuery,
  sortBy,
  trustedOnly,
  selectedCity,
  onSearch,
  onSortChange,
  onTrustedToggle,
  onCityChange,
  onResetFilters,
}: {
  studios: Studio[]
  searchQuery: string
  sortBy: SortBy
  trustedOnly: boolean
  selectedCity: string
  onSearch?: (query: string) => void
  onSortChange?: (sort: SortBy) => void
  onTrustedToggle?: () => void
  onCityChange?: (city: string) => void
  onResetFilters?: () => void
}) {
  const { t, locale } = useLanguage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (t as any).catalog || {}

  const query = searchQuery.toLowerCase()

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

  if (sorted.length === 0) {
    const hasActiveFilters = Boolean(query || selectedCity || trustedOnly)

    return (
      <div className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-8 py-16 text-center text-neutral-900">
        {hasActiveFilters ? (
          <>
            <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500">
              <SlidersHorizontal className="size-5" />
            </div>
            <p className="text-base font-medium text-neutral-900">
              {c.noMatchTitle || (locale === "en" ? "No studios match your filter" : "Tidak ada studio yang cocok dengan filtermu")}
            </p>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">
              {c.noMatchDesc || (locale === "en" ? "Try changing the city, clearing verified filters, or changing your search keywords." : "Coba ganti kota, hapus filter terverifikasi, atau ubah kata kunci pencarianmu.")}
            </p>
            {onResetFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                className="mt-6 border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              >
                {c.resetFilter || (locale === "en" ? "Reset filter" : "Reset filter")}
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500">
              <Store className="size-5" />
            </div>
            <p className="text-base font-medium text-neutral-900">
              {c.noStudiosTitle || (locale === "en" ? "No studios listed yet" : "Belum ada studio yang tampil")}
            </p>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">
              {c.noStudiosDesc
                ? c.noStudiosDesc.replace("{siteName}", SITE_NAME)
                : locale === "en"
                ? `Directory is growing. Be the first studio listed on ${SITE_NAME}.`
                : `Direktori sedang bertumbuh. Jadilah studio pertama yang tampil di ${SITE_NAME}.`}
            </p>
            <Button
              size="sm"
              nativeButton={false}
              className="mt-6 gap-2 border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50"
              render={<Link href="/register" />}
            >
              {c.listStudioBtn || (locale === "en" ? "List Your Studio" : "Tampilkan Studiomu")}
              <ArrowRight className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    )
  }

  return (
    <div id="browse" className="scroll-mt-16">
      <div className="grid grid-cols-3 gap-4 md:gap-5 lg:gap-6">
        {sorted.map((studio, index) => {
          return (
            <BlurFade
              key={studio.id}
              inView
              delay={index * 0.04}
              duration={0.35}
              blur="6px"
              direction="up"
            >
              <ExploreCard studio={studio} />
            </BlurFade>
          )
        })}
      </div>
    </div>
  )
}

function ExploreCard({ studio }: { studio: Studio }) {
  const { locale } = useLanguage()
  const avatarSrc = studio.artistImage || studio.image
  const displayTags = [
    ...studio.tags.slice(0, 2),
    ...(studio.city && !studio.tags.includes(studio.city) ? [studio.city] : []),
  ].slice(0, 3)

  return (
    <Link
      href={`/${studio.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-neutral-200 bg-white transition-[box-shadow,transform] duration-300 hover:shadow-lg hover:-translate-y-0.5 text-neutral-900"
    >
      {/* Large Visual Thumbnail - 4:3 portrait */}
      <div className="relative overflow-hidden bg-neutral-100 w-full aspect-[4/3] rounded-[18px]">
        {studio.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={studio.image}
            alt={studio.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}

        {/* Dark gradient overlay toward bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Trusted badge */}
        {studio.isTrusted && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/40 bg-yellow-400/20 px-2 py-0.5 text-[10px] font-medium text-yellow-300 backdrop-blur-sm">
              <BadgeCheck className="size-2.5" />
              Trusted
            </span>
          </div>
        )}

        {/* Marketing headline over image - bottom area */}
        <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-8">
          <div className="flex items-center justify-center gap-1.5">
            <LaurelWreath side="left" className="h-4 w-auto shrink-0 text-white/60" />
            <p className="text-xs font-semibold leading-tight text-white text-center line-clamp-2">
              {studio.name}
            </p>
            <LaurelWreath side="right" className="h-4 w-auto shrink-0 text-white/60" />
          </div>
        </div>
      </div>

      {/* Creator Information Bar */}
      <div className="px-3 py-2.5 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          {avatarSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarSrc}
              alt={studio.artist}
              className="size-7 shrink-0 rounded-full object-cover ring-1 ring-neutral-200"
            />
          )}
          <p className="min-w-0 text-xs text-neutral-600">
            <span className="font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-2">
              {locale === "en" ? "By" : "Oleh"}{" "}
              {studio.artist}
            </span>
            {studio.isVerified && (
              <VerifiedCheck className="ml-0.5 inline size-3 align-[-1px] text-blue-500" />
            )}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="px-3 pb-2.5">
        <p className="text-[13px] leading-relaxed text-neutral-600 line-clamp-3">
          {studio.description}
        </p>
      </div>

      {/* Tags */}
      {displayTags.length > 0 && (
        <div className="px-3 pb-3 flex flex-wrap gap-1.5">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
