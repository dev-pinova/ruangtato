import { Quote } from "lucide-react"

import type { TestimonialsData } from "@/lib/types"

const DEFAULT_REVIEWS = [
  {
    text: "Pengalaman tato terbaik yang pernah saya punya. Artist sangat profesional dan studionya nyaman.",
    name: "Luis Rent",
    type: "Cover-up",
  },
  {
    text: "Studio bersih, suasana tenang, dan hasil akhirnya melebihi ekspektasi saya.",
    name: "Christa Falcon",
    type: "First Tato",
  },
  {
    text: "Konsultasi mendalam, desainnya benar-benar personal — saya akan kembali untuk piece berikutnya.",
    name: "Rich Damon",
    type: "Sleeve",
  },
]

export function BlockTestimonials({ data }: { data: TestimonialsData }) {
  const reviews = data?.reviews?.length ? data.reviews : DEFAULT_REVIEWS

  return (
    <section
      id="testimonials"
      className="border-b border-white/10 bg-black text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
            — {data?.eyebrow || "Testimonial"}
          </p>
          <h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">
            {data?.headline || "What Clients Say"}
          </h2>
        </div>

        <div className="mt-16 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {reviews.map((review, i) => (
            <figure
              key={i}
              className="relative flex flex-col bg-black p-10 md:p-12"
            >
              <Quote
                className="absolute -top-2 left-8 size-16 text-white/10 md:left-10 md:size-20"
                fill="currentColor"
              />
              <blockquote className="relative flex-1 font-display text-base italic leading-relaxed text-white/90 md:text-lg">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <figcaption className="mt-10 border-t border-white/10 pt-6">
                <p className="font-display text-sm uppercase tracking-[0.3em] text-white">
                  {review.name}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-white/50">
                  {review.type}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
