"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Store, Search, SlidersHorizontal, ChevronDown } from "lucide-react"

import { MarketingShell } from "@/components/marketing/marketing-shell"
import { ExploreHero } from "@/components/explore/explore-hero"
import { ExploreSidebar } from "@/components/explore/explore-sidebar"
import { ExploreHeader } from "@/components/explore/explore-header"
import { ExploreGrid } from "@/components/explore/explore-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCityCounts } from "@/lib/studio/studio-utils"
import { useLanguage } from "@/lib/i18n/language-provider"
import { cn } from "@/lib/utils"
import type { Studio } from "@/lib/types"

type SortBy = "views" | "clicks" | "name"

const BASE_POPULAR_TAGS = ["Fine Line", "Blackwork", "Japanese", "Realism", "Jakarta", "Bali"]

function buildPopularTags(studios: Studio[]) {
  const fromStudios = studios.flatMap((studio) => studio.tags)
  const merged = [...BASE_POPULAR_TAGS, ...fromStudios]
  return [...new Set(merged.map((tag) => tag.trim()).filter(Boolean))].slice(0, 15)
}

export function ExplorePage({
  studios,
  cities,
  hideHero = false,
  hideCta = false,
}: {
  studios: Studio[]
  cities: string[]
  hideHero?: boolean
  hideCta?: boolean
}) {
  const { t, locale } = useLanguage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (t as any).catalog || {}
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(urlQuery)
  const [sortBy, setSortBy] = useState<SortBy>("views")
  const [trustedOnly, setTrustedOnly] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    setSearchQuery(urlQuery)
  }, [urlQuery])

  const featuredStudios = useMemo(
    () =>
      [...studios]
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 12),
    [studios],
  )

  const popularTags = useMemo(() => buildPopularTags(studios), [studios])

  const cityCounts = useMemo(() => getCityCounts(studios), [studios])

  const verifiedCount = useMemo(
    () => studios.filter((s) => s.isVerified || s.isTrusted).length,
    [studios],
  )

  const resultCount = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return studios.filter((studio) => {
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
    }).length
  }, [studios, searchQuery, trustedOnly, selectedCity])

  return (
    <MarketingShell>
      {!hideHero && (
        <ExploreHero
          featuredStudios={featuredStudios}
          popularTags={popularTags}
        />
      )}

      <section className="bg-white text-neutral-900 border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">

          {/* Search Bar — always visible */}
          <div className="mb-6 max-w-md">
            <div className="relative flex items-center bg-white border border-neutral-200 rounded-xl shadow-sm">
              <Search className="pointer-events-none absolute left-3.5 size-4 text-neutral-400" />
              <Input
                aria-label={t.hero.searchPlaceholder}
                placeholder={t.hero.searchPlaceholder}
                className="h-10 w-full rounded-xl border-0 bg-transparent pl-10 pr-8 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile Filter Bar */}
          <div className="md:hidden mb-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* Sort */}
            <div className="shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              >
                <option value="views">{c.sortByViews || "Paling dilihat"}</option>
                <option value="clicks">{c.sortByClicks || "Paling diklik"}</option>
                <option value="name">{c.sortByName || "Nama (A-Z)"}</option>
              </select>
            </div>

            {/* Trusted toggle */}
            <button
              type="button"
              onClick={() => setTrustedOnly((v) => !v)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                trustedOnly
                  ? "border-neutral-300 bg-neutral-100 text-neutral-900 font-medium"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              )}
            >
              <SlidersHorizontal className="size-3.5" />
              {c.trustedOnly || "Trusted"}
            </button>

            {/* City chip (show selected or "All Cities") */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                  selectedCity
                    ? "border-neutral-300 bg-neutral-100 text-neutral-900 font-medium"
                    : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                )}
              >
                {selectedCity || (c.allCities || "Semua Kota")}
                <ChevronDown className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 md:items-start">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-full shrink-0 md:w-56 lg:w-64">
              <ExploreSidebar
                cities={cities}
                cityCounts={cityCounts}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                sortBy={sortBy}
                onSortChange={setSortBy}
                trustedOnly={trustedOnly}
                onTrustedToggle={() => setTrustedOnly((prev) => !prev)}
              />
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
              <ExploreHeader
                resultCount={resultCount}
                verifiedCount={verifiedCount}
              />
              <ExploreGrid
                studios={studios}
                searchQuery={searchQuery}
                sortBy={sortBy}
                trustedOnly={trustedOnly}
                selectedCity={selectedCity}
                onResetFilters={() => {
                  setSearchQuery("")
                  setSelectedCity("")
                  setTrustedOnly(false)
                }}
              />
            </main>
          </div>
        </div>
      </section>

      {/* Mobile City Filter Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 pb-8 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900">Filter Kota</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-neutral-500 hover:text-neutral-900"
              >
                Tutup
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setSelectedCity(""); setMobileFilterOpen(false); }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg text-sm transition-colors",
                  !selectedCity ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                {c.allCities || "Semua Kota"}
              </button>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => { setSelectedCity(city); setMobileFilterOpen(false); }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg text-sm transition-colors",
                    selectedCity === city ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  {city} ({cityCounts[city] || 0})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Studio-owner conversion path */}
      {!hideCta && (
        <section className="border-t border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12">
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg border border-border bg-background text-foreground">
                    <Store className="size-5" />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {t.cta.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {t.cta.subtitle}
                  </p>
                </div>
                <Button
                  size="lg"
                  nativeButton={false}
                  className="shrink-0 gap-2"
                  render={<Link href="/register" />}
                >
                  {t.cta.button}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </MarketingShell>
  )
}
