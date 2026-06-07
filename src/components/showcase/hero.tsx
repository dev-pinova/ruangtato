"use client"

import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"

import { PremiumSocialBadge } from "@/components/showcase/premium-social-badge"
import { VerifiedCheck } from "@/components/showcase/verified-check"
import { Input } from "@/components/ui/input"
import type { Studio } from "@/lib/types"

const POPULAR_TAGS = ["Fine Line", "Blackwork", "Japanese", "Realism", "Jakarta", "Bali"]

const HERO_BACKGROUND_IMAGE = "/ruang-tato/chatgpt-bg.png"

export function ShowcaseHero({
  searchQuery,
  onSearch,
  featuredStudios = [],
}: {
  searchQuery: string
  onSearch: (query: string) => void
  featuredStudios?: Studio[]
}) {
  return (
    <section
      aria-label="Cari studio tattoo"
      className="relative isolate overflow-hidden border-b border-border"
    >
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_BACKGROUND_IMAGE}
          alt=""
          className="h-full w-full object-cover object-[65%_center] md:object-[70%_center]"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center md:px-6 md:py-28">
        <PremiumSocialBadge />

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Temukan studio tattoo impianmu
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
          Portofolio artist, standar sterilisasi, booking WhatsApp — tanpa ribet.
        </p>

        <div className="relative mx-auto mt-10 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Cari studio tattoo"
            placeholder="Cari studio, kota, gaya tattoo, atau artist..."
            className="h-12 rounded-full border-0 bg-white pl-11 text-sm text-foreground shadow-lg placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white/30"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {featuredStudios.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs text-white/60">Studio populer:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {featuredStudios.map((studio) => (
                <Link
                  key={studio.id}
                  href={`/app/studio/${studio.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs text-white/90 backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/15 hover:text-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={studio.image}
                    alt=""
                    className="size-5 rounded-full object-cover"
                  />
                  <span className="max-w-[120px] truncate">{studio.name}</span>
                  {studio.isVerified && <VerifiedCheck className="size-3.5" />}
                  <ChevronRight className="size-3 text-white/50" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <p className="mb-3 text-xs text-white/60">Gaya populer:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSearch(tag)}
                className="rounded-full border border-white/25 px-2.5 py-1 text-xs text-white/80 transition-colors hover:border-white/40 hover:text-white"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-black/40 px-4 py-3 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
          Dibuat untuk komunitas tattoo Indonesia
        </p>
      </div>
    </section>
  )
}
