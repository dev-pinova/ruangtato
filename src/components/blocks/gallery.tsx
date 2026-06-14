import type { GalleryData } from "@/lib/types"
import { BlurFade } from "@/components/ui/blur-fade"

const DEFAULT_IMAGES: { src: string; alt?: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=900&auto=format&fit=crop",
    alt: "Tattoo work 1",
  },
  {
    src: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=900&auto=format&fit=crop",
    alt: "Tattoo work 2",
  },
  {
    src: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=900&auto=format&fit=crop",
    alt: "Tattoo work 3",
  },
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
    alt: "Tattoo work 4",
  },
  {
    src: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop",
    alt: "Tattoo work 5",
  },
  {
    src: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop",
    alt: "Tattoo work 6",
  },
]

export function BlockGallery({ data }: { data: GalleryData }) {
  const images = data?.images?.length ? data.images : DEFAULT_IMAGES

  return (
    <section className="border-b border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
            — {data?.eyebrow || "Portfolio"}
          </p>
          <h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">
            {data?.headline || "Our Gallery"}
          </h2>
          {data?.subheadline && (
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
              {data.subheadline}
            </p>
          )}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => {
            const src = img.src?.trim()
            return (
              <BlurFade
                key={i}
                inView
                delay={i * 0.06}
                className="group relative aspect-square overflow-hidden bg-black"
              >
                {src ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={src}
                    alt={img.alt || `Gallery image ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-xs uppercase tracking-widest text-white/30">
                    Tambah URL gambar
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </BlurFade>
            )
          })}
        </div>
      </div>
    </section>
  )
}
