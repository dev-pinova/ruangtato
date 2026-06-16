"use client"

import { ArrowUpDown, BadgeCheck, MapPin, X } from "lucide-react"

import { NumberTicker } from "@/components/ui/number-ticker"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type SortBy = "views" | "clicks" | "name"

export function FilterBar({
  cities,
  cityCounts,
  sortBy,
  onSortChange,
  trustedOnly,
  onTrustedToggle,
  selectedCity,
  onCityChange,
  onClearSearch,
  searchQuery,
  resultCount,
  verifiedCount,
}: {
  cities: string[]
  cityCounts: Record<string, number>
  sortBy: SortBy
  onSortChange: (sort: SortBy) => void
  trustedOnly: boolean
  onTrustedToggle: () => void
  selectedCity: string
  onCityChange: (city: string) => void
  onClearSearch?: () => void
  searchQuery?: string
  resultCount: number
  verifiedCount?: number
}) {
  const totalStudios = Object.values(cityCounts).reduce((sum, n) => sum + n, 0)

  const trimmedQuery = searchQuery?.trim() ?? ""
  const hasActiveFilters = Boolean(selectedCity || trustedOnly || trimmedQuery)

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Katalog Studio Tato
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Semua studio dikurasi dan dicek standarnya. Pakai filter wilayah dan status terverifikasi untuk menemukan yang paling pas buatmu.
            </p>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>
                <NumberTicker
                  value={resultCount}
                  className="font-medium text-foreground"
                />{" "}
                studio terdaftar
              </span>
              {typeof verifiedCount === "number" && verifiedCount > 0 && (
                <span className="inline-flex items-center gap-1 text-foreground/70">
                  <BadgeCheck className="size-3.5 text-primary" />
                  {verifiedCount} terverifikasi
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-row flex-wrap items-center gap-2">
            <Select value={selectedCity || "all"} onValueChange={(v: string | null) => onCityChange(v === "all" || !v ? "" : v)}>
              <SelectTrigger className="h-8 min-w-[150px]">
                <MapPin className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Semua kota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kota ({totalStudios})</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city} ({cityCounts[city] ?? 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v: string | null) => { if (v) onSortChange(v as SortBy) }}>
              <SelectTrigger className="h-8 min-w-[150px]">
                <ArrowUpDown className="size-3.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Paling dilihat</SelectItem>
                <SelectItem value="clicks">Paling diklik</SelectItem>
                <SelectItem value="name">Nama (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={onTrustedToggle}
              className={cn(
                trustedOnly &&
                  "border-primary/40 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
              )}
            >
              <BadgeCheck className="size-3.5" />
              Trusted
            </Button>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter aktif:</span>

            {trimmedQuery && onClearSearch && (
              <FilterChip label={`"${trimmedQuery}"`} onRemove={onClearSearch} />
            )}

            {selectedCity && (
              <FilterChip label={selectedCity} onRemove={() => onCityChange("")} />
            )}

            {trustedOnly && (
              <FilterChip label="Trusted" onRemove={onTrustedToggle} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 py-1 pl-2.5 pr-1 text-xs text-foreground">
      <span className="max-w-[160px] truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Hapus filter ${label}`}
        className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
      >
        <X className="size-3" />
      </button>
    </span>
  )
}
