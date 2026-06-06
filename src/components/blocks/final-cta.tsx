"use client"

import { ArrowRight } from "lucide-react"

import { trackStudioClick } from "@/components/studio/studio-tracker"
import type { FinalCTAData } from "@/lib/types"

export function BlockFinalCTA({
  data,
  waNumber,
  slug,
}: {
  data: FinalCTAData
  waNumber?: string
  slug?: string
}) {
  const ctaText = data?.ctaText || "Booking via WhatsApp"
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=Halo,%20saya%20tertarik%20untuk%20konsultasi%20tattoo`
    : undefined

  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6 md:py-28">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
          {data?.headline || "Siap mengukir cerita Anda?"}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {data?.subheadline ||
            "Jadwal konsultasi kami cepat penuh. Booking slot Anda sekarang sebelum kehabisan."}
        </p>

        <div className="mt-8 flex justify-center">
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => slug && trackStudioClick(slug)}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {ctaText}
              <ArrowRight className="size-4" />
            </a>
          ) : (
            <button className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              {ctaText}
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
