import { H2, P } from "@/components/ui/typography"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockGoals({ data }: { data: any }) {
  return (
    <section id="goals" className="py-24 bg-background">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <H2 className="mb-6 tracking-tight">{data?.headline || "Mengapa Memilih Kami?"}</H2>
        <P className="text-lg md:text-xl mb-16 text-muted-foreground">
          {data?.description || "Bukan sekadar studio tato biasa. Kami menghadirkan pengalaman premium yang mengutamakan keamanan, kenyamanan, dan hasil seni yang presisi."}
        </P>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[1, 2, 3].map((item, i) => (
            <div key={i} className="border border-white/10 p-8 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className="text-4xl font-sans tracking-tighter font-bold text-primary mb-6">0{i+1}</div>
              <h4 className="font-sans text-xl font-semibold mb-3 tracking-tight">{data?.features?.[i]?.title || `Fitur ${i+1}`}</h4>
              <p className="text-muted-foreground text-sm">{data?.features?.[i]?.desc || "Deskripsi singkat mengenai fitur atau keunggulan ini."}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
