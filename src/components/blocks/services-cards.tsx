import { ArrowUpRight } from "lucide-react"

import type { ServicesCardsData } from "@/lib/types"
import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

const DEFAULT_CARDS = [
  {
    title: "Specific Style Tatos",
    desc: "Custom, blackwork, fine line, Japanese, dan realism.",
    ctaText: "Read More",
    ctaHref: "#tato",
    image:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Piercing",
    desc: "Piercing profesional dengan peralatan steril.",
    ctaText: "Read More",
    ctaHref: "#piercing",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Art & Merch",
    desc: "Koleksi karya seni dan merchandise studio.",
    ctaText: "Read More",
    ctaHref: "#art",
    image:
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop",
  },
]

export function BlockServicesCards({
  data,
  locale = "id",
}: {
  data: ServicesCardsData
  locale?: string
}) {
  const cards = data?.cards?.length ? data.cards : DEFAULT_CARDS
  const eyebrow = getLocalizedText(data, "eyebrow", locale, locale === "en" ? "What We Do" : "Layanan Kami")
  const headline = getLocalizedText(data, "headline", locale, locale === "en" ? "Our Services" : "Layanan Kami")

  return (
    <section
      id="services"
      className="border-b border-white/10 bg-black text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
            — {eyebrow}
          </p>
          <h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">
            {headline}
          </h2>
        </div>

        <div className="mt-16 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {cards.map((card, i) => {
            const ctaHref = card.ctaHref || "#"
            const ctaText = getLocalizedText(card, "ctaText", locale, locale === "en" ? "Read More" : "Selengkapnya")
            const title = getLocalizedText(card, "title", locale)
            const desc = getLocalizedText(card, "desc", locale)
            return (
              <article
                key={i}
                className="group flex flex-col bg-black"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {card.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={card.image}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute left-6 top-6 font-display text-xs tracking-[0.3em] text-white/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-8 md:p-10">
                  <h3 className="font-display text-2xl uppercase tracking-[0.2em] text-white md:text-3xl">
                    {title}
                  </h3>
                  {desc && (
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-white/60">
                      {desc}
                    </p>
                  )}
                  <a
                    href={ctaHref}
                    className="mt-8 inline-flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.4em] text-white transition-colors hover:text-white/70"
                  >
                    {ctaText}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
