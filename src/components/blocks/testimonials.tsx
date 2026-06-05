import { H2, P } from "@/components/ui/typography"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockTestimonials({ data }: { data: any }) {
  const reviews = data?.reviews || [
    { text: "Hasilnya jauh di luar ekspektasi! Studio sangat bersih dan nyaman.", name: "Andi R.", type: "First Tattoo" },
    { text: "Detail linework yang luar biasa rapi. Prosesnya juga cepat dan tidak terlalu sakit.", name: "Siska M.", type: "Sleeve Project" },
    { text: "Sangat profesional. Dari proses konsultasi desain hingga eksekusi benar-benar mantap.", name: "Reza F.", type: "Cover up" }
  ]

  return (
    <section id="testimonials" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4">
        <H2 className="text-center mb-16 tracking-tight">Komentar Klien</H2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {reviews.map((review: any, i: number) => (
            <div key={i} className="p-8 border border-white/10 bg-white/5 rounded-3xl flex flex-col justify-between hover:border-primary/50 transition-colors">
              <P className="text-lg italic font-sans mb-8 text-muted-foreground">&quot;{review.text}&quot;</P>
              <div>
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-xs text-primary font-medium tracking-wide mt-1">{review.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
