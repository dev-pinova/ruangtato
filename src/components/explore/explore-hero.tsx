"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Studio } from "@/lib/types"
import { VerifiedCheck } from "@/components/showcase/verified-check"
import { Marquee } from "@/components/ui/marquee"
import { useLanguage } from "@/lib/i18n/language-provider"

const HERO_BACKGROUND_IMAGE = "/image/ruang-tato.jpg"

function StudioChip({ studio }: { studio: Studio }) {
  return (
    <Link
      href={`/${studio.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group/chip flex min-w-[140px] shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-black/60"
    >
      {studio.image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={studio.image}
          alt=""
          className="size-5 shrink-0 rounded-full object-cover"
        />
      )}
      <span className="max-w-[110px] truncate font-medium">{studio.name}</span>
      {studio.isVerified && <VerifiedCheck className="size-3.5 shrink-0" />}
      <ArrowRight className="ml-auto size-3 shrink-0 text-white/40 transition-transform duration-200 group-hover/chip:translate-x-0.5" />
    </Link>
  )
}

export function ExploreHero({
  featuredStudios = [],
  popularTags = [],
}: {
  featuredStudios?: Studio[]
  popularTags?: string[]
}) {
  const { t, locale } = useLanguage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (t as any).catalog || {}

  return (
    <section
      aria-label="Cari studio tato"
      className="relative isolate overflow-hidden border-b border-border"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_BACKGROUND_IMAGE}
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-[65%_center] md:object-[70%_center]"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 text-center md:px-6 md:py-20">

        {/* Badge */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-xs text-white/80 backdrop-blur-sm">
            <Sparkles className="size-3 text-brand-scarlet" />
            <span className="font-medium tracking-wide">{t.hero.badge}</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-white md:text-4xl md:leading-tight">
          {t.hero.title1}{" "}
          <span className="font-bold">{t.hero.title2}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
          {t.hero.subtitle}
        </p>

        {/* Studio Marquee */}
        {featuredStudios.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between px-1 mb-3">
              <p className="text-xs text-white/60">{t.hero.featured}</p>
              <Link
                href="#browse"
                className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
              >
                {c.viewAllStudios || (locale === "en" ? "View All Studios" : "Lihat Semua Studio")}
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <Marquee
              pauseOnHover
              className="-mx-4 [--duration:25s] [--gap:0.5rem]"
            >
              {featuredStudios.map((studio) => (
                <StudioChip key={studio.id} studio={studio} />
              ))}
            </Marquee>
          </div>
        )}

        {/* Popular tags */}
        {popularTags.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs text-white/60">{t.hero.popularSearch}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom tagline */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 px-4 py-2.5 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
          {t.hero.bottomTagline}
        </p>
      </div>
    </section>
  )
}
