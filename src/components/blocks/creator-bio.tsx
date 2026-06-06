// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockCreatorBio({ data }: { data: any }) {
  return (
    <section id="creator" className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-[280px_1fr] md:gap-14">
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                data?.image ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
              }
              alt={data?.name || "Creator"}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {data?.role || "Lead Artist & Founder"}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {data?.name || "Budi Tattooer"}
            </h2>
            <blockquote className="mt-6 border-l-2 border-primary pl-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {data?.bio ||
                "Seni tato bagi saya adalah tentang menerjemahkan emosi dan memori menjadi sebuah karya visual yang abadi. Dengan pengalaman lebih dari 8 tahun, fokus saya adalah memastikan setiap klien mendapatkan karya terbaik."}
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
