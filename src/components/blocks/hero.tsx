import { H1, P } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockHero({ data, waNumber }: { data: any; waNumber?: string }) {
  const ctaText = data?.ctaText || "Get started"
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=Halo,%20saya%20tertarik%20untuk%20konsultasi%20tattoo`
    : undefined

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-background py-16 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(217,46,46,0.18),transparent_42%)]" />
      <div className="container mx-auto relative z-10 grid items-center gap-14 px-4 md:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            Official coaching landing page
          </p>
          <H1 className="mb-5 text-4xl leading-[1.08] md:text-6xl">
            {data?.headline || "Belajar Membangun Tattoo Concept yang Siap Dieksekusi"}
          </H1>
          <P className="mb-8 text-base md:text-lg text-white/70">
            {data?.subheadline ||
              "Program konsultasi terstruktur bersama artist profesional untuk mengubah ide Anda menjadi desain tattoo matang, personal, dan aman."}
          </P>

          <ul className="mb-9 space-y-3.5">
            {data?.benefits?.map((benefit: string, i: number) => (
              <li key={i} className="flex items-center gap-3 font-sans text-foreground/85">
                <span className="inline-flex rounded-full bg-primary/20 p-1">
                  <Check className="h-4 w-4 text-primary" />
                </span>
                <span>{benefit}</span>
              </li>
            )) || (
              <>
                <li className="flex items-center gap-3 font-sans text-foreground/85"><span className="inline-flex rounded-full bg-primary/20 p-1"><Check className="h-4 w-4 text-primary" /></span> Konsultasi konsep 1-on-1 sebelum tattoo</li>
                <li className="flex items-center gap-3 font-sans text-foreground/85"><span className="inline-flex rounded-full bg-primary/20 p-1"><Check className="h-4 w-4 text-primary" /></span> Standar sterilisasi tinggi untuk tiap sesi</li>
                <li className="flex items-center gap-3 font-sans text-foreground/85"><span className="inline-flex rounded-full bg-primary/20 p-1"><Check className="h-4 w-4 text-primary" /></span> Review desain dan aftercare guidance lengkap</li>
              </>
            )}
          </ul>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:w-auto"
              >
                {ctaText}
              </a>
            ) : (
              <Button size="lg" className="w-full sm:w-auto px-8">
                {ctaText}
              </Button>
            )}
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/15 bg-white/5 text-white hover:bg-white/10">
              Take the quiz
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=200&auto=format&fit=crop"
              alt="Artist avatar"
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">Created by {data?.creator || "Ruang Tato Team"}</p>
              <p className="text-xs text-white/60">Tattoo mentor & studio consultant</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="mx-auto w-[290px] rounded-[2.5rem] border border-white/20 bg-zinc-900/90 p-2 shadow-2xl">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data?.image || "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop"}
                alt="Studio Portfolio"
                className="h-[540px] w-full object-cover"
              />
            </div>
          </div>

          <div className="absolute -left-4 top-8 max-w-[210px] rounded-2xl border border-white/10 bg-zinc-900/95 p-4 shadow-xl">
            <p className="text-xs font-semibold text-white/80">Your coach</p>
            <p className="mt-2 text-xs leading-relaxed text-white/65">
              Desain Anda sudah bagus. Coba pertajam komposisi fokus utama agar tattoo tetap terbaca dari jarak jauh.
            </p>
          </div>

          <div className="absolute -right-3 bottom-12 max-w-[220px] rounded-2xl border border-white/10 bg-zinc-900/95 p-4 shadow-xl">
            <p className="text-xs font-semibold text-white/80">Today&apos;s session</p>
            <p className="mt-1 text-xs text-white/60">36 min · Build tattoo concept board</p>
            <Button size="sm" className="mt-3 h-8 px-3 text-xs">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
