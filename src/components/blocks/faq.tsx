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
    <section id="faq" className="border-b border-border bg-background">
      <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-28">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Pertanyaan yang sering diajukan
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Belum menemukan jawabannya? Hubungi kami langsung via WhatsApp.
          </p>
        </div>

        <Accordion className="mt-12">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {faqs.map((faq: any, i: number) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-border last:border-b-0"
            >
              <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
