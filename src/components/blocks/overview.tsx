import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockOverview({ data, locale = "id" }: { data: any; locale?: string }) {
  const headline = getLocalizedText(data, "headline", locale, locale === "en" ? "A comfortable space for every story" : "Ruang yang nyaman untuk setiap cerita")
  const content1 = getLocalizedText(
    data,
    "content1",
    locale,
    locale === "en"
      ? "We designed this studio so you feel right at home. Far from intimidating, we welcome every client with a calm and professional atmosphere."
      : "Kami merancang studio ini agar Anda merasa seperti di rumah. Jauh dari kesan intimidatif, kami menyambut setiap klien dengan suasana yang tenang dan profesional."
  )
  const content2 = getLocalizedText(
    data,
    "content2",
    locale,
    locale === "en"
      ? "Equipped with medical-grade sterilization equipment (autoclave), every needle is single-use and disposed of after use."
      : "Dilengkapi peralatan sterilisasi kelas medis (autoclave), setiap jarum bersifat single-use dan dibuang setelah dipakai."
  )

  return (
    <section id="overview" className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:gap-16 md:px-6 md:py-28">
        <div className="order-2 md:order-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {locale === "en" ? "About Studio" : "Tentang Studio"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {headline}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>{content1}</p>
            <p>{content2}</p>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                data?.image1 ||
                "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1200&auto=format&fit=crop"
              }
              alt="Studio interior"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

