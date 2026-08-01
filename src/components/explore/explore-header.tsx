"use client"

import { BadgeCheck } from "lucide-react"
import { NumberTicker } from "@/components/ui/number-ticker"
import { useLanguage } from "@/lib/i18n/language-provider"

export function ExploreHeader({
  resultCount,
  verifiedCount,
}: {
  resultCount: number
  verifiedCount?: number
}) {
  const { t, locale } = useLanguage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (t as any).catalog || {}

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
          {c.title || (locale === "en" ? "Tattoo Studio Catalog" : "Katalog Studio Tato")}
        </h2>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500">
          <span>
            <NumberTicker
              value={resultCount}
              className="font-medium text-neutral-900"
            />{" "}
            {c.studiosListed || (locale === "en" ? "studios listed" : "studio terdaftar")}
          </span>
          {typeof verifiedCount === "number" && verifiedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-neutral-600">
              <BadgeCheck className="size-3.5 text-neutral-900" />
              {verifiedCount} {c.verified || (locale === "en" ? "verified" : "terverifikasi")}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
