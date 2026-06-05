import { H2, H3, P } from "@/components/ui/typography"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockFeatures({ data }: { data: any }) {
  const items = data?.items || [
    { title: "Custom Design", desc: "Desain eksklusif dibuat 100% untuk Anda." },
    { title: "Vegan Ink", desc: "Menggunakan tinta vegan premium yang aman." },
    { title: "Private Room", desc: "Sesi privat tanpa gangguan untuk kenyamanan maksimal." },
    { title: "Aftercare Kit", desc: "Panduan dan kit perawatan gratis setelah tato selesai." }
  ]

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <H2 className="text-center mb-16 tracking-tight text-primary">Layanan & Keahlian</H2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {items.map((item: any, i: number) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-primary/50 transition-colors">
              <H3 className="text-xl mb-3">{item.title}</H3>
              <P className="text-sm text-muted-foreground">{item.desc}</P>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
