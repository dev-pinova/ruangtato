import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MessageCircle, ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/design"
import { MarketingShell } from "@/components/marketing/marketing-shell"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { staticPageMetadata } from "@/lib/seo"
import { SITE_DOMAIN, SUPPORT_EMAIL, studioPublicPath } from "@/lib/site"
import { getLocale } from "@/lib/i18n/actions"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export const metadata: Metadata = staticPageMetadata("/help")

type Category = {
  id: string
  title: string
  description: string
  items: { q: string; a: string }[]
}

const CATEGORIES_ID: Category[] = [
  {
    id: "getting-started",
    title: "Memulai",
    description: "Langkah pertama saat menggunakan Ruang Tato.",
    items: [
      {
        q: "Bagaimana cara mendaftar dan membuat landing page?",
        a: "Klik tombol 'Daftar Studio' di pojok kanan atas, isi data dasar studio Anda, lalu Anda akan langsung masuk ke builder. Pilih blok yang ingin ditampilkan, isi kontennya, dan klik Publish.",
      },
      {
        q: "Apakah saya butuh skill desain untuk menggunakan builder?",
        a: "Tidak. Builder kami menggunakan blok-blok siap pakai yang sudah didesain. Anda hanya perlu mengisi teks, mengunggah gambar, dan menyusun urutan blok sesuai kebutuhan.",
      },
      {
        q: "Apa saja blok yang tersedia di builder?",
        a: "Saat ini ada 11 blok: Header, Hero, Goals, Overview, Features, How It Works, Creator Bio, Testimonials, FAQ, Final CTA, dan Footer. Semua blok dapat dinyalakan/dimatikan dan diatur urutannya.",
      },
      {
        q: "Berapa lama landing page saya aktif?",
        a: "Selama langganan Anda masih berjalan. Jika langganan habis dan tidak diperpanjang, halaman akan otomatis di-private dan menampilkan pesan 'Studio Tidak Tersedia'.",
      },
    ],
  },
  {
    id: "builder",
    title: "Builder & Konten",
    description: "Tips menggunakan builder dan mengelola konten.",
    items: [
      {
        q: "Bagaimana cara mengubah urutan blok?",
        a: "Buka tab 'Layers' di panel kiri, lalu drag-and-drop blok yang ingin Anda pindahkan. Perubahan langsung terlihat di preview.",
      },
      {
        q: "Apa itu slug URL?",
        a: `Slug adalah bagian akhir URL studio Anda, misalnya 'ink-and-iron' di ${studioPublicPath("ink-and-iron")}. Slug bisa Anda atur dari panel atas builder atau halaman pengaturan studio.`,
      },
      {
        q: "Apakah saya bisa menyembunyikan blok tanpa menghapusnya?",
        a: "Bisa. Toggle saklar visibility di samping nama blok pada panel Layers. Blok yang disembunyikan tidak akan tampil di publik tapi tetap tersimpan datanya.",
      },
      {
        q: "Bisakah saya menggunakan custom domain?",
        a: `Fitur custom domain sedang dalam pengembangan dan akan tersedia di plan Pro dan Enterprise. Untuk saat ini, semua studio menggunakan domain ${SITE_DOMAIN}.`,
      },
    ],
  },
  {
    id: "leads-analytics",
    title: "Lead & Analitik",
    description: "Cara memantau performa dan mengelola lead yang masuk.",
    items: [
      {
        q: "Bagaimana lead dari form sampai ke saya?",
        a: "Setiap pesan yang dikirim pengunjung melalui form di landing page Anda akan langsung muncul di Dashboard, lengkap dengan tanggal dan status (Baru/Dibaca/Dibalas). Notifikasi email opsional dapat diaktifkan di pengaturan.",
      },
      {
        q: "Apa arti angka di Dashboard?",
        a: "Total Views adalah jumlah pengunjung unik landing page Anda. Total Clicks adalah jumlah klik ke tombol WhatsApp atau CTA lainnya. Conversion Rate adalah persentase pengunjung yang akhirnya menghubungi.",
      },
      {
        q: "Apakah data analitik bisa diekspor?",
        a: "Saat ini ekspor data tersedia di plan Pro dan Enterprise dalam format CSV. Plan lain dapat melihat seluruh data di dashboard namun belum dapat mengekspor.",
      },
    ],
  },
  {
    id: "billing",
    title: "Langganan & Pembayaran",
    description: "Semua tentang plan, harga, dan invoice.",
    items: [
      {
        q: "Metode pembayaran apa saja yang diterima?",
        a: "Kami menerima kartu kredit/debit, bank transfer (VA), e-wallet (GoPay, OVO, DANA, ShopeePay), dan QRIS. Semua pembayaran diproses aman melalui Midtrans.",
      },
      {
        q: "Bagaimana cara mendapatkan invoice?",
        a: "Invoice otomatis terkirim ke email Anda setelah pembayaran berhasil. Anda juga bisa mengunduhnya kapan saja dari halaman Billing di dashboard.",
      },
      {
        q: "Apakah ada diskon untuk durasi lebih panjang?",
        a: "Ya. Plan 3 bulan hemat 16%, plan 6 bulan hemat 24%, dan plan 12 bulan hemat hingga 33% dibanding bayar bulanan.",
      },
      {
        q: "Apa yang terjadi jika langganan habis?",
        a: "Halaman studio Anda akan otomatis di-private. Data tetap aman tersimpan. Setelah Anda memperpanjang, halaman langsung kembali aktif tanpa kehilangan data atau pengaturan.",
      },
    ],
  },
  {
    id: "trust-security",
    title: "Trusted Badge & Keamanan",
    description: "Cara mendapatkan badge dan menjaga keamanan akun.",
    items: [
      {
        q: "Bagaimana cara mendapatkan Trusted Badge?",
        a: "Hubungi tim kami via email dengan menyertakan dokumen pendukung (NIB/SIUP, foto studio, dan minimal 3 portofolio). Tim akan melakukan verifikasi dalam 3-5 hari kerja. Badge tersedia untuk plan Growth ke atas.",
      },
      {
        q: "Bagaimana data saya diamankan?",
        a: "Kami menggunakan enkripsi TLS 1.3 untuk semua data dalam transit dan enkripsi at-rest untuk database. Akses internal dibatasi dengan role-based access control (RBAC).",
      },
      {
        q: "Bisakah saya menghapus akun saya?",
        a: "Bisa. Buka halaman Pengaturan &rarr; Bahaya, lalu klik 'Hapus Studio'. Semua data akan dihapus permanen dalam waktu maksimal 30 hari.",
      },
    ],
  },
]

