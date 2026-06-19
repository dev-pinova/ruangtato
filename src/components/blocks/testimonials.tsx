"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import type { TestimonialsData } from "@/lib/types"

const DEFAULT_REVIEWS = [
  {
    text: "Pengalaman tato terbaik yang pernah saya punya. Artist sangat profesional dan studionya nyaman.",
    name: "Luis Rent",
    type: "Cover-up",
    avatar: "/image/artist-portrait-c.jpg",
    rating: 5,
  },
  {
    text: "Studio bersih, suasana tenang, dan hasil akhirnya melebihi ekspektasi saya.",
    name: "Christa Falcon",
    type: "First Tato",
    avatar: "/image/artist-portrait-b.jpg",
    rating: 5,
  },
  {
    text: "Konsultasi mendalam, desainnya benar-benar personal — saya akan kembali untuk piece berikutnya.",
    name: "Rich Damon",
    type: "Sleeve",
    avatar: "/image/artist-portrait-a.jpg",
    rating: 5,
  },
]

export function BlockTestimonials({ data }: { data: TestimonialsData }) {
  const reviews = data?.reviews?.length ? data.reviews : DEFAULT_REVIEWS
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [reviews.length, isHovered])

  function handlePrev() {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  function handleNext() {
    setActiveIndex((prev) => (prev + 1) % reviews.length)
  }

  const activeReview = reviews[activeIndex] || reviews[0]

  return (
    <section
      id="testimonials"
      className="border-b border-white/10 bg-black text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
        <div className="text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
            — {data?.eyebrow || "Testimonial"}
          </p>
          <h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">
            {data?.headline || "What Clients Say"}
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative mt-16 flex min-h-[350px] flex-col items-center justify-center">
          {/* Quote Icon Backdrop */}
          <Quote
            className="absolute -top-6 left-1/2 size-24 -translate-x-1/2 text-white/5 opacity-50"
            fill="currentColor"
          />

          <div className="w-full max-w-3xl overflow-hidden relative z-10 px-4 md:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col items-center text-center"
              >
                {/* Stars Rating */}
                <div className="mb-6 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const starRating = activeReview.rating ?? 5
                    return (
                      <Star
                        key={idx}
                        className={`size-5 ${
                          idx < starRating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-white/20"
                        }`}
                      />
                    )
                  })}
                </div>

                {/* Testimonial Quote */}
                <blockquote className="font-display text-lg italic leading-relaxed text-white/90 md:text-2xl">
                  &ldquo;{activeReview.text}&rdquo;
                </blockquote>

                {/* Avatar and Figcaption */}
                <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:gap-4 md:text-left">
                  {activeReview.avatar ? (
                    <img
                      // eslint-disable-next-line @next/next/no-img-element
                      src={activeReview.avatar}
                      alt={activeReview.name}
                      className="size-16 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-zinc-800 font-display text-lg font-bold uppercase text-white/50">
                      {activeReview.name ? activeReview.name[0] : "?"}
                    </div>
                  )}
                  <figcaption className="flex flex-col justify-center">
                    <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-white">
                      {activeReview.name}
                    </p>
                    <p className="mt-1 font-display text-[9px] uppercase tracking-[0.32em] text-white/50">
                      {activeReview.type}
                    </p>
                  </figcaption>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-between px-2 md:-mx-4 md:px-0">
            <button
              onClick={handlePrev}
              className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/60 transition-colors hover:border-white hover:text-white"
              aria-label="Previous review"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={handleNext}
              className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/60 transition-colors hover:border-white hover:text-white"
              aria-label="Next review"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Pagination Indicators (Dots) */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 transition-all duration-300 ${
                idx === activeIndex
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/25 hover:bg-white/50"
              } rounded-full`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
