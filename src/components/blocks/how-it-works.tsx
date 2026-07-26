import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockHowItWorks({ data, locale = "id" }: { data: any; locale?: string }) {
  const steps = data?.steps || [
    { title: "Konsultasi", desc: "Diskusikan ide, ukuran, penempatan, dan estimasi harga via WhatsApp." },
    { title: "DP & Jadwal", desc: "Amankan jadwal Anda dengan membayar Down Payment." },
    { title: "Desain", desc: "Kami menyiapkan desain kustom dan menunjukkannya sebelum hari H." },
    { title: "Sesi Tato", desc: "Datang ke studio, bersantai, dan biarkan kami mengerjakan keajaiban." },
  ]

  return (
    <section id="how-it-works" className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {locale === "en" ? "How It Works" : "Cara kerja"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {locale === "en"
              ? "Four simple steps from initial idea to completed tattoo."
              : "Empat langkah sederhana dari ide hingga tato selesai."}
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {steps.map((step: any, i: number) => {
            const stepTitle = getLocalizedText(step, "title", locale)
            const stepDesc = getLocalizedText(step, "desc", locale)
            return (
              <div key={i} className="relative">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-card text-xs font-semibold text-foreground">
                    {i + 1}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                  {stepTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {stepDesc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

