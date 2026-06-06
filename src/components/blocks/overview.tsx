// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockOverview({ data }: { data: any }) {
  return (
    <section id="overview" className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:gap-16 md:px-6 md:py-28">
        <div className="order-2 md:order-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Tentang Studio
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {data?.headline || "Ruang yang nyaman untuk setiap cerita"}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              {data?.content1 ||
                "Kami merancang studio ini agar Anda merasa seperti di rumah. Jauh dari kesan intimidatif, kami menyambut setiap klien dengan suasana yang tenang dan profesional."}
            </p>
            <p>
              {data?.content2 ||
                "Dilengkapi peralatan sterilisasi kelas medis (autoclave), setiap jarum bersifat single-use dan dibuang setelah dipakai."}
            </p>
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
