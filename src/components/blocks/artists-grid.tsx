import type { ArtistsGridData } from "@/lib/types"
import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

const DEFAULT_ARTISTS = [
  {
    name: "Charly Moon",
    role: "Tatoist",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Alex Rivera",
    role: "Piercing Artist",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Maya Chen",
    role: "Fine Line Specialist",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Rio Pradana",
    role: "Black & Grey Artist",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop",
  },
]

export function BlockArtistsGrid({
  data,
  locale = "id",
}: {
  data: ArtistsGridData
  locale?: string
}) {
  const artists = data?.artists?.length ? data.artists : DEFAULT_ARTISTS
  const headline = getLocalizedText(data, "headline", locale, locale === "en" ? "Meet Our Artists" : "Artist Kami")
  const subheadline = getLocalizedText(data, "subheadline", locale)

  return (
    <section
      id="artists"
      className="border-b border-white/10 bg-black text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
            — {locale === "en" ? "Our Team" : "Tim Kami"}
          </p>
          <h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
              {subheadline}
            </p>
          )}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:grid-cols-4">
          {artists.map((artist, i) => {
            const name = getLocalizedText(artist, "name", locale)
            const role = getLocalizedText(artist, "role", locale)
            return (
              <div
                key={i}
                className="group flex flex-col bg-black p-6 text-center md:p-8"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                  {artist.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={artist.image}
                      alt={name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="mt-6 font-display text-lg uppercase tracking-[0.2em] text-white">
                  {name}
                </h3>
                {role && (
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/60">
                    {role}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
