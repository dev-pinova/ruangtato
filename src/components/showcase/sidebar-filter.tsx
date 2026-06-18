"use client"

import { Circle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function SidebarFilter({
  cities,
  cityCounts,
  selectedCity,
  onCityChange,
}: {
  cities: string[]
  cityCounts: Record<string, number>
  selectedCity: string
  onCityChange: (city: string) => void
}) {
  const totalStudios = Object.values(cityCounts).reduce((sum, n) => sum + n, 0)

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filter By City
        </h3>
        <div className="flex flex-col space-y-2">
          <FilterRadio
            label="Semua Kota"
            count={totalStudios}
            isActive={!selectedCity || selectedCity === "all"}
            onClick={() => onCityChange("")}
          />
          {cities.map((city) => (
            <FilterRadio
              key={city}
              label={city}
              count={cityCounts[city] ?? 0}
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
  count,
  isActive,
  onClick,
}: {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/50",
        isActive ? "text-foreground font-medium" : "text-muted-foreground"
      )}
    >
      <span className="flex items-center gap-3">
        {isActive ? (
          <CheckCircle2 className="size-4 shrink-0 text-primary" />
        ) : (
          <Circle className="size-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/60" />
        )}
        <span className="truncate">{label}</span>
      </span>
      {/* <span className="text-xs text-muted-foreground/60">{count}</span> */}
    </button>
  )
}
