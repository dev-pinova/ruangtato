"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

import { useLanguage } from "@/lib/i18n/language-provider"

// Visual cards data - alternating creator portraits and app screenshots
const VISUAL_CARDS = [
  {
    id: 1,
    type: "creator",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
    label: "Creator",
  },
  {
    id: 2,
    type: "app",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop",
    label: "App UI",
  },
  {
    id: 3,
    type: "creator",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&crop=face",
    label: "Creator",
  },
  {
    id: 4,
    type: "app",
    image: "https://images.unsplash.com/photo-1551650975-87deedd9a40c?w=400&h=600&fit=crop",
    label: "App UI",
  },
  {
    id: 5,
    type: "creator",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face",
    label: "Creator",
  },
  {
    id: 6,
    type: "app",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop",
    label: "App UI",
  },
  {
    id: 7,
    type: "creator",
    image: "https://images.unsplash.com/photo-1438761681033-6461ff002741?w=400&h=600&fit=crop&crop=face",
    label: "Creator",
  },
  {
    id: 8,
    type: "app",
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400&h=600&fit=crop",
    label: "App UI",
  },
]

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

const CARD_HOVER_VARIANTS = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
}

export function ExploreCta({ onFindMe }: { onFindMe?: () => void }) {
  const { t, locale } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const headline = locale === "en"
    ? "Whatever your goal, Studio has\nthe perfect app for you"
    : "Apa pun tujuanmu,\nStudio punya yang sempurna untukmu"

  const buttonText = locale === "en"
    ? "Find best app for me"
    : "Temukan app untukku"

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
            <button
              type="button"
              onClick={onFindMe}
              className="group flex items-center gap-2 rounded-full bg-[#1F1F1F] px-5 py-3 text-sm font-semibold text-white transition-all duration-180 hover:bg-[#2A2A2A]"
            >
              <span>{buttonText}</span>
              <ArrowRight className="size-4 transition-transform duration-180 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Visual Strip - Creator/App Cards */}
      <div className="relative z-20 -mb-32 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-center gap-3">
            {VISUAL_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                custom={i}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={CARD_VARIANTS}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredCard(card.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative overflow-hidden transition-shadow duration-300"
                style={{
                  width: "170px",
                  height: "240px",
                  borderRadius: "28px",
                  flexShrink: 0,
                }}
              >
                {/* Card Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.label}
                  className="h-full w-full object-cover"
                />

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
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  )
}
