// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockHowItWorks({ data }: { data: any }) {
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
            Cara kerja
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Empat langkah sederhana dari ide hingga tato selesai.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {steps.map((step: any, i: number) => (
            <div key={i} className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-card text-xs font-semibold text-foreground">
                  {i + 1}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
