import { ArrowUpRight } from "lucide-react"

import type { LatestNewsData } from "@/lib/types"

const DEFAULT_ARTICLES = [
  {
    title: "How To Care Your New Tattoo",
    category: "Aftercare",
    date: "12 Jun 2025",
    image:
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Choosing The Right Tattoo Style",
    category: "Style",
    date: "04 Jun 2025",
    image:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Behind The Ink: Studio Tour",
    category: "Studio",
    date: "21 Mei 2025",
    image:
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Fine Line Tattoo: Less Is More",
    category: "Style",
    date: "10 Mei 2025",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Pain Guide: Where Does It Hurt?",
    category: "Tips",
    date: "01 Mei 2025",
    image:
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop",
    href: "#",
  },
]

export function BlockLatestNews({ data }: { data: LatestNewsData }) {
  const articles = data?.articles?.length ? data.articles : DEFAULT_ARTICLES

  return (
    <section
      id="news"
      className="border-b border-white/10 bg-black text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
              — {data?.eyebrow || "Blog & News"}
            </p>
            <h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">
              {data?.headline || "Latest News"}
            </h2>
          </div>
          {data?.ctaText && (
            <a
              href={data.ctaHref || "#"}
              className="inline-flex items-center gap-2 self-start font-display text-[11px] uppercase tracking-[0.4em] text-white transition-colors hover:text-white/70 md:self-end"
            >
              {data.ctaText}
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>

        <div className="mt-14 -mx-6 overflow-x-auto md:mx-0">
          <div className="flex min-w-max gap-px border border-white/10 bg-white/10 px-6 md:min-w-0 md:grid md:grid-cols-3 md:px-0 lg:grid-cols-5">
            {articles.map((article, i) => (
              <a
                key={i}
                href={article.href || "#"}
                className="group flex w-72 shrink-0 flex-col bg-black md:w-auto"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  {article.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  {article.category && (
                    <span className="absolute left-5 top-5 border border-white/40 bg-black/30 px-3 py-1 font-display text-[9px] uppercase tracking-[0.32em] text-white backdrop-blur-sm">
                      {article.category}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {article.date && (
                    <p className="font-display text-[10px] uppercase tracking-[0.4em] text-white/50">
                      {article.date}
                    </p>
                  )}
                  <h3 className="mt-3 font-display text-base uppercase tracking-[0.16em] text-white transition-colors group-hover:text-white/70 md:text-lg">
                    {article.title}
                  </h3>
                  <span className="mt-6 inline-flex items-center gap-2 self-start border-b border-white/30 pb-1 font-display text-[10px] uppercase tracking-[0.4em] text-white/70 transition-colors group-hover:border-white group-hover:text-white">
                    Read More
                    <ArrowUpRight className="size-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
