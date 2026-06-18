import type { Metadata } from "next"
import Link from "next/link"

import { LegalShell, LegalSection } from "@/components/marketing/legal-shell"
import { SUBSCRIPTION_PLANS } from "@/lib/billing/billing-plans"
import { staticPageMetadata } from "@/lib/seo"
import {
  BILLING_EMAIL,
  SITE_DOMAIN,
  SITE_URL,
  SUPPORT_EMAIL,
  studioPublicPath,
} from "@/lib/site"
import { getLocale } from "@/lib/i18n/actions"

export const metadata: Metadata = staticPageMetadata("/subscription")

function formatPrice(amount: number, locale: string) {
  if (locale === "en") {
    return `IDR ${amount.toLocaleString("en-US")}`
  }
  return `Rp ${amount.toLocaleString("id-ID")}`
}

export default async function SubscriptionPage() {
  const locale = await getLocale()
  const isEn = locale === "en"

  return (
    <LegalShell
      eyebrow="Legal"
      title={isEn ? "Subscription Policy" : "Kebijakan Langganan"}
      description={
        isEn
          ? `Subscription terms, payments, and access rights for studios using ${SITE_DOMAIN} as a landing page platform.`
          : `Ketentuan langganan, pembayaran, dan hak akses untuk studio yang menggunakan ${SITE_DOMAIN} sebagai platform landing page.`
      }
      updatedAt={isEn ? "June 7, 2026" : "7 Juni 2026"}
    >
      {isEn ? (
        <>
          <LegalSection title="1. Introduction">
            <p>
              Ruang Tato (
              <a
                href={SITE_URL}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {SITE_DOMAIN}
              </a>
              ) is a SaaS (Landing Page as a Service) platform for tattoo studio
              owners in Indonesia. Through paid subscriptions, studios get access
              to the drag-and-drop builder, a public studio page, lead capture,
              and a listing in the platform's showcase directory.
            </p>
            <p>
              This policy supplements the{" "}
              <Link href="/terms" className="font-medium text-foreground underline-offset-4 hover:underline">
                Terms & Conditions
              </Link>{" "}
              and applies specifically to subscription, payment, and active
              service duration aspects.
            </p>
          </LegalSection>

          <LegalSection title="2. Who Can Subscribe">
            <p>
              Subscription services are intended for tattoo studio owners or
              managers who are at least 18 years old and legally authorized to
              run a business. A studio account can be linked to one main landing
              page, with options for internal team management (owner, admin,
              member) depending on the selected package.
            </p>
            <p>
              Visitors looking for studios through the directory do not need to
              subscribe and do not require an account to access public studio pages.
            </p>
          </LegalSection>

          <LegalSection title="3. Subscription Packages">
            <p>
              We provide several subscription durations. The following prices
              apply per payment cycle and are subject to change with prior notice:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <li key={plan.id}>
                  <span className="font-medium text-foreground">{plan.name}</span>{" "}
                  ({plan.duration}): {formatPrice(plan.price, locale)} — equivalent to{" "}
                  {formatPrice(plan.pricePerMonth, locale)}/month
                </li>
              ))}
            </ul>
            <p>
              Newly registered studios may receive a limited trial period to
              test the builder and publish the landing page before choosing a
              paid package. The trial period does not replace paid subscriptions
              for long-term use.
            </p>
          </LegalSection>

          <LegalSection title="4. Access Rights During Active Subscription">
            <p>While the subscription status is active, the studio is entitled to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Access to the dashboard, drag-and-drop builder, and studio profile settings.</li>
              <li>
                Publication of the landing page at a unique URL:{" "}
                <span className="font-medium text-foreground">{studioPublicPath()}</span>.
              </li>
              <li>Listing in the platform's showcase directory (if the page is published).</li>
              <li>Lead forms and stats on visits and contact clicks.</li>
              <li>
                Verification badges (blue check) on the studio name in the directory for
                active paid subscriptions, separate from the Trusted Badge verified
                manually by the Ruang Tato team.
              </li>
            </ul>
            <p>
              If the subscription expires or is not renewed, builder access and
              page publication may be disabled until payment is updated. Studio
              data and uploaded content will be retained in accordance with our
              retention policy.
            </p>
          </LegalSection>

          <LegalSection title="5. Payments">
            <p>
              All transactions are processed through Midtrans in Indonesian Rupiah
              (IDR). Supported methods include credit/debit cards, bank transfers,
              e-wallets (GoPay, OVO, DANA), and QRIS, subject to availability in
              the payment gateway.
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Subscriptions are considered active once payment is successfully confirmed.</li>
              <li>
                Transaction receipts and payment history can be accessed through
                the Billing page in the studio dashboard.
              </li>
              <li>
                Value Added Tax (VAT) is applied in accordance with applicable
                laws and regulations in Indonesia.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="6. Renewals & Reminders">
            <p>
              Subscriptions <span className="font-medium text-foreground">do not auto-renew</span>.
              You must renew manually before the active period ends via the Billing page.
            </p>
            <p>
              We send reminders via email or dashboard notifications at least 7
              days before the expiration date. Delayed renewals may result in the
              studio page becoming inaccessible to the public until the active
              status is restored.
            </p>
          </LegalSection>

          <LegalSection title="7. Upgrades, Downgrades, & Plan Changes">
            <p>
              Upgrades to a plan with a longer duration or more features can be
              done at any time. Cost calculations follow the prorated policy
              displayed during checkout.
            </p>
            <p>
              Downgrades take effect in the next subscription cycle after the
              current active package expires, unless otherwise agreed in writing
              with our support team.
            </p>
          </LegalSection>

          <LegalSection title="8. Cancellation">
            <p>
              You can stop using the service at any time. Cancellation does not
              remove the payment obligation for the current cycle. Once the
              active period ends, premium features and page publication will be
              disabled in accordance with the terms above.
            </p>
            <p>
              We reserve the right to suspend or terminate subscriptions without
              refund if the studio violates the Terms & Conditions, abuses the
              platform, or is involved in fraudulent activities.
            </p>
          </LegalSection>

          <LegalSection title="9. Refund Policy">
            <p>
              Refunds are only given if there is a technical disruption from Ruang
              Tato that makes the core services (builder, publication, or
              dashboard) unusable for more than 72 consecutive hours.
            </p>
            <p>
              Refund requests must be submitted within 7 days of the transaction through{" "}
              <a
                href="https://api.whatsapp.com/send/?phone=628133985462&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                our official WhatsApp
              </a>{" "}
              or email{" "}
              <span className="font-medium text-foreground">{SUPPORT_EMAIL}</span>,
              along with payment proof and a description of the issue.
            </p>
            <p>Refunds do not apply to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Unilateral cancellations after successful payment without a valid technical reason.</li>
              <li>User negligence, including forgotten logins or incorrect content uploads.</li>
              <li>Issues with the user's device, internet network, or browser.</li>
              <li>Mismatch of design expectations or studio page conversion rates.</li>
            </ul>
          </LegalSection>

          <LegalSection title="10. Price & Policy Changes">
            <p>
              We may adjust package prices or the contents of this policy. Price
              changes for new subscribers will be announced at least 30 days
              before taking effect. Material changes to this policy will be
              notified via email or a dashboard banner at least 14 days prior to
              effectiveness.
            </p>
            <p>
              Paid subscriptions will adhere to the terms and prices at the time of
              the transaction until the active period expires.
            </p>
          </LegalSection>

          <LegalSection title="11. Contact">
            <p>
              Questions regarding subscriptions, invoices, or payments can be
              submitted via:
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
                Help Page:{" "}
                <Link href="/help" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Help Center
                </Link>
              </li>
            </ul>
          </LegalSection>
        </>
      ) : (
        <>
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
              studio tato di Indonesia. Melalui langganan berbayar, studio
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
              Layanan langganan ditujukan untuk pemilik atau pengelola studio tato
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
                  ({plan.duration}): {formatPrice(plan.price, locale)} — setara{" "}
                  {formatPrice(plan.pricePerMonth, locale)}/bulan
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
        </>
      )}
    </LegalShell>
  )
}
