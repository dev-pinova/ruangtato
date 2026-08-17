"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ArrowRight, ChevronRight } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VerifiedCheck } from "@/components/showcase/verified-check"
import { useLanguage } from "@/lib/i18n/language-provider"
import type { Studio } from "@/lib/types"

export function ExploreHero({
  featuredStudios = [],
  popularTags = [],
  onSearch,
}: {
  featuredStudios?: Studio[]
  popularTags?: string[]
  onSearch?: (q: string) => void
}) {
  const { t, locale } = useLanguage()
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) onSearch?.(searchValue.trim())
  }

  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/image/ruang-tato.jpg"
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover object-[65%_center]"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16 md:px-6 md:py-24 lg:py-28">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-1 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white/90">5.0</span>
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span>{t.hero.badge}</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-2xl text-center text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
          {t.hero.title1}{" "}
          <span className="font-bold">{t.hero.title2}</span>
          <br className="hidden sm:block" />
          {t.hero.title3} {t.hero.title4}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm text-white/60 md:text-base">
          {t.hero.subtitle}
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-7 sm:mt-8 max-w-xl"
        >
          <div className="relative flex items-center rounded-lg bg-white/10 border border-white/20 focus-within:border-white/40 focus-within:bg-white/15 transition-colors">
            <Search className="pointer-events-none absolute left-4 size-4 text-white/50" />
            <Input
              aria-label={t.hero.searchPlaceholder}
              placeholder={t.hero.searchPlaceholder}
              className="h-12 w-full rounded-lg border-0 bg-transparent pl-11 pr-12 text-sm text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1.5 h-9 rounded-lg bg-white text-black hover:bg-white/90"
            >
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </form>

        {/* Popular Studios */}
        {featuredStudios.length > 0 && (
          <div className="mt-7 sm:mt-8">
            <p className="mb-2.5 text-center text-[11px] sm:text-xs font-medium uppercase tracking-wider text-white/50">
              {t.hero.featured}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-4xl mx-auto">
              {featuredStudios.slice(0, 8).map((studio) => (
                <Link
                  key={studio.id}
                  href={`/${studio.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-white/15 bg-white/5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-white/85 transition-colors hover:border-white/35 hover:bg-white/10"
                >
                  {studio.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={studio.image}
                      alt=""
                      className="size-4.5 sm:size-5 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                    />
                  )}
                  <span className="max-w-[110px] sm:max-w-[150px] truncate font-medium text-white/90">
                    {studio.name}
                  </span>
                  {studio.isVerified && (
                    <VerifiedCheck className="size-3.5 shrink-0 text-blue-400" />
                  )}
                  <ChevronRight className="size-3 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white/80 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="mt-5 sm:mt-6">
            <p className="mb-2 text-center text-[11px] sm:text-xs font-medium uppercase tracking-wider text-white/40">
              {t.hero.popularSearch}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl mx-auto">
              {popularTags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSearch?.(tag)}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs text-white/70 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Announcement / Feature Strip */}
      <div className="border-t border-white/10 bg-neutral-950/80 px-4 py-3 sm:py-3.5 text-center">
        <p className="mx-auto max-w-4xl text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
          {t.hero.bottomTagline}
        </p>
      </div>
    </section>
  )
}
