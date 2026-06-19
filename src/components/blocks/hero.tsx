"use client"

import { trackStudioClick } from "@/components/studio/studio-tracker"
import type { HeroData } from "@/lib/types"

export function BlockHero({
  data,
  waNumber,
  slug,
}: {
  data: HeroData
  waNumber?: string
  slug?: string
}) {
  const headline = data?.headline || "Tato yang menceritakan siapa Anda."
  const subheadline = data?.subheadline || "Studio tato profesional dengan standar sterilisasi tinggi dan desain custom."
  const ctaText = data?.ctaText || "Konsultasi Sekarang"
  const image = data?.image || "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=1200&auto=format&fit=crop"

  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=Halo,%20saya%20tertarik%20untuk%20konsultasi%20tato`
    : undefined

  return (
    <section className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden bg-black text-white">
      {/* Background image + dark overlay */}
      <div className="absolute inset-0 -z-10">
        {image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt=""
            width={1600}
            height={900}
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 pb-24 pt-40 text-center md:pb-32 md:pt-44">
        <h1 className="font-display text-5xl font-light uppercase tracking-[0.18em] text-white text-pretty md:text-7xl lg:text-8xl">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-6 text-xs uppercase tracking-[0.5em] text-white/85 md:text-sm">
            {subheadline}
          </p>
        )}

        <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
          {/* Ghost outline CTA — "Buy Template" style */}
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => slug && trackStudioClick(slug)}
              className="inline-flex h-12 items-center justify-center border border-white/40 px-8 font-display text-[11px] uppercase tracking-[0.4em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              [&nbsp; {ctaText} &nbsp;]
            </a>
          ) : (
            <a
              href="#appointment"
              className="inline-flex h-12 items-center justify-center border border-white/40 px-8 font-display text-[11px] uppercase tracking-[0.4em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              [&nbsp; {ctaText} &nbsp;]
            </a>
          )}
          
          <a
            href="#gallery"
            className="font-display text-[11px] uppercase tracking-[0.4em] text-white/90 underline underline-offset-8 transition-colors hover:text-white hover:underline"
          >
            Lihat Portofolio
          </a>
        </div>
      </div>
    </section>
  )
}
