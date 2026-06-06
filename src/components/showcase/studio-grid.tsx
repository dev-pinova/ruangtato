import Link from "next/link"
import { Eye, MapPin, MousePointerClick, BadgeCheck } from "lucide-react"

import type { Studio } from "@/lib/types"

type SortBy = "views" | "clicks" | "name"

export function StudioGrid({
  studios,
  searchQuery,
  sortBy,
  trustedOnly,
  selectedCity,
}: {
  studios: Studio[]
  searchQuery: string
  sortBy: SortBy
  trustedOnly: boolean
  selectedCity: string
}) {
  const query = searchQuery.toLowerCase()

  const filtered = studios.filter((studio) => {
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
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "views") return b.viewCount - a.viewCount
    if (sortBy === "clicks") return b.clickCount - a.clickCount
    return a.name.localeCompare(b.name)
  })

  if (sorted.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-xl border border-border bg-card px-8 py-16 text-center">
          <p className="text-base font-medium text-foreground">
            Tidak ada studio ditemukan
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba ubah filter atau kata kunci pencarian Anda
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
      </div>
    </section>
  )
}

function StudioCard({ studio }: { studio: Studio }) {
  return (
    <Link
      href={`/app/studio/${studio.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-foreground/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.image}
          alt={studio.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {studio.isTrusted && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm">
              <BadgeCheck className="size-3 text-primary" />
              Trusted
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
              {studio.name}
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              by {studio.artist}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {studio.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {studio.city}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3" />
              {studio.viewCount.toLocaleString("id-ID")}
            </span>
            <span className="inline-flex items-center gap-1">
              <MousePointerClick className="size-3" />
              {studio.clickCount.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