const CATEGORIES_EN: Category[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "First steps to use Ruang Tato.",
    items: [
      {
        q: "How do I register and create a landing page?",
        a: "Click the 'List Your Studio' button in the top right corner, fill in your studio's basic data, and you will enter the builder. Choose the blocks you want to display, fill in the content, and click Publish.",
      },
      {
        q: "Do I need design skills to use the builder?",
        a: "No. Our builder uses pre-designed blocks. You only need to fill in text, upload images, and arrange the block order as needed.",
      },
      {
        q: "What blocks are available in the builder?",
        a: "Currently there are 11 blocks: Header, Hero, Goals, Overview, Features, How It Works, Creator Bio, Testimonials, FAQ, Final CTA, and Footer. All blocks can be toggled on/off and rearranged.",
      },
      {
        q: "How long is my landing page active?",
        a: "As long as your subscription is active. If your subscription expires and is not renewed, your page will automatically be set to private and show a 'Studio Unavailable' message.",
      },
    ],
  },
  {
    id: "builder",
    title: "Builder & Content",
    description: "Tips on using the builder and managing content.",
    items: [
      {
        q: "How do I change the block order?",
        a: "Open the 'Layers' tab on the left panel, then drag-and-drop the blocks you want to move. Changes are immediately reflected in the preview.",
      },
      {
        q: "What is a slug URL?",
        a: `A slug is the final part of your studio URL, e.g., 'ink-and-iron' in ${studioPublicPath("ink-and-iron")}. You can configure it from the top panel of the builder or the studio settings page.`,
      },
      {
        q: "Can I hide a block without deleting it?",
        a: "Yes. Toggle the visibility switch next to the block name in the Layers panel. Hidden blocks won't display in public but their data remains saved.",
      },
      {
        q: "Can I use a custom domain?",
        a: `The custom domain feature is under development and will be available on the Pro and Enterprise plans. For now, all studios use the ${SITE_DOMAIN} domain.`,
      },
    ],
  },
  {
    id: "leads-analytics",
    title: "Leads & Analytics",
    description: "How to monitor performance and manage incoming leads.",
    items: [
      {
        q: "How do leads from the form reach me?",
        a: "Every message sent by visitors via the form on your landing page will immediately appear in your Dashboard, complete with date and status (New/Read/Replied). Optional email notifications can be activated in settings.",
      },
      {
        q: "What do the numbers in the Dashboard mean?",
        a: "Total Views is the number of unique visitors to your landing page. Total Clicks is the number of clicks on the WhatsApp button or other CTAs. Conversion Rate is the percentage of visitors who contacted you.",
      },
      {
        q: "Can analytics data be exported?",
        a: "Currently data export is available on the Pro and Enterprise plans in CSV format. Other plans can view all data in the dashboard but cannot export it.",
      },
    ],
  },
  {
    id: "billing",
    title: "Subscription & Payment",
    description: "All about plans, pricing, and invoices.",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept credit/debit cards, bank transfers (VA), e-wallets (GoPay, OVO, DANA, ShopeePay), and QRIS. All payments are processed securely via Midtrans.",
      },
      {
        q: "How do I get an invoice?",
        a: "Invoices are automatically sent to your email after successful payment. You can also download them anytime from the Billing page in the dashboard.",
      },
      {
        q: "Are there discounts for longer durations?",
        a: "Yes. The 3-month plan saves 16%, the 6-month plan saves 24%, and the 12-month plan saves up to 33% compared to paying monthly.",
      },
      {
        q: "What happens when my subscription expires?",
        a: "Your studio page will automatically be set to private. Your data remains safe. Once you renew, the page will instantly go live again without losing any data or settings.",
      },
    ],
  },
  {
    id: "trust-security",
    title: "Trusted Badge & Security",
    description: "How to obtain a badge and maintain account security.",
    items: [
      {
        q: "How do I get a Trusted Badge?",
        a: "Contact our team via email with supporting documents (NIB/SIUP, studio photos, and at least 3 portfolio works). Our team will verify them in 3-5 business days. Badges are available for the Growth plan and above.",
      },
      {
        q: "How is my data secured?",
        a: "We use TLS 1.3 encryption for all data in transit and at-rest encryption for the database. Internal access is restricted using role-based access control (RBAC).",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Go to Settings &rarr; Danger Zone, then click 'Delete Studio'. All data will be deleted permanently within a maximum of 30 days.",
      },
    ],
  },
]

