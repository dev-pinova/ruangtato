import type { Metadata } from "next"

import { LegalShell, LegalSection } from "@/components/marketing/legal-shell"
import { createPageMetadata } from "@/lib/seo"
import { LEGAL_EMAIL, SITE_DOMAIN, SITE_URL, SUPPORT_EMAIL } from "@/lib/site"

export const metadata: Metadata = createPageMetadata({
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan ketentuan penggunaan platform Ruang Tato untuk studio tattoo di Indonesia.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Syarat & Ketentuan"
      description="Aturan main saat menggunakan platform Ruang Tato sebagai studio maupun pengunjung."
      updatedAt="1 Juni 2026"
    >
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
            <span className="font-medium text-foreground">Platform:</span>{" "}
            seluruh layanan Ruang Tato termasuk website, builder, dashboard,
            dan halaman studio publik.
          </li>
          <li>
            <span className="font-medium text-foreground">Studio:</span>{" "}
            pengguna terdaftar yang menggunakan platform untuk membuat dan
            mengelola landing page tato.
          </li>
          <li>
            <span className="font-medium text-foreground">Pengunjung:</span>{" "}
            siapa pun yang mengakses halaman studio publik atau direktori.
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
    </LegalShell>
  )
}
