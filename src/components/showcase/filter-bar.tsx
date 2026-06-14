"use client"

import { ArrowUpDown, BadgeCheck, MapPin } from "lucide-react"

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
      <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Katalog Studio Tattoo
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Semua studio dikurasi dan dicek standarnya. Pakai filter wilayah dan status terverifikasi untuk menemukan yang paling pas buatmu.
            </p>
            <p className="text-sm text-muted-foreground">
              <NumberTicker
                value={resultCount}
                className="font-medium text-foreground"
              />{" "}
              studio terdaftar
            </p>
          </div>

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
      </div>
    </div>
  )
}
