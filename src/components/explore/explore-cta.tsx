"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

import { useLanguage } from "@/lib/i18n/language-provider"
import type { Studio } from "@/lib/types"
import { VerifiedCheck } from "@/components/showcase/verified-check"

// Animation variants
const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
}

interface ExploreCtaProps {
  featuredStudios?: Studio[]
  onFindMe?: () => void
}

export function ExploreCta({ featuredStudios = [], onFindMe }: ExploreCtaProps) {
  const { t, locale } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const headline = locale === "en"
    ? "Whatever your goal, Studio has\nthe perfect app for you"
    : "Apa pun tujuanmu,\nStudio punya yang sempurna untukmu"

  const buttonText = locale === "en"
    ? "Find best app for me"
    : "Temukan app untukku"

  // Use real studio data for visual cards
  const visualCards = featuredStudios.length > 0
    ? featuredStudios.slice(0, 8).map((studio, i) => ({
        id: studio.id,
        type: i % 2 === 0 ? "creator" : "studio",
        image: studio.image || studio.artistImage || "",
        label: studio.name,
        href: `/${studio.slug}`,
      }))
    : []

  // Fallback to empty if no studios
  const cardsToShow = visualCards.length > 0 ? visualCards : []

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-black"
      style={{
        borderTopLeftRadius: "88px",
        borderTopRightRadius: "88px",
      }}
    >
      {/* Main CTA Content */}
      <div className="relative z-10 px-4 pb-24 pt-24 md:pt-32 md:pb-32 lg:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60">
              <Sparkles className="size-3 text-yellow-400" />
              <span className="font-medium tracking-wide">Discover</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-xl text-2xl font-bold leading-[1.1] text-white tracking-tight md:text-3xl lg:text-[36px]"
            style={{ whiteSpace: "pre-line" }}
          >
            {headline}
          </motion.h2>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-8 flex justify-center"
          >
            <Link
              href="https://ruangtato.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full bg-[#FF4444] px-6 py-3 text-sm font-semibold text-white transition-all duration-180 hover:bg-[#FF5555] hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              <span>{buttonText}</span>
              <ArrowRight className="size-4 transition-transform duration-180 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Visual Strip - Studio Cards */}
      <div className="relative z-20 -mb-32 px-4">
        <div className="mx-auto max-w-6xl">
          {cardsToShow.length > 0 ? (
            <div className="flex items-end justify-center gap-3">
              {cardsToShow.map((card, i) => (
                <Link
                  key={card.id}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden transition-shadow duration-300"
                  style={{
                    width: "170px",
                    height: "240px",
                    borderRadius: "28px",
                    flexShrink: 0,
                  }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <motion.div
                    custom={i}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={CARD_VARIANTS}
                    whileHover={{ scale: 1.02 }}
                    className="h-full w-full"
                  >
                    {/* Card Image */}
                    {card.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={card.image}
                        alt={card.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-800" />
                    )}

                    {/* Border overlay */}
                    <div
                      className="absolute inset-0 rounded-[28px]"
                      style={{
                        border: "1px solid rgba(255,255,255,0.15)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Label badge */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-center">
                        <span className="text-[10px] font-medium text-white/80">
                          {card.label}
                        </span>
                      </div>
                    </div>

                    {/* Hover glow */}
                    {hoveredCard === card.id && (
                      <div className="absolute inset-0 bg-white/5 rounded-[28px]" />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            /* Fallback: show placeholder cards when no studios */
            <div className="flex items-end justify-center gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="relative overflow-hidden bg-neutral-900"
                  style={{
                    width: "170px",
                    height: "240px",
                    borderRadius: "28px",
                    flexShrink: 0,
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xs text-neutral-600">Coming soon</span>
                  </div>
                  <div
                    className="absolute inset-0 rounded-[28px]"
                    style={{
                      border: "1px solid rgba(255,255,255,0.1)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom fade to transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  )
}
