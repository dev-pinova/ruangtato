import { H2, P } from "@/components/ui/typography"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockOverview({ data }: { data: any }) {
  return (
    <section id="overview" className="py-24 border-y border-white/5 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-zinc-900 rounded-3xl overflow-hidden border border-white/10">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Overview 1" />
              </div>
              <div className="aspect-square bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 translate-y-8">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Overview 2" />
              </div>
            </div>
          </div>
          <div>
            <H2 className="mb-6 tracking-tight">{data?.headline || "Ruang Studio yang Nyaman"}</H2>
            <P className="text-lg mb-6 text-muted-foreground">
              {data?.content1 || "Kami merancang studio ini agar Anda merasa seperti di rumah. Jauh dari kesan intimidatif, kami menyambut setiap klien dengan suasana yang tenang dan profesional."}
            </P>
            <P className="text-lg text-muted-foreground">
              {data?.content2 || "Dilengkapi dengan peralatan sterilisasi kelas medis (autoclave), setiap jarum bersifat single-use dan dibuang setelah dipakai."}
            </P>
          </div>
        </div>
      </div>
    </section>
  )
}
