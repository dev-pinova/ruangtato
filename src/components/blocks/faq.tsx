import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockFAQ({ data }: { data: any }) {
  const faqs = data?.faqs || [
    { q: "Berapa biaya untuk membuat tato?", a: "Biaya bervariasi tergantung ukuran, detail, dan penempatan. Harga minimal di studio kami adalah Rp 500.000. Hubungi kami untuk estimasi lebih akurat." },
    { q: "Apakah alatnya steril dan aman?", a: "Ya, kami sangat ketat mengenai sterilisasi. Semua jarum, tube, dan perlengkapan bersifat sekali pakai (single-use). Kami juga menggunakan autoclave untuk peralatan yang dapat digunakan kembali." },
    { q: "Bolehkah membawa desain sendiri?", a: "Tentu. Anda bisa membawa referensi, lalu kami akan mendesain ulangnya agar sesuai dengan kontur tubuh dan gaya artistik kami untuk hasil yang maksimal." },
    { q: "Bagaimana cara merawat tato baru?", a: "Kami akan memberikan instruksi lengkap setelah sesi selesai, beserta rekomendasi salep aftercare yang aman untuk kulit." },
  ]

  return (
    <section id="faq" className="border-b border-white/10 bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <div className="text-center">
          <h2 className="font-display text-4xl font-light uppercase tracking-[0.16em] text-white md:text-5xl">
            Pertanyaan Umum
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            Belum menemukan jawabannya? Hubungi kami langsung untuk konsultasi gratis.
          </p>
        </div>

        <Accordion className="mt-12 border border-white/10 bg-zinc-950 px-6 rounded-lg">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {faqs.map((faq: any, i: number) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-white/10 last:border-b-0"
            >
              <AccordionTrigger className="py-5 text-left text-sm uppercase tracking-wider font-medium text-white hover:text-white/80 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-xs tracking-wide leading-relaxed text-white/70">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
