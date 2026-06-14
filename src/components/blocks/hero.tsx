"use client"

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

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
  const ctaText = data?.ctaText || "Konsultasi Sekarang"
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=Halo,%20saya%20tertarik%20untuk%20konsultasi%20tattoo`
    : undefined
  const headline =
    data?.headline ||
    "Tato yang menceritakan siapa Anda."
  const subheadline =
    data?.subheadline ||
    "Studio tato profesional dengan standar sterilisasi tinggi dan desain custom yang dikerjakan oleh artist berpengalaman."

  const benefits: string[] = data?.benefits || [
    "Konsultasi konsep 1-on-1",
    "Standar sterilisasi premium",
    "Aftercare guidance lengkap",
  ]

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:gap-16 md:px-6 md:py-28">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground text-pretty md:text-5xl lg:text-6xl">
            {headline}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            {subheadline}
          </p>

          <ul className="mt-7 space-y-2.5">
            {benefits.map((benefit, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 text-sm text-foreground/80"
              >
                <Check className="size-4 shrink-0 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => slug && trackStudioClick(slug)}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {ctaText}
                <ArrowRight className="size-3.5" />
              </a>
            ) : (
              <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                {ctaText}
                <ArrowRight className="size-3.5" />
              </button>
            )}
            <Link
              href="#gallery"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
            >
              Lihat Portofolio
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                data?.image ||
                "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=1200&auto=format&fit=crop"
              }
              alt="Studio Portfolio"
              width={1200}
              height={1500}
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
