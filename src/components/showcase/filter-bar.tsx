"use client"

import { ArrowUpDown, BadgeCheck, MapPin } from "lucide-react"

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
  sortBy,
  onSortChange,
  trustedOnly,
  onTrustedToggle,
  selectedCity,
  onCityChange,
  resultCount,
}: {
  cities: string[]
  sortBy: SortBy
  onSortChange: (sort: SortBy) => void
  trustedOnly: boolean
  onTrustedToggle: () => void
  selectedCity: string
  onCityChange: (city: string) => void
  resultCount: number
}) {
  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{resultCount}</span> studio ditemukan
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedCity || "all"} onValueChange={(v: string | null) => onCityChange(v === "all" || !v ? "" : v)}>
            <SelectTrigger className="h-8 min-w-[140px]">
              <MapPin className="size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Semua kota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v: string | null) => { if (v) onSortChange(v as SortBy) }}>
            <SelectTrigger className="h-8 min-w-[140px]">
              <ArrowUpDown className="size-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="views">Paling dilihat</SelectItem>
              <SelectItem value="clicks">Paling diklik</SelectItem>
              <SelectItem value="name">Nama (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={onTrustedToggle}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors",
              trustedOnly
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            <BadgeCheck className="size-3.5" />
            Trusted Only
          </button>
        </div>
      </div>
    </div>
  )
}
