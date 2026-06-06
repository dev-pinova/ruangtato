import type { Metadata } from "next"
import Link from "next/link"

import { LegalShell, LegalSection } from "@/components/marketing/legal-shell"
import { SUBSCRIPTION_PLANS } from "@/lib/billing-plans"
import { createPageMetadata } from "@/lib/seo"
import {
  BILLING_EMAIL,
  SITE_DOMAIN,
  SITE_URL,
  SUPPORT_EMAIL,
  studioPublicPath,
} from "@/lib/site"

export const metadata: Metadata = createPageMetadata({
  title: "Kebijakan Langganan",
  description:
    "Kebijakan langganan dan pembayaran Ruang Tato untuk studio tattoo yang menggunakan platform landing page berbayar.",
  path: "/subscription",
})

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

export default function SubscriptionPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Kebijakan Langganan"
      description={`Ketentuan langganan, pembayaran, dan hak akses untuk studio yang menggunakan ${SITE_DOMAIN} sebagai platform landing page.`}
      updatedAt="7 Juni 2026"
    >
      <LegalSection title="1. Pendahuluan">
        <p>
          Ruang Tato (
          <a
            href={SITE_URL}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {SITE_DOMAIN}
          </a>
          ) adalah platform SaaS (Landing Page as a Service) untuk pemilik
          studio tattoo di Indonesia. Melalui langganan berbayar, studio
          mendapatkan akses ke builder drag-and-drop, halaman studio publik,
          penangkapan lead, dan penayangan di direktori showcase platform.
        </p>
        <p>
          Kebijakan ini melengkapi{" "}
          <Link href="/terms" className="font-medium text-foreground underline-offset-4 hover:underline">
            Syarat & Ketentuan
          </Link>{" "}
          dan berlaku khusus untuk aspek langganan, pembayaran, serta masa
          aktif layanan.
        </p>
      </LegalSection>

      <LegalSection title="2. Siapa yang Dapat Berlangganan">
        <p>
          Layanan langganan ditujukan untuk pemilik atau pengelola studio tattoo
          yang berusia minimal 18 tahun dan secara hukum berwenang menjalankan
          usaha. Satu akun studio dapat dikaitkan dengan satu landing page
          utama, dengan opsi manajemen tim internal (owner, admin, member)
          sesuai paket yang dipilih.
        </p>
        <p>
          Pengunjung yang mencari studio melalui direktori tidak perlu
          berlangganan dan tidak memerlukan akun untuk mengakses halaman studio
          publik.
        </p>
      </LegalSection>

      <LegalSection title="3. Paket Langganan">
        <p>
          Kami menyediakan beberapa durasi langganan. Harga berikut berlaku
          per siklus pembayaran dan dapat berubah dengan pemberitahuan
          sebelumnya:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <li key={plan.id}>
              <span className="font-medium text-foreground">{plan.name}</span>{" "}
              ({plan.duration}): {formatIDR(plan.price)} — setara{" "}
              {formatIDR(plan.pricePerMonth)}/bulan
            </li>
          ))}
        </ul>
        <p>
          Studio baru yang terdaftar dapat menerima masa percobaan (trial)
          terbatas untuk menguji builder dan mempublikasikan landing page
          sebelum memilih paket berbayar. Masa trial tidak menggantikan
          langganan berbayar untuk penggunaan jangka panjang.
        </p>
      </LegalSection>

      <LegalSection title="4. Hak Akses Saat Langganan Aktif">
        <p>Selama status langganan aktif, studio berhak atas:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Akses dashboard, builder drag-and-drop, dan pengaturan profil studio.</li>
          <li>Publikasi landing page di URL unik{" "}
            <span className="font-medium text-foreground">{studioPublicPath()}</span>.
          </li>
          <li>Penayangan di direktori showcase platform (jika halaman dipublikasikan).</li>
          <li>Formulir lead dan statistik kunjungan serta klik kontak.</li>
          <li>
            Badge verifikasi (centang biru) pada nama studio di direktori untuk
            langganan berbayar aktif, terpisah dari Trusted Badge yang
            diverifikasi manual oleh tim Ruang Tato.
          </li>
        </ul>
        <p>
          Jika langganan berakhir atau tidak diperpanjang, akses builder dan
          publikasi halaman dapat dinonaktifkan hingga pembayaran diperbarui.
          Data studio dan konten yang sudah diunggah tetap disimpan sesuai
          kebijakan retensi kami.
        </p>
      </LegalSection>

      <LegalSection title="5. Pembayaran">
        <p>
          Seluruh transaksi diproses melalui Midtrans dalam mata uang Rupiah
          (IDR). Metode yang didukung meliputi kartu kredit/debit, transfer
          bank, e-wallet (GoPay, OVO, DANA), dan QRIS, sesuai ketersediaan di
          gerbang pembayaran.
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Langganan dianggap aktif setelah pembayaran berhasil dikonfirmasi.</li>
          <li>
            Bukti transaksi dan riwayat pembayaran dapat diakses melalui
            halaman Billing di dashboard studio.
          </li>
          <li>
            Pajak Pertambahan Nilai (PPN) diterapkan sesuai peraturan
            perundang-undangan yang berlaku di Indonesia.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Perpanjangan & Pengingat">
        <p>
          Langganan <span className="font-medium text-foreground">tidak diperpanjang otomatis</span>.
          Anda perlu memperpanjang secara manual sebelum masa aktif berakhir
          melalui halaman Billing.
        </p>
        <p>
          Kami mengirim pengingat melalui email atau notifikasi di dashboard
          paling lambat 7 hari sebelum tanggal kedaluwarsa. Keterlambatan
          perpanjangan dapat mengakibatkan halaman studio tidak dapat diakses
          publik hingga status aktif dipulihkan.
        </p>
      </LegalSection>

      <LegalSection title="7. Upgrade, Downgrade, & Perubahan Paket">
        <p>
          Upgrade ke paket dengan durasi lebih panjang atau fitur lebih lengkap
          dapat dilakukan kapan saja. Perhitungan biaya mengikuti kebijakan
          prorata yang ditampilkan saat checkout.
        </p>
        <p>
          Downgrade berlaku pada siklus langganan berikutnya setelah masa aktif
          paket saat ini berakhir, kecuali disepakati lain secara tertulis
          dengan tim support kami.
        </p>
      </LegalSection>

      <LegalSection title="8. Pembatalan">
        <p>
          Anda dapat berhenti menggunakan layanan kapan saja. Pembatalan tidak
          menghapus kewajiban pembayaran untuk siklus yang sudah berjalan.
          Setelah masa aktif berakhir, fitur premium dan publikasi halaman akan
          dinonaktifkan sesuai ketentuan di atas.
        </p>
        <p>
          Kami berhak menangguhkan atau menghentikan langganan tanpa
          pengembalian dana apabila studio melanggar Syarat & Ketentuan,
          menyalahgunakan platform, atau terlibat aktivitas penipuan.
        </p>
      </LegalSection>

      <LegalSection title="9. Kebijakan Refund">
        <p>
          Pengembalian dana hanya diberikan jika terdapat gangguan teknis dari
          pihak Ruang Tato yang membuat layanan inti (builder, publikasi, atau
          dashboard) tidak dapat digunakan lebih dari 72 jam berturut-turut.
        </p>
        <p>
          Permohonan refund harus diajukan dalam 7 hari sejak transaksi melalui{" "}
          <a
            href="https://api.whatsapp.com/send/?phone=628133985462&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            WhatsApp resmi kami
          </a>{" "}
          atau email{" "}
          <span className="font-medium text-foreground">{SUPPORT_EMAIL}</span>,
          disertai bukti pembayaran dan penjelasan kendala.
        </p>
        <p>Refund tidak berlaku untuk:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Pembatalan sepihak setelah pembayaran berhasil tanpa alasan teknis yang valid.</li>
          <li>Kelalaian pengguna, termasuk lupa login atau kesalahan unggah konten.</li>
          <li>Masalah pada perangkat, jaringan internet, atau browser pengguna.</li>
          <li>Ketidakcocokan ekspektasi desain atau konversi halaman studio.</li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Perubahan Harga & Kebijakan">
        <p>
          Kami dapat menyesuaikan harga paket atau isi kebijakan ini.
          Perubahan harga untuk pelanggan baru diumumkan paling lambat 30 hari
          sebelum berlaku. Perubahan material pada kebijakan ini akan
          diberitahukan melalui email atau banner di dashboard paling lambat 14
          hari sebelum efektif.
        </p>
        <p>
          Langganan yang sudah dibayar tetap mengikuti ketentuan dan harga pada
          saat transaksi hingga masa aktif berakhir.
        </p>
      </LegalSection>

      <LegalSection title="11. Kontak">
        <p>
          Pertanyaan terkait langganan, invoice, atau pembayaran dapat
          disampaikan melalui:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            WhatsApp:{" "}
            <a
              href="https://api.whatsapp.com/send/?phone=628133985462&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              +62 813-3985-462
            </a>
          </li>
          <li>
            Email:{" "}
            <span className="font-medium text-foreground">{BILLING_EMAIL}</span>
          </li>
          <li>
            Halaman bantuan:{" "}
            <Link href="/help" className="font-medium text-foreground underline-offset-4 hover:underline">
              Pusat Bantuan
            </Link>
          </li>
        </ul>
      </LegalSection>
    </LegalShell>
  )
}
