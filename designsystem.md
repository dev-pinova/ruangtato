# RuangTato UI/UX Design System: Linear & Vercel Aesthetic

Dokumen ini merinci rencana transformasi sistem desain (UI/UX) RuangTato agar memiliki estetika, keterbacaan, dan kedalaman interaktif kelas dunia, terinspirasi oleh standar industri modern seperti **Linear** dan **Vercel**.

---

## 1. PRINSIP ESTETIKA (THE CORE PRINCIPLES)

Estetika Vercel dan Linear dibangun di atas fondasi minimalisme ekstrem, presisi piksel, kontras tinggi, dan gerakan mikro yang taktil.

### A. Palet Warna Gelap Monokromatik & Aksen Khusus
- **Base Latar Belakang**: Hitam sempurna (`#000000` / `oklch(0% 0 0)`) untuk menciptakan kekontrasan tak terbatas (infinite contrast).
- **Elemen Card & Panel**: Abu-abu hangat sangat gelap (`oklch(12% 0 0)` sampai `oklch(15% 0 0)`) dengan border tipis 1px ber-opacity rendah (`border-white/10` atau `oklch(100% 0 0 / 8%)`).
- **Warna Aksen (Brand Scarlet)**: `oklch(0.62 0.21 25)` merah scarlet gelap yang tajam, digunakan secara hemat hanya untuk CTA utama, indikator aktif, atau highlight penting.

### B. Grid & Bento Layout (Modular Structuralism)
- **Struktur Bento Grid**: Menyusun informasi (seperti fitur studio, harga, kurasi artist) ke dalam modul-modul kartu (cards) dengan ukuran grid yang tidak seragam (staggered), menciptakan ritme visual yang menarik namun teratur.
- **Border Separator Tipis**: Menggunakan garis pemisah 1px warna redup untuk mempertegas batas antarseksi alih-alih menggunakan jarak kosong (whitespace) yang terlalu lebar.

### C. Tipografi Berkarakter Tinggi
- **Heading (H1, H2)**: Menggunakan font **Syne** atau **Geist Sans** dengan berat `font-bold` atau `font-semibold` serta *letter-spacing* yang rapat (`tracking-tighter` atau `tracking-tight`). Ini memberikan kesan kokoh, presisi, dan modern.
- **Body & UI**: Menggunakan font **Inter** dengan ukuran compact (`text-sm` atau `text-xs`) dengan `leading-relaxed` untuk kemudahan pemindaian informasi (scannability).

---

## 2. PETA KOMPONEN MAGICUI & SHADCN

Untuk mencapai nuansa interaktif Linear/Vercel, kita akan memetakan dan menerapkan komponen MagicUI berikut:

| Nama Efek / Komponen | Peran UI | Penempatan Spesifik |
| :--- | :--- | :--- |
| **Border Beam** | Efek Cahaya Laser | Dipasang pada sekeliling kolom pencarian aktif dan Kartu Langganan "Popular". |
| **Shimmer Button** | Tombol CTA Premium | Digunakan untuk tombol utama "Mulai Sekarang" dan pembayaran/perpanjangan lisensi. |
| **Bento Grid** | Tata Letak Fitur | Digunakan di halaman dashboard/builder untuk menyajikan fitur secara modular. |
| **Gradual Spacing** | Transisi Karakter | Digunakan pada judul besar halaman utama publik (Hero) saat pemuatan pertama. |
| **Meteors / RetroGrid** | Latar Belakang Animasi | RetroGrid dipasang pada latar belakang Hero. Meteors/Particles digunakan pada halaman Pricing. |
| **Particles** | Interaktivitas Kursor | Partikel debu melayang tipis di latar belakang gelap halaman detail studio dan pricing. |

---

## 3. PANDUAN PENGEMBANGAN KODE (CODE CONSTRAINT)

### A. Motion & Animasi (Framer Motion)
- **Akselerasi Perangkat Keras**: Hanya gunakan properti `transform` (`x`, `y`, `scale`, `rotate`) dan `opacity` untuk animasi Framer Motion. Dilarang menganimasikan properti layout seperti `width`, `height`, atau `margin` karena memicu reflow browser dan melambatkan frame rate.
- **Spring Physics**: Gunakan transisi bertipe `spring` dengan nilai stiffness tinggi dan damping seimbang untuk efek memantul yang taktil:
  ```typescript
  transition: { type: "spring", stiffness: 300, damping: 25 }
  ```

