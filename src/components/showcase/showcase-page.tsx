"use client"

import { useMemo, useState } from "react"

import { MarketingShell } from "@/components/marketing/marketing-shell"
import { ShowcaseHero } from "@/components/showcase/hero"
import { FilterBar } from "@/components/showcase/filter-bar"
import { StudioGrid } from "@/components/showcase/studio-grid"
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
      <FilterBar
        cities={cities}
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
    </MarketingShell>
  )
}
