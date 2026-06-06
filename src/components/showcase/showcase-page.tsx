"use client"

import { useMemo, useState } from "react"

import { MarketingShell } from "@/components/marketing/marketing-shell"
import { ShowcaseHero } from "@/components/showcase/hero"
import { FilterBar } from "@/components/showcase/filter-bar"
import { StudioGrid } from "@/components/showcase/studio-grid"
import type { Studio } from "@/lib/types"

type SortBy = "views" | "clicks" | "name"

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
      <ShowcaseHero searchQuery={searchQuery} onSearch={setSearchQuery} />
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
