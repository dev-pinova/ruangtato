import { BlurFade } from "@/components/ui/blur-fade"
import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockFeatures({ data, locale = "id" }: { data: any; locale?: string }) {
  const items = data?.items || [
    { title: "Custom Design", desc: "Desain eksklusif dibuat 100% untuk Anda." },
    { title: "Vegan Ink", desc: "Tinta vegan premium yang aman untuk segala jenis kulit." },
    { title: "Private Room", desc: "Sesi privat tanpa gangguan untuk kenyamanan maksimal." },
    { title: "Aftercare Kit", desc: "Panduan dan kit perawatan gratis setelah sesi selesai." },
  ]
  const title = getLocalizedText(data, "title", locale, locale === "en" ? "Services & Expertise" : "Layanan & keahlian")

  return (
    <section id="features" className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {locale === "en"
              ? "Every service is designed for a safe, comfortable, and personal tattoo experience."
              : "Setiap layanan dirancang untuk pengalaman tato yang aman, nyaman, dan personal."}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {items.map((item: any, i: number) => {
            const itemTitle = getLocalizedText(item, "title", locale)
            const itemDesc = getLocalizedText(item, "desc", locale)
            return (
              <BlurFade key={i} inView delay={i * 0.08} className="h-full">
                <div className="h-full rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/30">
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    {itemTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {itemDesc}
                  </p>
                </div>
              </BlurFade>
            )
          })}
        </div>
      </div>
    </section>
  )
}

