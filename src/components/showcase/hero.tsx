"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { H1, P } from "@/components/ui/typography"

const POPULAR_STYLES = [
  "Fine Line",
  "Traditional",
  "Blackwork",
  "Realism",
  "Japanese",
  "Micro Tattoo",
]

const POPULAR_CITIES = [
  "Jakarta",
  "Bandung",
  "Bali",
  "Surabaya",
  "Yogyakarta",
  "Medan",
]

export function ShowcaseHero({
  searchQuery,
  onSearch,
}: {
  searchQuery: string
  onSearch: (query: string) => void
}) {
  return (
    <section className="relative min-h-[72vh] overflow-hidden border-b border-white/5">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1523500705334-6ea392b31b4d?q=80&w=1800&auto=format&fit=crop"
          alt="Tattoo showcase hero"
          className="h-full w-full object-cover opacity-35"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(217,46,46,0.35),transparent_45%),linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.88))]" />

      <div className="relative z-10 mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-20 text-center">
        <p className="mb-4 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold tracking-wide text-white/80">
          Join 1M+ pencinta tattoo art di Ruang Tato
        </p>
        <H1 className="max-w-4xl text-4xl md:text-6xl lg:text-7xl">
          Temukan Studio untuk <span className="text-primary">Setiap Gaya</span> Tato Anda
        </H1>
        <P className="mt-4 max-w-3xl text-base md:text-lg text-white/70">
          Direktori studio tato premium Indonesia. Jelajahi portofolio artist, cek standar
          sterilisasi, dan booking konsultasi langsung.
        </P>

        <div className="relative mt-8 w-full max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
          <Input
            placeholder="Cari studio, artist, kota, atau style tattoo..."
            className="h-14 rounded-2xl border-white/20 bg-black/45 pl-11 text-base backdrop-blur-md"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="mt-6 flex w-full max-w-4xl flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-xs font-medium text-white/60">Popular styles:</span>
          {POPULAR_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => onSearch(style)}
              className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
            >
              {style}
            </button>
          ))}
        </div>

        <div className="mt-3 flex w-full max-w-4xl flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-xs font-medium text-white/60">Popular cities:</span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => onSearch(city)}
              className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