### B. Clean Architecture
- **Pemisahan Layer Komponen**:
  - Komponen atomik murni (misal: Button, Input, Select) disimpan di `src/components/ui/`.
  - Komponen modular kompleks yang menggabungkan animasi/efek khusus wajib dibungkus (wrapped) di `src/components/shared/` atau `src/components/design/`.

### C. Zero Client-Side Fetching (RSC First)
- Seluruh halaman informasi publik terverifikasi (seperti `/` dan `/app/studio/[slug]`) wajib menggunakan **React Server Components (RSC)**. Data diambil langsung dari database di server melalui Prisma/Drizzle saat perayapan build (SSG/ISR) untuk waktu muat halaman 0ms tanpa loading spinner.

---

## 3. RENCANA UI/UX DASHBOARD MEMBER & SUPER ADMIN

Dasbor internal harus memprioritaskan produktivitas berkecepatan tinggi (high-velocity productivity) dengan menyembunyikan detail sekunder dan menonjolkan data utama.

### A. Dashboard Member (Studio Builder & Management)
1. **Sidebar Navigasi Vercel-style**:
   - Struktur sidebar gelap semi-transparan (`bg-zinc-950/70 backdrop-blur-md`) dengan border tipis di sebelah kanan (`border-zinc-900`).
   - Indikator menu aktif ditandai dengan perubahan warna teks menjadi putih terang dan penanda garis vertikal scarlet (`var(--brand-scarlet)`) di sisi kiri.
2. **Command Menu (CMD + K)**:
   - Integrasi `cmdk` sebagai pusat perintah navigasi instan (Contoh: mencari studio, berpindah ke menu tagihan, membuka editor halaman).
3. **Bento Card Metrik Kinerja**:
   - Statistik kunjungan (views, clicks, conversion rate) disajikan dalam tata letak Bento Grid.
   - Kartu metrik dengan kinerja terbaik (misal: konversi di atas rata-rata) diberikan kilauan `BorderBeam` sebagai penanda apresiatif.
4. **Builder Workspace Yang Taktil**:
   - Area pratinjau (preview iframe) dengan frame minimalis menyerupai mockup browser.
   - Panel editor komponen menggunakan model *floating panel* semi-transparan (glassmorphism) yang melayang di atas workspace, meminimalisir distraksi.

### B. Super Admin Panel (Platform Monitoring)
1. **Audit Logs & Data Grid Berkecepatan Tinggi**:
   - Tabel administrasi menggunakan tata letak baris kompak (`py-2` alih-alih `py-4`) untuk memuat data lebih padat (high density).
   - Status suspensi dan status verifikasi tenant (`isTrusted`) menggunakan tombol sakelar instan (switch toggle) yang memperbarui data secara asinkron tanpa refresh halaman penuh.
2. **Grafik Analitis Gelap (Recharts)**:
   - Grafik pertumbuhan pengguna dan pendapatan platform menggunakan gradasi neon scarlet (`var(--brand-scarlet)`) dan violet yang berpendar redup pada latar belakang gelap gulita.
3. **Status Banner Kesehatan Sistem**:
   - Di bagian atas dashboard admin, dipasang indikator kesehatan status sistem (Koneksi Database, Midtrans API, Better Auth API) menggunakan titik hijau/merah berdenyut lembut (pulsing dot) yang memberikan info reliabilitas secara sekilas.

### C. Detail Animasi & Drag-and-Drop Builder (Taktil & Fisika)
1. **Fisika Pengurutan Mulus (Sortable Physics)**:
   - Manajemen urutan blok halaman menggunakan Framer Motion `<Reorder.Group>` dan `<Reorder.Item>` untuk transisi perpindahan posisi yang halus dengan efek pegas (*spring transition*).
2. **Efek Laser Batas Aktif (Active Outline Glow)**:
   - Blok halaman yang sedang disunting (active state) atau sedang ditarik memiliki garis tepi neon tipis scarlet menggunakan `BorderBeam` berdurasi cepat (4 detik) untuk memfokuskan perhatian pengguna.
3. **Transisi Pemuatan Elemen (AnimatePresence)**:
   - Proses penambahan atau penghapusan blok didukung oleh transisi `initial={{ opacity: 0, scale: 0.96 }}` dengan *exit* berlawanan agar penambahan konten terasa organik dan bernyawa.
