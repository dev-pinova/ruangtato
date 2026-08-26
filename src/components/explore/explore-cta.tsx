"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-provider"
import type { Studio } from "@/lib/types"

interface ExploreCtaProps {
  featuredStudios?: Studio[]
  onFindMe?: () => void
}

export function ExploreCta({ featuredStudios, onFindMe }: ExploreCtaProps = {}) {
  const { locale } = useLanguage()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const isEn = locale === "en"

  const content = {
    badge: isEn ? "FOR TATTOO STUDIOS & ARTISTS" : "UNTUK STUDIO & ARTIST TATO",
    titlePrimary: isEn ? "Ready to Attract More" : "Siap Menjangkau Lebih Banyak",
    titleHighlight: isEn ? "Tattoo Clients?" : "Klien Tato?",
    subtitle: isEn
      ? "Join Indonesia's premier tattoo platform. Showcase HD portfolios, earn a verified trust badge, and receive client inquiries directly through WhatsApp with 0% commission."
      : "Tampilkan portofolio terbaik, dapatkan lencana terverifikasi, dan terima booking calon klien langsung lewat WhatsApp tanpa potongan komisi.",
    primaryBtn: isEn ? "Join Studio" : "Daftar Studio",
    secondaryBtn: isEn ? "View Pricing" : "Lihat Paket",
  }

  return (
    <div className="w-full bg-white">
      <section
        ref={ref}
        className="relative w-full overflow-hidden bg-neutral-950 text-white rounded-t-[36px] sm:rounded-t-[56px] md:rounded-t-[72px] border-t border-white/10"
      >
        {/* Ambient background glow & radial gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-[320px] w-[550px] md:h-[450px] md:w-[800px] rounded-full bg-gradient-to-b from-white/10 via-neutral-500/5 to-transparent blur-[100px] md:blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:py-28">
          {/* Header container */}
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="flex justify-center mb-5"
            >
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wider text-white/90">
                <Sparkles className="size-3.5 text-white/80" />
                <span>{content.badge}</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[52px] lg:leading-[1.12]"
            >
              {content.titlePrimary}{" "}
              <span className="bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-sky-400 via-purple-500 to-red-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-rainbow inline-block">
                {content.titleHighlight}
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed font-normal"
            >
              {content.subtitle}
            </motion.p>

            {/* Dual Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5"
            >
              {/* Primary button */}
              <Button
                size="lg"
                variant="default"
                nativeButton={false}
                className="w-full sm:w-auto h-11 px-7 text-sm sm:text-base font-semibold gap-2 transition-colors"
                render={<Link href="/register" />}
              >
                <span>{content.primaryBtn}</span>
                <ArrowRight className="size-4" />
              </Button>

              {/* Secondary button */}
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="w-full sm:w-auto h-11 px-6 text-sm sm:text-base font-medium border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/pricing" />}
              >
                <span>{content.secondaryBtn}</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
