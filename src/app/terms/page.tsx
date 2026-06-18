import type { Metadata } from "next"

import { LegalShell, LegalSection } from "@/components/marketing/legal-shell"
import { staticPageMetadata } from "@/lib/seo"
import { LEGAL_EMAIL, SITE_DOMAIN, SITE_URL, SUPPORT_EMAIL } from "@/lib/site"
import { getLocale } from "@/lib/i18n/actions"

export const metadata: Metadata = staticPageMetadata("/terms")

export default async function TermsPage() {
  const locale = await getLocale()
  const isEn = locale === "en"

  return (
    <LegalShell
      eyebrow="Legal"
      title={isEn ? "Terms & Conditions" : "Syarat & Ketentuan"}
      description={
        isEn
          ? "Rules and guidelines when using the Ruang Tato platform as a studio or a visitor."
          : "Aturan main saat menggunakan platform Ruang Tato sebagai studio maupun pengunjung."
      }
      updatedAt={isEn ? "June 1, 2026" : "1 Juni 2026"}
    >
      {isEn ? (
        <>
          <LegalSection title="1. Acceptance of Terms">
            <p>
              By registering, accessing, or using Ruang Tato services at{" "}
              <a
                href={SITE_URL}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {SITE_DOMAIN}
              </a>
              , you agree to be bound by these Terms & Conditions, as well as the
              Privacy Policy which is an inseparable part of this document. If you do
              not agree to any of these points, please do not use our services.
            </p>
          </LegalSection>

          <LegalSection title="2. Definitions">
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Platform:</span> all
                Ruang Tato services including website, builder, dashboard, and public
                studio pages.
              </li>
              <li>
                <span className="font-medium text-foreground">Studio:</span> registered
                users who use the platform to create and manage tattoo landing pages.
              </li>
              <li>
                <span className="font-medium text-foreground">Visitor:</span> anyone
                who accesses the public studio pages or directory.
              </li>
              <li>
                <span className="font-medium text-foreground">Content:</span> text,
                images, videos, links, and other data uploaded to the platform.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Studio Account">
            <p>
              To use the builder features, you must create an account with accurate
              and complete information. You are responsible for:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Maintaining the confidentiality of login credentials.</li>
              <li>All activities that occur under your account.</li>
              <li>
                Notifying us immediately of unauthorized access or suspected account
                abuse.
              </li>
              <li>
                Ensuring you are at least 18 years old and legally authorized to
                manage a tattoo studio business.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Your Content">
            <p>
              You own and retain full rights to all content you upload to the
              platform. By uploading, you grant us a non-exclusive, royalty-free, and
              globally applicable license to store, display, and present that content
              in order to provide the service to you.
            </p>
            <p>You warrant that your content:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                Does not belong to others without permission (does not infringe
                copyright).
              </li>
              <li>
                Does not contain elements of harassment, pornography, hate speech, or
                terrorism propaganda.
              </li>
              <li>Is not misleading and does not violate applicable laws.</li>
            </ul>
            <p>
              We reserve the right to remove violating content without prior notice,
              especially if there is an official report from related parties.
            </p>
          </LegalSection>

          <LegalSection title="5. Prohibited Uses">
            <p>You are not allowed to use the platform for:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Illegal activities or violations of applicable laws in Indonesia.</li>
              <li>
                Sending spam, mass messages, or phishing content to other users or
                visitors.
              </li>
              <li>
                Modifying, reverse engineering, or breaking system security.
              </li>
              <li>
                Creating fake accounts, impersonating others, or providing false
                information.
              </li>
              <li>Disrupting the performance of servers, networks, or other users.</li>
            </ul>
            <p>
              Violations may result in temporary suspension or permanent deletion of
              the account without refund.
            </p>
          </LegalSection>

          <LegalSection title="6. Subscriptions & Payments">
            <p>
              The platform uses a paid subscription model with several duration
              options (3, 6, and 12 months). Payments are processed through Midtrans
              and charged in Rupiah (IDR), including VAT in accordance with
              applicable regulations.
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Subscription is active immediately after successful payment.</li>
              <li>
                Subscriptions do not auto-renew. You must renew manually before the
                active period ends.
              </li>
              <li>
                We reserve the right to change prices with at least 30 days' prior
                notice. Changes do not affect active subscriptions.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="7. Refund Policy">
            <p>
              Refunds are only given if there is a technical error on our side
              that makes the core service unusable for more than 72 consecutive
              hours. Refund requests must be submitted within 7 days of the
              transaction via email to{" "}
              <span className="font-medium text-foreground">{SUPPORT_EMAIL}</span>.
            </p>
            <p>
              Refunds do not apply to unilateral cancellations after successful
              payment, user negligence (forgotten password, incorrect uploads), or
              issues on the user's device.
            </p>
          </LegalSection>

          <LegalSection title="8. Termination of Service">
            <p>
              You can terminate your subscription at any time through the dashboard.
              We reserve the right to terminate or suspend your account without
              refund if:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>You violate these Terms & Conditions.</li>
              <li>There is an indication of fraud or platform abuse.</li>
              <li>Required by competent legal authorities.</li>
            </ul>
          </LegalSection>

          <LegalSection title="9. Limitation of Liability">
            <p>
              The service is provided &ldquo;as is&rdquo; without any explicit or
              implicit warranty. We are not responsible for:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                Indirect loss, loss of revenue, or reputational damage resulting from
                platform use.
              </li>
              <li>
                Actions of third parties, including visitors sending leads.
              </li>
              <li>
                Service interruptions due to events beyond our control (force
                majeure).
              </li>
            </ul>
            <p>
              Our maximum liability is limited to the amount you paid in the last 3
              months for the associated subscription.
            </p>
          </LegalSection>

          <LegalSection title="10. Governing Law">
            <p>
              These Terms & Conditions are governed by the laws of the Republic of
              Indonesia. Any dispute will be resolved amicably. If no agreement is
              reached, disputes will be resolved through the South Jakarta District
              Court.
            </p>
          </LegalSection>

          <LegalSection title="11. Changes to Terms">
            <p>
              We may update these Terms & Conditions at any time. Material changes
              will be notified at least 14 days before they become effective. You
              are deemed to have accepted the latest version if you continue to use
              the service after the changes take effect.
            </p>
          </LegalSection>

          <LegalSection title="12. Contact">
            <p>
              Questions regarding the Terms & Conditions can be sent to{" "}
              <span className="font-medium text-foreground">{LEGAL_EMAIL}</span>.
            </p>
          </LegalSection>
        </>
      ) : (
        <>
          <LegalSection title="1. Penerimaan Syarat">
            <p>
              Dengan mendaftar, mengakses, atau menggunakan layanan Ruang Tato di{" "}
              <a
                href={SITE_URL}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {SITE_DOMAIN}
              </a>
              , Anda menyetujui untuk terikat oleh Syarat & Ketentuan ini, serta
              Kebijakan Privasi yang merupakan bagian tak terpisahkan dari dokumen
              ini. Jika Anda tidak menyetujui salah satu butir, mohon untuk tidak
              menggunakan layanan kami.
            </p>
          </LegalSection>

          <LegalSection title="2. Definisi">
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Platform:</span> seluruh
                layanan Ruang Tato termasuk website, builder, dashboard, dan halaman
                studio publik.
              </li>
              <li>
                <span className="font-medium text-foreground">Studio:</span> pengguna
                terdaftar yang menggunakan platform untuk membuat dan mengelola
                landing page tato.
              </li>
              <li>
                <span className="font-medium text-foreground">Pengunjung:</span> siapa
                pun yang mengakses halaman studio publik atau direktori.
              </li>
              <li>
                <span className="font-medium text-foreground">Konten:</span> teks,
                gambar, video, tautan, dan data lain yang diunggah ke platform.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Akun Studio">
            <p>
              Untuk menggunakan fitur builder, Anda harus membuat akun dengan
              informasi yang akurat dan lengkap. Anda bertanggung jawab atas:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Menjaga kerahasiaan kredensial login.</li>
              <li>Seluruh aktivitas yang terjadi dalam akun Anda.</li>
              <li>
                Memberitahu kami segera jika ada akses tidak sah atau dugaan
                penyalahgunaan akun.
              </li>
              <li>
                Memastikan Anda berusia minimal 18 tahun dan secara hukum berwenang
                mengelola usaha studio tato.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Konten Anda">
            <p>
              Anda memiliki dan tetap memiliki hak penuh atas semua konten yang
              Anda unggah ke platform. Dengan mengunggah, Anda memberikan kepada
              kami lisensi non-eksklusif, gratis, dan berlaku global untuk
              menyimpan, menampilkan, dan menyajikan konten tersebut dalam rangka
              penyediaan layanan kepada Anda.
            </p>
            <p>Anda menjamin bahwa konten Anda:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                Bukan milik orang lain tanpa izin (tidak melanggar hak cipta).
              </li>
              <li>
                Tidak mengandung unsur SARA, pornografi, ujaran kebencian, atau
                propaganda terorisme.
              </li>
              <li>Tidak menyesatkan atau melanggar peraturan perundang-undangan.</li>
            </ul>
            <p>
              Kami berhak menghapus konten yang melanggar tanpa pemberitahuan
              terlebih dahulu, terutama jika ada laporan resmi dari pihak terkait.
            </p>
          </LegalSection>

          <LegalSection title="5. Penggunaan yang Dilarang">
            <p>Anda tidak diperbolehkan menggunakan platform untuk:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Aktivitas ilegal atau melanggar hukum yang berlaku di Indonesia.</li>
              <li>
                Mengirim spam, pesan masal, atau konten phishing kepada pengguna
                lain atau pengunjung.
              </li>
              <li>
                Memodifikasi, melakukan reverse engineering, atau memecahkan
                keamanan sistem.
              </li>
              <li>
                Membuat akun palsu, menyamar sebagai pihak lain, atau memberikan
                informasi palsu.
              </li>
              <li>Mengganggu performa server, jaringan, atau pengguna lain.</li>
            </ul>
            <p>
              Pelanggaran dapat berakibat pada penangguhan sementara atau
              penghapusan akun secara permanen tanpa pengembalian dana.
            </p>
          </LegalSection>

          <LegalSection title="6. Langganan & Pembayaran">
            <p>
              Platform menggunakan model langganan berbayar dengan beberapa pilihan
              durasi (3, 6, dan 12 bulan). Pembayaran diproses melalui Midtrans dan
              dikenakan dalam Rupiah (IDR), sudah termasuk PPN sesuai peraturan
              yang berlaku.
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Langganan aktif segera setelah pembayaran berhasil.</li>
              <li>
                Langganan tidak diperpanjang otomatis. Anda perlu memperpanjang
                secara manual sebelum masa aktif berakhir.
              </li>
              <li>
                Kami berhak mengubah harga dengan pemberitahuan paling lambat 30
                hari sebelumnya. Perubahan tidak memengaruhi langganan yang sudah
                aktif.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="7. Kebijakan Refund">
            <p>
              Refund hanya diberikan jika terdapat kesalahan teknis dari pihak kami
              yang membuat layanan tidak dapat digunakan lebih dari 72 jam berturut
              turut. Permohonan refund harus diajukan dalam 7 hari sejak transaksi
              melalui email{" "}
              <span className="font-medium text-foreground">{SUPPORT_EMAIL}</span>.
            </p>
            <p>
              Refund tidak berlaku untuk pembatalan sepihak setelah pembayaran
              berhasil, kelalaian pengguna (lupa password, salah unggah), atau
              masalah pada perangkat pengguna.
            </p>
          </LegalSection>

          <LegalSection title="8. Penghentian Layanan">
            <p>
              Anda dapat menghentikan langganan kapan saja melalui dashboard. Kami
              berhak menghentikan atau menangguhkan akun Anda tanpa pengembalian
              dana jika:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Anda melanggar Syarat & Ketentuan ini.</li>
              <li>Terdapat indikasi penipuan atau penyalahgunaan platform.</li>
              <li>Diwajibkan oleh otoritas hukum yang berwenang.</li>
            </ul>
          </LegalSection>

          <LegalSection title="9. Batasan Tanggung Jawab">
            <p>
              Layanan disediakan &ldquo;sebagaimana adanya&rdquo; tanpa garansi
              eksplisit maupun implisit. Kami tidak bertanggung jawab atas:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                Kerugian tidak langsung, kehilangan pendapatan, atau kerugian
                reputasi akibat penggunaan platform.
              </li>
              <li>
                Tindakan pihak ketiga, termasuk pengunjung yang mengirim lead.
              </li>
              <li>
                Gangguan layanan akibat kejadian di luar kendali kami (force
                majeure).
              </li>
            </ul>
            <p>
              Maksimum tanggung jawab kami terbatas pada jumlah yang Anda bayarkan
              dalam 3 bulan terakhir untuk langganan terkait.
            </p>
          </LegalSection>

          <LegalSection title="10. Hukum yang Berlaku">
            <p>
              Syarat & Ketentuan ini tunduk pada hukum Republik Indonesia. Setiap
              perselisihan akan diselesaikan secara musyawarah. Jika tidak tercapai
              kesepakatan, perselisihan akan diselesaikan melalui Pengadilan Negeri
              Jakarta Selatan.
            </p>
          </LegalSection>

          <LegalSection title="11. Perubahan Syarat">
            <p>
              Kami dapat memperbarui Syarat & Ketentuan ini sewaktu-waktu.
              Perubahan material akan diberitahukan paling lambat 14 hari sebelum
              berlaku efektif. Anda dianggap menyetujui versi terbaru jika tetap
              menggunakan layanan setelah perubahan berlaku.
            </p>
          </LegalSection>

          <LegalSection title="12. Kontak">
            <p>
              Pertanyaan terkait Syarat & Ketentuan dapat dikirim ke{" "}
              <span className="font-medium text-foreground">{LEGAL_EMAIL}</span>.
            </p>
          </LegalSection>
        </>
      )}
    </LegalShell>
  )
}
