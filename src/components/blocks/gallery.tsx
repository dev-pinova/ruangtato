"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryData } from "@/lib/types"
import { BlurFade } from "@/components/ui/blur-fade"

const DEFAULT_IMAGES: { src: string; alt?: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=900&auto=format&fit=crop",
    alt: "Tato work 1",
  },
  {
    src: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=900&auto=format&fit=crop",
    alt: "Tato work 2",
  },
  {
    src: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=900&auto=format&fit=crop",
    alt: "Tato work 3",
  },
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
    alt: "Tato work 4",
  },
  {
    src: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop",
    alt: "Tato work 5",
  },
  {
    src: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop",
    alt: "Tato work 6",
  },
]

export function BlockGallery({ data }: { data: GalleryData }) {
  const images = data?.images?.length ? data.images : DEFAULT_IMAGES
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Escape key support to close lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null)
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1))
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxIndex, images.length])

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
                <div onClick={() => src && setLightboxIndex(i)} className="h-full w-full relative cursor-pointer">
                  {src ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={src}
                      alt={img.alt || `Gallery image ${i + 1}`}
                      width={900}
                      height={900}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-xs uppercase tracking-widest text-muted-foreground">
                      Tambah URL gambar
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </BlurFade>
            )
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity"
          onClick={() => setLightboxIndex(null)}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            className="absolute right-6 top-6 text-white/60 hover:text-white transition-colors p-2"
            title="Tutup (Esc)"
          >
            <X className="size-8" />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1))
            }}
            className="absolute left-6 text-white/60 hover:text-white transition-colors p-3 bg-zinc-950/40 rounded-full hover:bg-zinc-950/80 border border-white/5"
            title="Sebelumnya"
          >
            <ChevronLeft className="size-8" />
          </button>

          <div className="max-h-[80vh] max-w-[85vw] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt || "Gallery image"}
              className="max-h-[75vh] max-w-[85vw] object-contain rounded border border-white/10"
            />
            {images[lightboxIndex].alt && (
              <p className="mt-4 text-center text-xs uppercase tracking-[0.25em] text-white/80">
                {images[lightboxIndex].alt}
              </p>
            )}
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))
            }}
            className="absolute right-6 text-white/60 hover:text-white transition-colors p-3 bg-zinc-950/40 rounded-full hover:bg-zinc-950/80 border border-white/5"
            title="Berikutnya"
          >
            <ChevronRight className="size-8" />
          </button>
        </div>
      )}
    </section>
  )
}
