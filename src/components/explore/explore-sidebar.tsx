"use client"

import { Circle, CheckCircle2, BadgeCheck, ArrowUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/language-provider"

export function ExploreSidebar({
  searchQuery,
  onSearchChange,
  cities,
  cityCounts,
  selectedCity,
  onCityChange,
  sortBy,
  onSortChange,
  trustedOnly,
  onTrustedToggle,
}: {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  cities: string[]
  cityCounts: Record<string, number>
  selectedCity: string
  onCityChange: (city: string) => void
  sortBy: "views" | "clicks" | "name"
  onSortChange: (sort: "views" | "clicks" | "name") => void
  trustedOnly: boolean
  onTrustedToggle: () => void
}) {
  const { t, locale } = useLanguage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (t as any).catalog || {}

  return (
    <div className="flex flex-col space-y-6">
      {/* Search Input for Desktop Sidebar */}
      {typeof onSearchChange === "function" && (
        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {c.searchLabel || (locale === "en" ? "Search" : "Cari")}
          </h3>
          <div className="relative flex items-center bg-white border border-neutral-200 rounded-lg shadow-xs focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-400 transition-all">
            <Search className="pointer-events-none absolute left-3 size-3.5 text-neutral-400" />
            <Input
              aria-label={t.hero.searchPlaceholder}
              placeholder={c.searchSidebarPlaceholder || (locale === "en" ? "Search studio..." : "Cari studio...")}
              className="h-9 w-full rounded-lg border-0 bg-transparent pl-8.5 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              value={searchQuery || ""}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Urutkan / Sort section */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {c.sortLabel || (locale === "en" ? "Sort By" : "Urutkan")}
        </h3>
        <Select value={sortBy} onValueChange={(v: string | null) => { if (v) onSortChange(v as "views" | "clicks" | "name") }}>
          <SelectTrigger className="h-9 w-full bg-white border border-neutral-200 text-neutral-800 rounded-lg">
            <ArrowUpDown className="size-3.5 text-neutral-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="views">{c.sortByViews || (locale === "en" ? "Most viewed" : "Paling dilihat")}</SelectItem>
            <SelectItem value="clicks">{c.sortByClicks || (locale === "en" ? "Most clicked" : "Paling diklik")}</SelectItem>
            <SelectItem value="name">{c.sortByName || (locale === "en" ? "Name (A-Z)" : "Nama (A-Z)")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter / Trusted section */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {c.statusLabel || "Status"}
        </h3>
        <button
          type="button"
          onClick={onTrustedToggle}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors border",
            trustedOnly
              ? "text-neutral-900 font-semibold bg-neutral-100 border-neutral-200"
              : "text-neutral-500 border-transparent hover:bg-neutral-100/50 hover:text-neutral-900"
          )}
        >
          <BadgeCheck className={cn("size-4 shrink-0", trustedOnly ? "text-neutral-900" : "text-neutral-300")} />
          <span>{c.trustedOnly || (locale === "en" ? "Trusted Only" : "Hanya Trusted")}</span>
        </button>
      </div>

      {/* Filter by City section */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {c.filterCity || (locale === "en" ? "Filter By City" : "Filter Berdasarkan Kota")}
        </h3>
        <div className="flex flex-col space-y-1">
          <FilterRadio
            label={c.allCities || (locale === "en" ? "All Cities" : "Semua Kota")}
            isActive={!selectedCity || selectedCity === "all"}
            onClick={() => onCityChange("")}
          />
          {cities.map((city) => (
            <FilterRadio
              key={city}
              label={city}
              isActive={selectedCity === city}
              onClick={() => onCityChange(city)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FilterRadio({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors",
        isActive
          ? "text-neutral-900 font-semibold bg-neutral-100"
          : "text-neutral-500 hover:bg-neutral-100/50 hover:text-neutral-900"
      )}
    >
      <span className="flex items-center gap-3">
        {isActive ? (
          <CheckCircle2 className="size-4 shrink-0 text-neutral-900" />
        ) : (
          <Circle className="size-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-400" />
        )}
        <span className="truncate">{label}</span>
      </span>
    </button>
  )
}
