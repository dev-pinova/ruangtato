import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockCreatorBio({ data, locale = "id" }: { data: any; locale?: string }) {
  const name = getLocalizedText(data, "name", locale, "Budi Tatoer")
  const role = getLocalizedText(data, "role", locale, locale === "en" ? "Lead Artist & Founder" : "Lead Artist & Founder")
  const bio = getLocalizedText(
    data,
    "bio",
    locale,
    locale === "en"
      ? "Tattooing for me is about translating emotions and memories into a timeless visual piece. With over 8 years of experience, my focus is ensuring every client gets the best artwork."
      : "Seni tato bagi saya adalah tentang menerjemahkan emosi dan memori menjadi sebuah karya visual yang abadi. Dengan pengalaman lebih dari 8 tahun, fokus saya adalah memastikan setiap klien mendapatkan karya terbaik."
  )

  return (
    <section id="creator" className="border-b border-white/10 bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-[280px_1fr] md:gap-14">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                data?.image ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
              }
              alt={name}
              width={800}
              height={800}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/50">
              {role}
            </p>
            <h2 className="mt-4 font-display text-4xl font-light uppercase tracking-[0.16em] text-white">
              {name}
            </h2>
            <blockquote className="mt-6 border-l-2 border-white/40 pl-4 text-base italic leading-relaxed text-white/80 md:text-lg">
              &ldquo;{bio}&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

