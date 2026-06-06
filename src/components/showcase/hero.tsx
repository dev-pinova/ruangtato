"use client"

import { Search } from "lucide-react"

import { SectionHeading } from "@/components/design"
import { Input } from "@/components/ui/input"

const POPULAR_TAGS = ["Fine Line", "Blackwork", "Japanese", "Realism", "Jakarta", "Bali"]

export function ShowcaseHero({
  searchQuery,
  onSearch,
}: {
  searchQuery: string
  onSearch: (query: string) => void
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6 md:py-28">
        <SectionHeading
          as="h1"
          size="lg"
          align="center"
          tagline="Direktori studio tato terverifikasi"
          title="Temukan studio tato terbaik di Indonesia."
          description="Jelajahi portofolio artist, cek standar sterilisasi, dan booking konsultasi langsung dari studio favorit Anda."
          className="mb-6"
        />

        <div className="relative mt-10">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari studio, artist, kota, atau gaya tato..."
            className="h-11 pl-10 text-sm"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Populer:</span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onSearch(tag)}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
