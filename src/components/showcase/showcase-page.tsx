"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Store } from "lucide-react"

import { MarketingShell } from "@/components/marketing/marketing-shell"
import { ShowcaseHero } from "@/components/showcase/hero"
import { ShowcaseValueProps } from "@/components/showcase/value-props"
import { FilterBar } from "@/components/showcase/filter-bar"
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
      <FilterBar
        cities={cities}
        cityCounts={cityCounts}
        sortBy={sortBy}
        onSortChange={setSortBy}
        trustedOnly={trustedOnly}
        onTrustedToggle={() => setTrustedOnly((prev) => !prev)}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        resultCount={resultCount}
      />
      <StudioGrid
        studios={studios}
        searchQuery={searchQuery}
        sortBy={sortBy}
        trustedOnly={trustedOnly}
        selectedCity={selectedCity}
      />

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
                  Punya studio tattoo?
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