export default async function HelpPage() {
  const locale = await getLocale()
  const t = await getDictionary(locale)
  const categories = locale === "en" ? CATEGORIES_EN : CATEGORIES_ID

  return (
    <MarketingShell>
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6 md:py-28">
          <SectionHeading
            as="h1"
            size="lg"
            align="center"
            tagline={locale === "en" ? "Help Center" : "Pusat Bantuan"}
            title={locale === "en" ? "How can we help?" : "Apa yang bisa kami bantu?"}
            description={locale === "en" ? "Frequently asked questions about the Ruang Tato platform." : "Pertanyaan yang paling sering diajukan tentang platform Ruang Tato."}
          />
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
          <div className="space-y-14">
            {categories.map((category) => (
              <div key={category.id} id={category.id}>
                <SectionHeading
                  title={category.title}
                  description={category.description}
                />

                <Accordion className="mt-6">
                  {category.items.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`item-${category.id}-${i}`}
                      className="border-b border-border last:border-b-0"
                    >
                      <AccordionTrigger className="py-4 text-left text-sm font-medium hover:no-underline md:text-base">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-24">
          <div className="rounded-xl border border-border bg-card p-6 md:p-10">
            <SectionHeading
              title={locale === "en" ? "Still have questions?" : "Masih ada pertanyaan?"}
              description={locale === "en" ? "Our team is ready to help you. Choose the contact method that suits you best." : "Tim kami siap membantu Anda. Pilih cara hubungi yang paling cocok."}
              size="default"
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="group flex items-center justify-between rounded-md border border-border bg-background p-4 transition-colors hover:border-foreground/30"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-muted/60">
                    <Mail className="size-4 text-foreground" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Support</p>
                    <p className="text-xs text-muted-foreground">{SUPPORT_EMAIL}</p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </a>

              <a
                href="https://wa.me/628000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-md border border-border bg-background p-4 transition-colors hover:border-foreground/30"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-muted/60">
                    <MessageCircle className="size-4 text-foreground" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">{locale === "en" ? "Monday - Friday, 09:00 - 18:00" : "Senin - Jumat, 09:00 - 18:00"}</p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 text-foreground hover:underline"
              >
                {locale === "en" ? "View Pricing" : "Lihat Harga"}
                <ArrowRight className="size-3.5" />
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/register"
                className="inline-flex items-center gap-1 text-foreground hover:underline"
              >
                {locale === "en" ? "List Your Studio" : "Daftar Studio"}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
