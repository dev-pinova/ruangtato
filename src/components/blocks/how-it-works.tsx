import { H2, H3, P } from "@/components/ui/typography"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockHowItWorks({ data }: { data: any }) {
  const steps = data?.steps || [
    { title: "Konsultasi", desc: "Diskusikan ide, ukuran, penempatan, dan estimasi harga via WhatsApp." },
    { title: "DP & Jadwal", desc: "Amankan jadwal Anda dengan membayar Down Payment (DP)." },
    { title: "Desain", desc: "Kami akan menyiapkan desain kustom dan menunjukkannya sebelum hari H." },
    { title: "Sesi Tato", desc: "Datang ke studio, bersantai, dan biarkan kami mengerjakan keajaiban." }
  ]

  return (
    <section id="how-it-works" className="py-24 bg-zinc-950 border-y border-white/5">
      <div className="container mx-auto px-4 max-w-5xl">
        <H2 className="mb-16 tracking-tight text-center">Cara Kerja</H2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {steps.map((step: any, i: number) => (
            <div key={i} className="relative bg-white/5 border border-white/10 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="text-5xl font-sans tracking-tighter text-primary/30 font-bold mb-6">0{i+1}</div>
              <H3 className="text-lg mb-3 tracking-tight">{step.title}</H3>
              <P className="text-muted-foreground text-sm">{step.desc}</P>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