4. **Dock Komponen Melayang (MacOS Dock Style)**:
   - Drawer pemilih komponen baru di bagian bawah workspace didesain melayang menggunakan komponen `Dock` MagicUI, memberikan efek pembesaran ikon (*fisheye scale effect*) ketika kursor mouse mendekat.

### D. Ornamen & Dekorasi Visual (Garis, Grafik, & Lingkaran)
1. **Pola Grid & Dot Matrix (Grid & Dot Pattern)**:
   - Seluruh latar belakang dasbor builder kosong dilapisi ornamen pola titik-titik (`DotPattern`) atau pola garis kisi-kisi (`GridPattern`) dengan opasitas sangat tipis (`opacity-5`) untuk memberikan aksen struktur cetak biru (*blueprints*) khas Vercel.
2. **Grafik Circular Progress (Ornamen Lingkaran)**:
   - Metrik ringkasan performa SEO halaman studio disajikan menggunakan ornamen diagram lingkaran dengan pengisian *stroke* beranimasi (`CircularProgress`) melambangkan tingkat kesehatan optimasi.
3. **Pancaran Denyut Lingkaran (Ripple Background)**:
   - Aksen hiasan lingkaran konsentris berdenyut (`Ripple` MagicUI) diletakkan di latar belakang avatar profil studio atau logo utama dashboard member.
4. **Meteors di Area Analitik**:
   - Efek garis cahaya meluncur melintasi widget grafik analitik (`Meteors` MagicUI) untuk memberikan efek visual bertema futuristik gelap.

---

## 4. PANDUAN COPYWRITING (SPESIFIK & TEGAS)

Copywriting di seluruh aplikasi harus menghindari ambiguitas (kata-kata puitis/kamera tanpa makna bisnis) dan langsung merujuk pada kebutuhan fungsional **Pemilik Studio Tato** dan **Artist Tato**.

### A. Prinsip Copywriting
1. **Rujuk Subjek Secara Spesifik**: Hindari kata ganti generik seperti *"pengguna"* atau *"user"*. Gunakan **"Pemilik Studio"** atau **"Artist Tato"** untuk mempertegas kepemilikan peran.
2. **Keluarkan Nilai Bisnis Nyata (Direct Value)**: Fokus pada apa yang diperoleh secara operasional (portofolio, booking, verifikasi standar higienitas).
3. **Hilangkan Slang & Kata Kasual**: Hapus kata seperti *"tanpa ribet"*, *"gampang banget"*, atau *"coba deh"*. Gunakan bahasa profesional yang tegas dan meyakinkan.

### B. Perbandingan Copywriting Kontrol

| Area UI | Copywriting Lama (Ambigu/Kasual) | Copywriting Baru (Tegas & Spesifik) |
| :--- | :--- | :--- |
| **Hero Title** | `Temukan studio tattoo impianmu` | `Eksplorasi Karya. Bandingkan Studio Tato. Booking Instan.` |
| **Hero Description** | `Portofolio artist, standar sterilisasi, booking WhatsApp — tanpa ribet.` | `Akses kurasi portofolio profesional, verifikasi higienitas sanitasi, dan hubungi artist pilihan Anda secara langsung.` |
| **Registrasi Studio** | `Ayo gabungkan tokomu dan dapatkan pelanggan baru di platform kami.` | `Daftarkan Studio Tato Anda. Publikasikan portofolio artist, kelola jadwal konsultasi, dan bangun reputasi terverifikasi.` |
| **Dasbor Kolom Utama** | `Kelola halaman tokomu secara instan lewat dasbor yang mudah.` | `Dasbor Pengelolaan Studio. Kelola tata letak landing page, tinjau metrik kunjungan, dan pantau data prospek pelanggan (leads).` |
| **Penyuntingan Blok** | `Atur urutan konten sesukamu di sini dengan cepat.` | `Urutkan Struktur Landing Page. Tarik dan lepas (drag-and-drop) komponen untuk menyusun portofolio, FAQ, dan form booking.` |

### C. Standardisasi Tombol Aksi (Unambiguous CTA)
Semua tombol aksi utama (CTA) harus menggunakan kata kerja deklaratif yang spesifik pada aksi tujuan:
- `Mulai Sekarang` ➡️ **`Daftarkan Studio`** / **`Buat Landing Page`**
- `Hubungi Kami` ➡️ **`Hubungi Artist via WhatsApp`**
- `Kirim` ➡️ **`Kirim Permintaan Booking`**
- `Beli Paket` ➡️ **`Aktifkan Langganan Premium`**

