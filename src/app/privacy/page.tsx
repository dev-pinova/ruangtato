import type { Metadata } from "next"

import { LegalShell, LegalSection } from "@/components/marketing/legal-shell"
import { staticPageMetadata } from "@/lib/seo"
import { PRIVACY_EMAIL, SITE_DOMAIN, SITE_URL } from "@/lib/site"
import { getLocale } from "@/lib/i18n/actions"

export const metadata: Metadata = staticPageMetadata("/privacy")

export default async function PrivacyPage() {
  const locale = await getLocale()
  const isEn = locale === "en"

  return (
    <LegalShell
      eyebrow="Legal"
      title={isEn ? "Privacy Policy" : "Kebijakan Privasi"}
      description={
        isEn
          ? "We are committed to protecting the privacy of every user of the Ruang Tato platform."
          : "Kami berkomitmen melindungi privasi setiap pengguna platform Ruang Tato."
      }
      updatedAt={isEn ? "June 1, 2026" : "1 Juni 2026"}
    >
      {isEn ? (
        <>
          <LegalSection title="1. Introduction">
            <p>
              This Privacy Policy applies to all services provided by Ruang Tato
              (&ldquo;we&rdquo;, &ldquo;platform&rdquo;), including the website at{" "}
              <a
                href={SITE_URL}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {SITE_DOMAIN}
              </a>
              , the landing page builder application, and public studio pages hosted on
              our domain. By using our services, you consent to the practices
              described in this policy.
            </p>
            <p>
              We adhere to the principles of the Personal Data Protection Act (UU PDP)
              of the Republic of Indonesia and international best practices in
              handling your data.
            </p>
          </LegalSection>

          <LegalSection title="2. Data We Collect">
            <p>
              We collect several categories of data to provide and improve our services:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Account Data:</span>{" "}
                full name, email, password (hashed), phone number, and studio name.
              </li>
              <li>
                <span className="font-medium text-foreground">Studio Data:</span>{" "}
                information you enter on the landing page such as address, contact details,
                portfolio, service description, and pricing.
              </li>
              <li>
                <span className="font-medium text-foreground">Lead Data:</span>{" "}
                name and message sent by visitors via the form on your studio page.
              </li>
              <li>
                <span className="font-medium text-foreground">Payment Data:</span>{" "}
                transaction history via Midtrans. We do not store your credit card number
                - sensitive data is processed directly by Midtrans.
              </li>
              <li>
                <span className="font-medium text-foreground">Analytics Data:</span>{" "}
                views, clicks, visit duration, device, and referrer country (anonymous).
              </li>
              <li>
                <span className="font-medium text-foreground">Technical Data:</span>{" "}
                IP address, browser type, operating system, and session cookies.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. How We Use Data">
            <p>Data that we collect is used to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Provide, maintain, and develop platform services.</li>
              <li>Process subscription payments and issue electronic invoices.</li>
              <li>Send important notifications about accounts, subscriptions, or new leads.</li>
              <li>Analyze usage to improve product quality and UI.</li>
              <li>Detect and prevent fraudulent activities and abuse.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Sharing Data with Third Parties">
            <p>
              We do not sell your personal data. We only share data with third parties
              under the following conditions:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Service Providers:</span>{" "}
                Midtrans (payments), cloud infrastructure providers, and analytics services.
                They are bound by confidentiality agreements.
              </li>
              <li>
                <span className="font-medium text-foreground">Legal Obligations:</span>{" "}
                if required by a court ruling, government authority, or applicable laws and
                regulations.
              </li>
              <li>
                <span className="font-medium text-foreground">Your Consent:</span>{" "}
                for anything else outside of the above, we will obtain your explicit
                consent beforehand.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Data Security">
            <p>
              We implement reasonable technical and organizational security measures to
              protect your data from unauthorized access, modification, disclosure, or
              deletion. This includes data encryption in transit (TLS 1.3), password
              hashing using modern algorithms, role-based access control (RBAC), and
              internal audit logs.
            </p>
            <p>
              However, no system is entirely secure. If a security incident occurs
              affecting your data, we will notify you within 72 hours of detection.
            </p>
          </LegalSection>

          <LegalSection title="6. Data Retention & Deletion">
            <p>
              We retain your account and studio data as long as your account is active.
              If you delete your account or studio, we will delete the associated data
              within a maximum of 30 days, unless there is a legal obligation to retain
              it longer (e.g., transaction records for tax purposes).
            </p>
            <p>
              Anonymous analytics data may be kept longer for internal research and product
              development purposes, without being linked back to any specific individual.
            </p>
          </LegalSection>

          <LegalSection title="7. Your Rights Over Data">
            <p>As a user, you have the right to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Access and request a copy of your personal data.</li>
              <li>Correct inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>
                Restrict or object to specific data processing (e.g., for marketing).
              </li>
              <li>File a complaint with the data protection authority.</li>
            </ul>
            <p>
              To exercise these rights, contact us via email at{" "}
              <span className="font-medium text-foreground">{PRIVACY_EMAIL}</span>. We
              will respond within 7 business days.
            </p>
          </LegalSection>

          <LegalSection title="8. Use by Minors">
            <p>
              Our services are not intended for users under the age of 18. We do not
              knowingly collect data from minors. If you become aware of an account owned
              by a minor, please contact us immediately for deactivation.
            </p>
          </LegalSection>

          <LegalSection title="9. Changes to the Policy">
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              notified via email or a notification in the dashboard before becoming
              effective. The last update date is displayed at the top of this page.
            </p>
          </LegalSection>

          <LegalSection title="10. Contact">
            <p>
              Questions, complaints, or requests regarding the privacy policy can be
              sent to:
            </p>
            <p>
              Email:{" "}
              <span className="font-medium text-foreground">{PRIVACY_EMAIL}</span>
              <br />
              Address: Ruang Tato, Jakarta, Indonesia
            </p>
          </LegalSection>
        </>
      ) : (
        <>
          <LegalSection title="1. Pendahuluan">
            <p>
              Kebijakan Privasi ini berlaku untuk seluruh layanan yang disediakan
              oleh Ruang Tato (&ldquo;kami&rdquo;, &ldquo;platform&rdquo;), termasuk
              situs web di{" "}
              <a
                href={SITE_URL}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {SITE_DOMAIN}
              </a>
              , aplikasi pembuat landing page, dan halaman studio publik yang
              dihosting di domain kami. Dengan menggunakan layanan kami, Anda
              menyetujui praktik yang dijelaskan dalam kebijakan ini.
            </p>
            <p>
              Kami mengikuti prinsip Undang-Undang Perlindungan Data Pribadi (UU PDP)
              Republik Indonesia dan praktik terbaik internasional dalam menangani
              data Anda.
            </p>
          </LegalSection>

          <LegalSection title="2. Data yang Kami Kumpulkan">
            <p>
              Kami mengumpulkan beberapa kategori data untuk menyediakan dan
              meningkatkan layanan kami:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Data Akun:</span> nama
                lengkap, email, kata sandi (di-hash), nomor telepon, dan nama studio.
              </li>
              <li>
                <span className="font-medium text-foreground">Data Studio:</span>{" "}
                informasi yang Anda masukkan di landing page seperti alamat, kontak,
                portofolio, deskripsi layanan, dan harga.
              </li>
              <li>
                <span className="font-medium text-foreground">Data Lead:</span> nama
                dan pesan yang dikirimkan pengunjung melalui form di halaman studio
                Anda.
              </li>
              <li>
                <span className="font-medium text-foreground">Data Pembayaran:</span>{" "}
                riwayat transaksi via Midtrans. Kami tidak menyimpan nomor kartu
                kredit Anda - data sensitif diproses langsung oleh Midtrans.
              </li>
              <li>
                <span className="font-medium text-foreground">Data Analitik:</span>{" "}
                jumlah view, klik, durasi kunjungan, perangkat, dan negara pengakses
                landing page Anda (anonim).
              </li>
              <li>
                <span className="font-medium text-foreground">Data Teknis:</span>{" "}
                alamat IP, jenis browser, sistem operasi, dan cookie sesi.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Cara Kami Menggunakan Data">
            <p>Data yang kami kumpulkan digunakan untuk:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Menyediakan, memelihara, dan mengembangkan layanan platform.</li>
              <li>
                Memproses pembayaran langganan dan menerbitkan invoice elektronik.
              </li>
              <li>
                Mengirim notifikasi penting tentang akun, langganan, atau lead baru.
              </li>
              <li>
                Menganalisis penggunaan untuk meningkatkan kualitas produk dan UI.
              </li>
              <li>Mendeteksi serta mencegah aktivitas penipuan dan penyalahgunaan.</li>
              <li>Memenuhi kewajiban hukum yang berlaku.</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Berbagi Data dengan Pihak Ketiga">
            <p>
              Kami tidak menjual data pribadi Anda. Kami hanya berbagi data dengan
              pihak ketiga dalam kondisi berikut:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">Penyedia Layanan:</span>{" "}
                Midtrans (pembayaran), penyedia infrastruktur cloud, dan layanan
                analitik. Mereka terikat perjanjian kerahasiaan.
              </li>
              <li>
                <span className="font-medium text-foreground">Kewajiban Hukum:</span>{" "}
                jika diwajibkan oleh putusan pengadilan, otoritas pemerintah, atau
                peraturan perundang-undangan yang berlaku.
              </li>
              <li>
                <span className="font-medium text-foreground">Persetujuan Anda:</span>{" "}
                untuk hal lain di luar yang disebut di atas, kami akan meminta
                persetujuan eksplisit Anda terlebih dahulu.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Keamanan Data">
            <p>
              Kami menerapkan langkah keamanan teknis dan organisasional yang wajar
              untuk melindungi data Anda dari akses, perubahan, pengungkapan, atau
              penghapusan tidak sah. Hal ini meliputi enkripsi data dalam transit
              (TLS 1.3), enkripsi password dengan algoritma hashing modern, akses
              terbatas berdasarkan peran (RBAC), dan audit log internal.
            </p>
            <p>
              Meski demikian, tidak ada sistem yang sepenuhnya aman. Jika terjadi
              insiden keamanan yang berdampak pada data Anda, kami akan
              memberitahukan dalam waktu paling lambat 3x24 jam sejak insiden
              terdeteksi.
            </p>
          </LegalSection>

          <LegalSection title="6. Penyimpanan & Penghapusan Data">
            <p>
              Data akun dan studio Anda kami simpan selama akun Anda aktif. Jika
              Anda menghapus akun atau studio, kami akan menghapus data terkait
              dalam waktu maksimal 30 hari, kecuali ada kewajiban hukum untuk
              menyimpan data tersebut lebih lama (misalnya catatan transaksi untuk
              keperluan pajak).
            </p>
            <p>
              Data analitik anonim mungkin disimpan lebih lama untuk keperluan
              riset internal dan pengembangan produk, tanpa dapat dikaitkan kembali
              ke individu tertentu.
            </p>
          </LegalSection>

          <LegalSection title="7. Hak Anda atas Data">
            <p>Sebagai pengguna, Anda memiliki hak untuk:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Mengakses dan meminta salinan data pribadi Anda.</li>
              <li>Memperbaiki data yang tidak akurat.</li>
              <li>Meminta penghapusan akun dan data terkait.</li>
              <li>
                Membatasi atau menolak pemrosesan data tertentu (misalnya untuk
                pemasaran).
              </li>
              <li>Mengajukan keluhan kepada otoritas pelindungan data.</li>
            </ul>
            <p>
              Untuk menggunakan hak-hak ini, hubungi kami melalui email{" "}
              <span className="font-medium text-foreground">{PRIVACY_EMAIL}</span>.
              Kami akan merespons dalam waktu 7 hari kerja.
            </p>
          </LegalSection>

          <LegalSection title="8. Penggunaan oleh Anak di Bawah Umur">
            <p>
              Layanan kami tidak ditujukan untuk pengguna di bawah usia 18 tahun.
              Kami tidak secara sadar mengumpulkan data dari anak di bawah umur.
              Jika Anda mengetahui adanya akun yang dimiliki oleh anak di bawah
              umur, mohon segera hubungi kami untuk penonaktifan.
            </p>
          </LegalSection>

          <LegalSection title="9. Perubahan Kebijakan">
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
              Perubahan material akan diberitahukan melalui email atau notifikasi di
              dashboard sebelum berlaku efektif. Tanggal pembaruan terakhir
              ditampilkan di bagian atas halaman ini.
            </p>
          </LegalSection>

          <LegalSection title="10. Kontak">
            <p>
              Pertanyaan, keluhan, atau permintaan terkait kebijakan privasi dapat
              dikirim ke:
            </p>
            <p>
              Email:{" "}
              <span className="font-medium text-foreground">{PRIVACY_EMAIL}</span>
              <br />
              Alamat: Ruang Tato, Jakarta, Indonesia
            </p>
          </LegalSection>
        </>
      )}
    </LegalShell>
  )
}
