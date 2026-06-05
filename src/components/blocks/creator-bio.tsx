import { H2, P } from "@/components/ui/typography"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockCreatorBio({ data }: { data: any }) {
  return (
    <section id="creator" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-12 items-center bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem]">
          <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden bg-zinc-900 border-2 border-primary/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={data?.image || "https://images.unsplash.com/photo-1542382257-80da9fb9f5abc?q=80&w=400&auto=format&fit=crop"} 
              alt="Creator" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <H2 className="mb-2 tracking-tight">{data?.name || "Budi Tattooer"}</H2>
            <p className="text-sm font-semibold mb-6 text-primary tracking-wide">Lead Artist & Founder</p>
            <P className="text-lg italic font-sans text-muted-foreground leading-relaxed">
              &quot;{data?.bio || "Seni tato bagi saya adalah tentang menerjemahkan emosi dan memori menjadi sebuah karya visual yang abadi. Dengan pengalaman lebih dari 8 tahun, fokus saya adalah memastikan setiap klien mendapatkan karya terbaik."}&quot;
            </P>
          </div>
        </div>
      </div>
    </section>
  )
}
