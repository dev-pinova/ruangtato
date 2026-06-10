import type { ArtistsGridData } from "@/lib/types"

const DEFAULT_ARTISTS = [
  {
    name: "Charly Moon",
    role: "Tattooist",
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

export function BlockArtistsGrid({ data }: { data: ArtistsGridData }) {
  const artists = data?.artists?.length ? data.artists : DEFAULT_ARTISTS

  return (
    <section
      id="artists"
      className="border-b border-white/10 bg-black text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
            — Our Team
          </p>
          <h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">
            {data?.headline || "Meet Our Artists"}
          </h2>
          {data?.subheadline && (
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
              {data.subheadline}
            </p>
          )}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:grid-cols-4">
          {artists.map((artist, i) => (
            <div
              key={i}
              className="group flex flex-col bg-black p-6 text-center md:p-8"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                {artist.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <h3 className="mt-6 font-display text-base uppercase tracking-[0.32em] text-white md:text-lg">
                {artist.name}
              </h3>
              <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-white/50">
                {artist.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
