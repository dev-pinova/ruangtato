"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Store } from "lucide-react"

import { MarketingShell } from "@/components/marketing/marketing-shell"
import { ShowcaseHero } from "@/components/showcase/hero"
import { ShowcaseValueProps } from "@/components/showcase/value-props"
import { SidebarFilter } from "@/components/showcase/sidebar-filter"
import { GridHeader } from "@/components/showcase/grid-header"
import { StudioGrid } from "@/components/showcase/studio-grid"
import { Button } from "@/components/ui/button"
import { getCityCounts } from "@/lib/studio/studio-utils"
import type { Studio } from "@/lib/types"

type SortBy = "views" | "clicks" | "name"

const BASE_POPULAR_TAGS = ["Fine Line", "Blackwork", "Japanese", "Realism", "Jakarta", "Bali"]

function buildPopularTags(studios: Studio[]) {
  const fromStudios = studios.flatMap((studio) => studio.tags)
  const merged = [...BASE_POPULAR_TAGS, ...fromStudios]
  return [...new Set(merged.map((tag) => tag.trim()).filter(Boolean))].slice(0, 15)
}

export function ShowcasePage({
  studios,
  cities,
}: {
  studios: Studio[]
  cities: string[]
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("views")
  const [trustedOnly, setTrustedOnly] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")

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
      <ShowcaseHero
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        featuredStudios={featuredStudios}
        popularTags={popularTags}
      />
      <ShowcaseValueProps />
      <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 md:items-start">
          <aside className="w-full shrink-0 md:w-56 lg:w-64">
            <SidebarFilter
              cities={cities}
              cityCounts={cityCounts}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
          </aside>
          
          <main className="flex-1 min-w-0">
            <GridHeader
              sortBy={sortBy}
              onSortChange={setSortBy}
              trustedOnly={trustedOnly}
              onTrustedToggle={() => setTrustedOnly((prev) => !prev)}
              resultCount={resultCount}
              verifiedCount={verifiedCount}
            />
            <StudioGrid
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
      </section>

      {/* Studio-owner conversion path */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg border border-border bg-background text-foreground">
                  <Store className="size-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  Punya studio tato?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  Tampilkan portofoliomu di RuangTato, bangun halaman studio sendiri, dan terima calon klien langsung lewat WhatsApp — tanpa perantara.
                </p>
              </div>
              <Button
                size="lg"
                nativeButton={false}
                className="shrink-0 gap-2"
                render={<Link href="/register" />}
              >
                Tampilkan Studiomu
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