---

## 5. RENCANA PRICING & HALAMAN PENDUKUNG (POLICY, LEGAL)

### A. Rekayasa Fitur 4 Variasi Pricing (High Conversion)
Guna memaksimalkan konversi pembelian paket berbayar, fitur diubah agar menonjolkan keuntungan fungsional dan nilai ekonomis bagi pemilik studio:

1. **Starter (1 Bulan)**:
   - *Fokus*: Validasi pasar awal untuk studio baru.
   - *Teks Fitur*:
     - `1 Landing Page Studio Resmi` (Kehadiran online instan)
     - `15+ Blok Komponen Premium (Hero, Galeri, FAQ)`
     - `Integrasi WhatsApp Direct Booking` (Jalur langsung pelanggan)
     - `Formulir Konsultasi Prospek (Lead Capture)`
     - `Analisis Kunjungan Dasar`

2. **Growth (3 Bulan - Hemat 16%)**:
   - *Fokus*: Studio aktif yang mulai membangun nama merek.
   - *Teks Fitur*:
     - `Semua Fitur Starter`
     - `Lencana Verifikasi 'Trusted Studio'` (Meningkatkan kepercayaan 80%)
     - `Analisis Kunjungan & Klik Konversi` (Data akurat performa iklan)
     - `Dukungan Prioritas WhatsApp`

3. **Pro (6 Bulan - Hemat 24% - Rekomendasi/Popular)**:
   - *Fokus*: Studio profesional dengan tim artist tetap.
   - *Teks Fitur*:
     - `Semua Fitur Growth`
     - `Ekspor Data Prospek Pelanggan (CSV/Excel)` (Untuk CRM & Retargeting)
     - `Manajemen Anggota Tim (Hingga 3 Artist)`
     - `Kustomisasi Domain Pribadi (Segera)`
     - `Penyaringan Ulasan & FAQ Khusus`

4. **Enterprise (12 Bulan - Hemat 33%)**:
   - *Fokus*: Jaringan studio besar dengan tim tak terbatas.
   - *Teks Fitur*:
     - `Semua Fitur Pro`
     - `Manajemen Artist Tanpa Batas`
     - `Laporan Kinerja Bulanan Otomatis`
     - `Manajer Akun Khusus (Dedicated Support)`
     - `Akses API Pengembang (Segera)`

### B. Penataan Halaman Kebijakan & Legalitas (Policy, Terms, Cookies)
- **Aturan Ketat Konten**: Isi teks hukum dan syarat ketentuan **TIDAK BOLEH** diubah satu patah kata pun guna menjaga keabsahan perlindungan hukum platform.
- **Tindakan Perapian (Polishing)**:
  - Terapkan kelas pembungkus `.legal-prose` untuk mengatur margin paragraf (`my-4`), spasi baris (`leading-relaxed`), dan indentasi daftar poin (`pl-6 list-disc space-y-2`) agar serasi dengan gaya font inter di dasbor utama.
  - Tambahkan garis pembatas tipis (`border-zinc-800`) antar sub-bab legalitas untuk meningkatkan keterbacaan dokumen yang panjang.

---

## 6. TAHAPAN AKSI IMPLEMENTASI (IMPLEMENTATION STEPS)

### Tahap 1: Setup Font & Basis Warna
1. Daftarkan font **Syne** di `src/app/layout.tsx` menggunakan `next/font/google`.
2. Update `--font-display` pada `globals.css` ke `Syne`.
3. Konfigurasikan base color di `globals.css` agar warna latar gelap menggunakan hitam pekat (`oklch(0% 0 0)` / `#000000`).

### Tahap 2: Transformasi Grid & Layout Bento
1. Rombak halaman showcase utama bagian grid studio menjadi Bento Grid terstruktur.
2. Tambahkan efek *neon-glow outline* yang tipis pada kartu bento.

### Tahap 3: Pemolesan Komponen Taktil
1. Ganti seluruh tombol utama di dashboard dan billing menggunakan `ShimmerButton` yang disesuaikan ukurannya.
2. Pasang efek transisi halus pada setiap interaksi hover di menu sidebar.
