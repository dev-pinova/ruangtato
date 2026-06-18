"use client"

import { Circle, CheckCircle2, BadgeCheck, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

export function ExploreSidebar({
  cities,
  cityCounts,
  selectedCity,
  onCityChange,
  sortBy,
  onSortChange,
  trustedOnly,
  onTrustedToggle,
}: {
  cities: string[]
  cityCounts: Record<string, number>
  selectedCity: string
  onCityChange: (city: string) => void
  sortBy: "views" | "clicks" | "name"
  onSortChange: (sort: "views" | "clicks" | "name") => void
  trustedOnly: boolean
  onTrustedToggle: () => void
}) {
  return (
    <div className="flex flex-col space-y-6">
      {/* Urutkan / Sort section */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Urutkan
        </h3>
        <Select value={sortBy} onValueChange={(v: string | null) => { if (v) onSortChange(v as "views" | "clicks" | "name") }}>
          <SelectTrigger className="h-9 w-full bg-white border border-neutral-200 text-neutral-800 rounded-lg">
            <ArrowUpDown className="size-3.5 text-neutral-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="views">Paling dilihat</SelectItem>
            <SelectItem value="clicks">Paling diklik</SelectItem>
            <SelectItem value="name">Nama (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter / Trusted section */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Status
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
          <span>Hanya Trusted</span>
        </button>
      </div>

      {/* Filter by City section */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Filter By City
        </h3>
        <div className="flex flex-col space-y-1">
          <FilterRadio
            label="Semua Kota"
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
