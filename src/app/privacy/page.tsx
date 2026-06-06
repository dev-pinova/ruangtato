import type { Metadata } from "next"

import { LegalShell, LegalSection } from "@/components/marketing/legal-shell"
import { createPageMetadata } from "@/lib/seo"
import { PRIVACY_EMAIL, SITE_DOMAIN, SITE_URL } from "@/lib/site"

export const metadata: Metadata = createPageMetadata({
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi Ruang Tato menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Kebijakan Privasi"
      description="Kami berkomitmen melindungi privasi setiap pengguna platform Ruang Tato."
      updatedAt="1 Juni 2026"
    >
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
    </LegalShell>
  )
}
