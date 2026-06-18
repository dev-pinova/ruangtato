"use client"

import { BadgeCheck } from "lucide-react"
import { NumberTicker } from "@/components/ui/number-ticker"

export function ExploreHeader({
  resultCount,
  verifiedCount,
}: {
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
    </div>
  )
}
