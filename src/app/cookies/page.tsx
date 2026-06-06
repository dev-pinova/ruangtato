import type { Metadata } from "next"

import { LegalShell, LegalSection } from "@/components/marketing/legal-shell"

export const metadata: Metadata = {
  title: "Kebijakan Cookie - Ruang Tato",
  description:
    "Penjelasan tentang penggunaan cookie dan teknologi serupa di platform Ruang Tato.",
}

export default function CookiesPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Kebijakan Cookie"
      description="Bagaimana Ruang Tato menggunakan cookie untuk meningkatkan pengalaman Anda."
      updatedAt="1 Juni 2026"
    >
      <LegalSection title="1. Apa itu Cookie?">
        <p>
          Cookie adalah file teks kecil yang disimpan di perangkat Anda saat
          mengakses situs web. Cookie membantu situs mengingat preferensi,
          status login, dan informasi lain untuk memberikan pengalaman yang
          lebih baik.
        </p>
        <p>
          Kebijakan ini menjelaskan jenis cookie yang kami gunakan, mengapa
          kami menggunakannya, dan bagaimana Anda dapat mengontrolnya.
        </p>
      </LegalSection>

      <LegalSection title="2. Jenis Cookie yang Kami Gunakan">
        <p>Kami menggunakan empat kategori cookie utama:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <span className="font-medium text-foreground">Cookie Esensial:</span>{" "}
            wajib untuk fungsi dasar platform seperti login, session
            management, dan keamanan. Cookie ini tidak dapat dinonaktifkan.
          </li>
          <li>
            <span className="font-medium text-foreground">Cookie Preferensi:</span>{" "}
            menyimpan pilihan Anda seperti bahasa, mode tampilan, dan filter
            terakhir yang digunakan di direktori.
          </li>
          <li>
            <span className="font-medium text-foreground">Cookie Analitik:</span>{" "}
            membantu kami memahami bagaimana pengguna berinteraksi dengan
            platform sehingga kami dapat meningkatkan fitur. Data dikumpulkan
            secara anonim.
          </li>
          <li>
            <span className="font-medium text-foreground">Cookie Marketing:</span>{" "}
            saat ini kami tidak menggunakan cookie marketing pihak ketiga.
            Jika di kemudian hari diaktifkan, kami akan meminta persetujuan
            Anda terlebih dahulu.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Cookie Pihak Ketiga">
        <p>
          Beberapa fitur menggunakan layanan pihak ketiga yang dapat memasang
          cookie mereka sendiri:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <span className="font-medium text-foreground">Midtrans:</span>{" "}
            untuk memproses pembayaran langganan dengan aman.
          </li>
          <li>
            <span className="font-medium text-foreground">Penyedia Analitik:</span>{" "}
            untuk mengumpulkan data agregat tentang penggunaan platform.
          </li>
        </ul>
        <p>
          Cookie pihak ketiga tunduk pada kebijakan masing-masing penyedia. Kami
          tidak memiliki kontrol atas data yang mereka kumpulkan.
        </p>
      </LegalSection>

      <LegalSection title="4. Mengontrol Cookie">
        <p>
          Anda dapat mengontrol atau menghapus cookie melalui pengaturan
          browser Anda. Sebagian besar browser memungkinkan Anda untuk:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Melihat cookie apa saja yang tersimpan.</li>
          <li>Menghapus cookie tertentu atau semua cookie.</li>
          <li>Memblokir cookie pihak ketiga.</li>
          <li>Memblokir semua cookie (tidak direkomendasikan).</li>
        </ul>
        <p>
          Perlu diingat, jika Anda menonaktifkan cookie esensial, beberapa
          fitur platform tidak akan berfungsi dengan baik - misalnya Anda tidak
          dapat tetap login antar halaman.
        </p>
        <p>
          Panduan menonaktifkan cookie tersedia di situs resmi browser Anda:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Google Chrome: Settings &rarr; Privacy and security &rarr; Cookies</li>
          <li>Mozilla Firefox: Settings &rarr; Privacy &amp; Security</li>
          <li>Safari: Preferences &rarr; Privacy</li>
          <li>Microsoft Edge: Settings &rarr; Cookies and site permissions</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Local Storage & Teknologi Serupa">
        <p>
          Selain cookie, kami menggunakan teknologi penyimpanan lokal seperti
          localStorage dan sessionStorage untuk menyimpan preferensi UI
          (seperti draft form atau panel state di builder). Data ini tetap di
          perangkat Anda dan tidak dikirim ke server kami secara otomatis.
        </p>
      </LegalSection>

      <LegalSection title="6. Perubahan Kebijakan Cookie">
        <p>
          Kami dapat memperbarui kebijakan ini sesuai dengan perubahan teknologi
          atau peraturan. Versi terbaru selalu tersedia di halaman ini, dengan
          tanggal pembaruan terakhir tercantum di bagian atas.
        </p>
      </LegalSection>

      <LegalSection title="7. Kontak">
        <p>
          Pertanyaan terkait Kebijakan Cookie dapat dikirim ke{" "}
          <span className="font-medium text-foreground">privacy@ruangtato.id</span>.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
