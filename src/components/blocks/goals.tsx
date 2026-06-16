"use client"

import { useState } from "react"
import { Play, X } from "lucide-react"

import type { GoalsData } from "@/lib/types"

const DEFAULT_FEATURES = [
  { title: "Unique Tatos", desc: "Desain custom dibuat khusus untuk Anda." },
  { title: "Piercing & Art", desc: "Piercing aman dan koleksi karya seni studio." },
  { title: "Trusted Studio", desc: "Standar sterilisasi tinggi dan aftercare lengkap." },
]

export function BlockGoals({ data }: { data: GoalsData }) {
  const [open, setOpen] = useState(false)

  const features = data?.features?.length ? data.features : DEFAULT_FEATURES
  const eyebrow = data?.eyebrow ?? "About Us"
  const headline = data?.headline ?? "Tato Like Art"
  const description =
    data?.description ??
    "Setiap tato lahir dari percakapan panjang dengan klien, kemudian kami terjemahkan menjadi karya yang personal, presisi, dan tahan waktu."
  const image =
    data?.image ||
    "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1600&auto=format&fit=crop"
  const videoUrl = data?.videoUrl

  return (
    <section
      id="about"
      className="relative border-y border-white/10 bg-black text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image with play button */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="About Studio"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/35" />
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Putar video"
                className="absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white hover:bg-black/50"
              >
                <Play className="size-7 translate-x-0.5" fill="currentColor" />
              </button>
            </div>
            <div className="pointer-events-none absolute -inset-3 -z-10 border border-white/10" />
          </div>

          {/* Text content */}
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
              — {eyebrow}
            </p>
            <h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.12em] md:text-6xl">
              {headline}
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/70 md:text-base">
              {description}
            </p>

            <ul className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-8">
              {features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-6 border-b border-white/5 pb-5 last:border-b-0"
                >
                  <span className="font-display text-sm tracking-[0.3em] text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg uppercase tracking-[0.2em] text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                      {feature.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Video lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup video"
            className="absolute right-6 top-6 inline-flex size-10 items-center justify-center rounded-full border border-white/30 text-white"
          >
            <X className="size-4" />
          </button>
          <div
            className="relative aspect-video w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {videoUrl ? (
              <iframe
                src={videoUrl}
                title="About video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full border border-white/10"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center border border-white/10 text-center text-sm text-white/60">
                <span className="px-6">
                  Tambahkan URL video (mis. embed YouTube) di field <strong>videoUrl</strong> dari builder.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
