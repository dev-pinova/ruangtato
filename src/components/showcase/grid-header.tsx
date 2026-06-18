"use client"

import { ArrowUpDown, BadgeCheck } from "lucide-react"

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

export function GridHeader({
  sortBy,
  onSortChange,
  trustedOnly,
  onTrustedToggle,
  resultCount,
  verifiedCount,
}: {
  sortBy: SortBy
  onSortChange: (sort: SortBy) => void
  trustedOnly: boolean
  onTrustedToggle: () => void
  resultCount: number
  verifiedCount?: number
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
          Katalog Studio Tato
        </h2>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500">
          <span>
            <NumberTicker
              value={resultCount}
              className="font-medium text-neutral-900"
            />{" "}
            studio terdaftar
          </span>
          {typeof verifiedCount === "number" && verifiedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-neutral-600">
              <BadgeCheck className="size-3.5 text-neutral-900" />
              {verifiedCount} terverifikasi
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-row flex-wrap items-center gap-2">
        <Select value={sortBy} onValueChange={(v: string | null) => { if (v) onSortChange(v as SortBy) }}>
          <SelectTrigger className="h-9 min-w-[150px] bg-white border border-neutral-200 text-neutral-800">
            <ArrowUpDown className="size-3.5 text-neutral-400" />
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
            "h-9 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900",
            trustedOnly &&
              "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-900/90 hover:text-white"
          )}
        >
          <BadgeCheck className="size-3.5" />
          Trusted
        </Button>
      </div>
    </div>
  )
}
