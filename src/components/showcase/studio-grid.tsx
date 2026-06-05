"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, MapPin, MousePointerClick, ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { H3 } from "@/components/ui/typography"
import { MOCK_STUDIOS, ALL_CITIES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type SortBy = "views" | "clicks" | "name"

export function StudioGrid({
  searchQuery,
  sortBy,
  trustedOnly,
  selectedCity,
  onCityChange,
}: {
  searchQuery: string
  sortBy: SortBy
  trustedOnly: boolean
  selectedCity: string
  onCityChange: (city: string) => void
}) {
  const query = searchQuery.toLowerCase()

  const filtered = MOCK_STUDIOS.filter((studio) => {
    if (!studio.isPublished) return false
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

  const [cityOpen, setCityOpen] = useState(false)

  return (
    <section className="container mx-auto px-4 pb-24">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-5">
          <button
            className="flex w-full items-center justify-between lg:pointer-events-none"
            onClick={() => setCityOpen(!cityOpen)}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              Filter by city
            </p>
            <ChevronDown className={cn(
              "h-4 w-4 text-white/50 transition-transform lg:hidden",
              cityOpen && "rotate-180"
            )} />
          </button>
          <div className={cn(
            "mt-4 flex flex-col gap-1",
            "max-lg:overflow-hidden max-lg:transition-all max-lg:duration-300",
            cityOpen ? "max-lg:max-h-96" : "max-lg:max-h-0 max-lg:mt-0"
          )}>
            <button
              onClick={() => onCityChange("")}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition-colors hover:bg-white/10 hover:text-white",
                !selectedCity ? "bg-white/10 text-white" : "text-white/70"
              )}
            >
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full border",
                  !selectedCity ? "border-primary bg-primary" : "border-white/40"
                )}
              />
              Semua Kota
            </button>
            {ALL_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => onCityChange(city === selectedCity ? "" : city)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition-colors hover:bg-white/10 hover:text-white",
                  selectedCity === city ? "bg-white/10 text-white" : "text-white/70"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-2 w-2 rounded-full border",
                    selectedCity === city ? "border-primary bg-primary" : "border-white/40"
                  )}
                />
                {city}
              </button>
            ))}
          </div>
        </aside>

        <div>
          <h2 className="mb-5 text-3xl font-semibold tracking-tight text-white">
            Studios for you
            {sorted.length !== MOCK_STUDIOS.filter((s) => s.isPublished).length && (
              <span className="ml-2 text-base font-normal text-white/50">
                ({sorted.length} hasil)
              </span>
            )}
          </h2>

          {sorted.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-16 text-center">
              <p className="text-lg font-medium text-white/60">Tidak ada studio ditemukan</p>
              <p className="mt-2 text-sm text-white/40">Coba ubah filter atau kata kunci pencarian Anda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {sorted.map((studio) => (
                <article
                  key={studio.id}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:border-primary/60 hover:bg-white/10"
                >
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={studio.image}
                      alt={studio.name}
                      className="h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                    <Link
                      href={`/app/studio/${studio.slug}`}
                      className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-black transition hover:bg-white/90"
                    >
                      Go to studio
                    </Link>

                    {studio.isTrusted && (
                      <div className="absolute bottom-3 left-3 z-10">
                        <Badge variant="default" className="rounded-full text-[10px]">
                          Trusted studio
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="px-1 pb-2">
                    <H3 className="mb-1 text-xl tracking-tight">{studio.name}</H3>
                    <p className="text-sm font-medium text-white/70">By {studio.artist}</p>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{studio.city}</span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-white/60">{studio.description}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {studio.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-white/60">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {studio.viewCount.toLocaleString("id-ID")}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MousePointerClick className="h-3.5 w-3.5" />
                          {studio.clickCount.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <Link
                        href={`/app/studio/${studio.slug}`}
                        className="inline-flex h-8 items-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
