import { H2 } from "@/components/ui/typography"
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
    { q: "Bagaimana cara merawat tato baru?", a: "Kami akan memberikan instruksi lengkap setelah sesi selesai, beserta rekomendasi salep aftercare yang aman untuk kulit." }
  ]

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <H2 className="text-center mb-12 tracking-tight">Tanya Jawab</H2>
        {/* @ts-expect-error Type mismatch in shadcn Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {faqs.map((faq: any, i: number) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-white/5 rounded-2xl px-6 data-[state=open]:border-primary/50 transition-colors">
              <AccordionTrigger className="text-left font-sans text-lg hover:no-underline py-6">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
