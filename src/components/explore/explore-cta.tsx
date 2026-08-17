"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  ArrowRight,
  Sparkles,
  Zap,
  MessageSquare,
  Percent,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"

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
    primaryBtn: isEn ? "List Your Studio Now" : "Daftarkan Studio Sekarang",
    secondaryBtn: isEn ? "View Pricing & Plans" : "Lihat Paket & Harga",
    features: isEn
      ? [
          {
            icon: Zap,
            title: "5-Min Setup",
            desc: "Instant live page, no technical skills needed",
          },
          {
            icon: MessageSquare,
            title: "Direct WhatsApp",
            desc: "Clients chat directly to your studio number",
          },
          {
            icon: Percent,
            title: "0% Commission",
            desc: "Keep 100% of your tattoo booking revenue",
          },
          {
            icon: ShieldCheck,
            title: "Verified Badge",
            desc: "Build trust with hygiene & studio verification",
          },
        ]
      : [
          {
            icon: Zap,
            title: "Setup < 5 Menit",
            desc: "Halaman langsung online tanpa perlu koding",
          },
          {
            icon: MessageSquare,
            title: "WhatsApp Langsung",
            desc: "Calon klien chat langsung ke kontak studio",
          },
          {
            icon: Percent,
            title: "0% Komisi",
            desc: "Semua pendapatan 100% milik studio Anda",
          },
          {
            icon: ShieldCheck,
            title: "Lencana Terverifikasi",
            desc: "Tingkatkan reputasi & kepercayaan klien",
          },
        ],
    trustBadges: isEn
      ? [
          "Instant portfolio showcase",
          "SEO & Google discovery ready",
          "Cancel or upgrade anytime",
        ]
      : [
          "Portofolio HD tanpa batas",
          "Terindeks di Google & SEO",
          "Bebas upgrade kapan saja",
        ],
  }

  return (
    <div className="w-full bg-white">
      <section
        ref={ref}
        className="relative w-full overflow-hidden bg-neutral-950 text-white rounded-t-[36px] sm:rounded-t-[56px] md:rounded-t-[72px] border-t border-white/10"
      >
        {/* Ambient background glow & radial gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-[320px] w-[550px] md:h-[450px] md:w-[800px] rounded-full bg-gradient-to-b from-red-600/20 via-orange-600/10 to-transparent blur-[100px] md:blur-[140px]" />
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
              <div className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wider text-red-400">
                <Sparkles className="size-3.5 text-red-400" />
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
              <span className="bg-gradient-to-r from-red-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
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
                nativeButton={false}
                className="w-full sm:w-auto h-11 px-7 text-sm sm:text-base font-semibold gap-2"
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

          {/* Feature Grid / 4 High-Conversion Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {content.features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="group relative flex flex-col items-start rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition-colors">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-400 leading-snug">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </motion.div>

          {/* Social Proof / Micro Trust Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-neutral-400"
          >
            {content.trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
