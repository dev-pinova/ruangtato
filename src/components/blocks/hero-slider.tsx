"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { HeroSliderData } from "@/lib/types"

import { trackStudioClick } from "@/components/studio/studio-tracker"
import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

const DEFAULT_SLIDES_ID = [
  {
    headline: "Art Studio",
    subheadline: "Unique Tatos",
    ctaText: "Get a Tato",
    image:
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1600&auto=format&fit=crop",
  },
]

const DEFAULT_SLIDES_EN = [
  {
    headline: "Art Studio",
    subheadline: "Unique Tattoos",
    ctaText: "Book Consultation",
    image:
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1600&auto=format&fit=crop",
  },
]

export function BlockHeroSlider({
  data,
  waNumber,
  slug,
  locale = "id",
}: {
  data: HeroSliderData
  waNumber?: string
  slug?: string
  locale?: string
}) {
  const defaultSlides = locale === "en" ? DEFAULT_SLIDES_EN : DEFAULT_SLIDES_ID
  const slides = data?.slides?.length ? data.slides : defaultSlides

  const [active, setActive] = useState(0)
  const rawSlide = slides[active]
  const slide = {
    ...rawSlide,
    headline: getLocalizedText(rawSlide, "headline", locale),
    subheadline: getLocalizedText(rawSlide, "subheadline", locale),
    ctaText: getLocalizedText(rawSlide, "ctaText", locale, locale === "en" ? "Book Consultation" : "Get a Tato"),
  }
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=Halo,%20saya%20tertarik%20untuk%20konsultasi%20tato`
    : undefined

  function prev() {
    setActive((i) => (i === 0 ? slides.length - 1 : i - 1))
  }

  function next() {
    setActive((i) => (i === slides.length - 1 ? 0 : i + 1))
  }

  const pad = (n: number) => String(n + 1).padStart(2, "0")

  return (
    <section className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden bg-black text-white">
      {/* Background image + dark overlay */}
      <div className="absolute inset-0 -z-10">
        {slide.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={slide.image}
            alt=""
            width={1600}
            height={900}
            fetchPriority="high"
            className="h-full w-full object-cover"
            key={active}
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 pb-24 pt-40 text-center md:pb-32 md:pt-44">
        <h1 className="font-display text-5xl font-light uppercase tracking-[0.18em] text-white text-pretty md:text-7xl lg:text-8xl">
          {slide.headline}
        </h1>
        {slide.subheadline && (
          <p className="mt-6 text-xs uppercase tracking-[0.5em] text-white/85 md:text-sm">
            {slide.subheadline}
          </p>
        )}

        <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
          {/* Ghost outline CTA — "Buy Template" style */}
          <a
            href="#appointment"
            className="inline-flex h-12 items-center justify-center border border-white/40 px-8 font-display text-[11px] uppercase tracking-[0.4em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
          >
            [&nbsp; {slide.ctaText || "Buy Template"} &nbsp;]
          </a>
          {/* Text-only CTA */}
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => slug && trackStudioClick(slug)}
              className="font-display text-[11px] uppercase tracking-[0.4em] text-white/90 underline-offset-8 transition-colors hover:text-white hover:underline"
            >
              {getLocalizedText(rawSlide, "secondaryCtaText", locale, locale === "en" ? "Book Now" : "Konsultasi Sekarang")}
            </a>
          ) : (
            <a
              href="#appointment"
              className="font-display text-[11px] uppercase tracking-[0.4em] text-white/90 underline-offset-8 transition-colors hover:text-white hover:underline"
            >
              {getLocalizedText(rawSlide, "secondaryCtaText", locale, locale === "en" ? "Book Now" : "Konsultasi Sekarang")}
            </a>
          )}
        </div>
      </div>

      {/* Side arrows + slide counters */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Slide sebelumnya"
            className="group/arrow absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center gap-3 text-white/70 transition-colors hover:text-white md:left-10"
          >
            <ChevronLeft className="size-5" />
            <span className="font-display text-xs tracking-[0.3em]">
              {pad(active === 0 ? slides.length - 1 : active - 1)}
            </span>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Slide berikutnya"
            className="group/arrow absolute right-4 top-1/2 z-10 flex -translate-y-1/2 items-center gap-3 text-white/70 transition-colors hover:text-white md:right-10"
          >
            <span className="font-display text-xs tracking-[0.3em]">
              {pad(active === slides.length - 1 ? 0 : active + 1)}
            </span>
            <ChevronRight className="size-5" />
          </button>

          {/* Bottom dots */}
          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-px transition-all ${
                  i === active ? "w-10 bg-white" : "w-5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
