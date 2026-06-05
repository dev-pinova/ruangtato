import { H2, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockFinalCTA({ data, waNumber }: { data: any; waNumber?: string }) {
  const ctaText = data?.ctaText || "Booking Sekarang via WA"
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=Halo,%20saya%20tertarik%20untuk%20konsultasi%20tattoo`
    : undefined

  return (
    <section className="py-32 bg-zinc-950 border-y border-white/5 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <H2 className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tighter text-foreground">
          {data?.headline || "Siap Mengukir Cerita?"}
        </H2>
        <P className="text-xl mb-12 text-muted-foreground font-light">
          {data?.subheadline || "Jadwal konsultasi kami cepat penuh. Booking slot Anda sekarang sebelum kehabisan."}
        </P>
        {waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-12 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-white transition-colors w-full sm:w-auto"
          >
            {ctaText}
          </a>
        ) : (
          <Button size="lg" className="rounded-full px-12 py-8 text-lg font-semibold w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
            {ctaText}
          </Button>
        )}
      </div>
    </section>
  )
}
