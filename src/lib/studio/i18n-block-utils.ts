import type { Locale } from "@/lib/i18n/actions"

/**
 * Comprehensive dictionary mapping Indonesian block phrases to English.
 * Covers default preset data, common studio content, and UI strings across all 21 block components.
 */
const ID_TO_EN_MAP: Record<string, string> = {
  // Navigation & Menu Labels
  "Nama Studio": "Studio Name",
  "Booking Sekarang": "Book Now",
  "Tentang": "About",
  "Layanan": "Services",
  "Artist": "Artists",
  "Klien": "Clients",
  "FAQ": "FAQ",
  "Berita": "News",
  "Kontak": "Contact",
  "Galeri": "Gallery",
  "Beranda": "Home",
  "Fitur": "Features",
  "Demos": "Demos",
  "About Us": "About Us",
  "Contact Us": "Contact Us",
  "Tentang Kami": "About Us",
  "Portofolio": "Portfolio",
  "Galeri Kami": "Our Gallery",

  // Section Headers & Titles
  "Layanan & keahlian": "Services & Expertise",
  "Layanan & Keahlian": "Services & Expertise",
  "Layanan Kami": "Our Services",
  "What We Do": "What We Do",
  "Our Services": "Our Services",
  "Cara kerja": "How It Works",
  "Hubungi kami": "Contact Us",
  "Hubungi Kami": "Contact Us",
  "Berita & Artikel": "Blog & News",
  "Blog & Berita": "Blog & News",
  "Berita Terbaru": "Latest News",
  "Meet Our Artists": "Meet Our Artists",
  "Artist Kami": "Meet Our Artists",
  "Temui Artist Kami": "Meet Our Artists",
  "Tim Kami": "Our Team",
  "Our Team": "Our Team",
  "Pertanyaan Umum": "Frequently Asked Questions",
  "Buat Janji Temu": "Book An Appointment",
  "Make An Appointment": "Make An Appointment",
  "Permintaan Terkirim": "Request Sent",
  "Pesan terkirim": "Message Sent",
  "Pesan Terkirim": "Message Sent",
  "Media Sosial": "Social Media",
  "Lokasi": "Location",
  "Berlangganan Newsletter Kami": "Subscribe To Our Newsletter",
  "Subscribe to our newsletter": "Subscribe to our newsletter",
  "Kata Klien Kami": "What Clients Say",
  "What Clients Say": "What Clients Say",
  "Testimoni": "Testimonial",

  // Hero & Subheadlines
  "Tato yang menceritakan siapa Anda.": "Tattoos that tell your story.",
  "Tato yang Menceritakan Siapa Anda": "Tattoos That Tell Your Story",
  "Eyes Wide Open": "Eyes Wide Open",
  "Studio tato profesional dengan fokus desain unik, konsultasi mendalam, dan standar keamanan tinggi.":
    "Professional tattoo studio focusing on unique designs, deep consultation, and high safety standards.",
  "Studio tato profesional dengan standar sterilisasi tinggi dan desain custom.":
    "Professional tattoo studio with high sterilization standards and custom designs.",
  "Konsultasi desain personal": "Personal design consultation",
  "Standar sterilisasi ketat": "Strict sterilization standards",
  "Artist berpengalaman": "Experienced artists",
  "Get a Tato": "Book Now",
  "Konsultasi Sekarang": "Book Now",
  "Buat Janji Konsultasi": "Book Consultation",
  "Lihat Portofolio": "View Portfolio",
  "Tato Like Art": "Tattoo Like Art",
  "Studio Seni Tato": "Tattoo Art Studio",
  "Desain Unik & Personal": "Unique & Personal Designs",
  "Karya Seni Tato": "Tattoo Artwork",
  "Desain Kustom Eksklusif": "Exclusive Custom Designs",
  "Studio Terpercaya": "Trusted Studio",
  "Aman & Steril": "Safe & Sterile",

  // Goals & About Us
  "Seni Tato Abadi": "Timeless Tattoo Art",
  "Setiap karya lahir dari konsultasi mendalam dengan klien, kemudian diwujudkan jadi tato yang personal dan tahan waktu.":
    "Every tattoo originates from in-depth client consultation, then transformed into a personal and timeless piece of art.",
  "Setiap tato lahir dari percakapan panjang dengan klien, kemudian kami terjemahkan menjadi karya yang personal, presisi, dan tahan waktu.":
    "Every tattoo originates from in-depth client consultation, then transformed into a personal, precise, and timeless piece of art.",
  "Unique Tatos": "Unique Tattoos",
  "Desain Kustom": "Custom Design",
  "Desain custom dibuat khusus untuk Anda.": "Custom designs tailored specifically for you.",
  "Desain dibuat khusus untuk setiap klien.": "Custom designs made specifically for each client.",
  "Piercing & Art": "Piercing & Art",
  "Piercing aman dan koleksi karya seni studio.": "Safe piercing and studio art collection.",
  "Standar sterilisasi tinggi dan aftercare lengkap.": "High sterilization standards and full aftercare.",
  "Standar sterilisasi tinggi & aftercare lengkap.": "High sterilization standards & full aftercare.",
  "Tim spesialis dengan portofolio nyata.": "Specialist team with a real portfolio.",

  // Overview & Features
  "Ruang yang nyaman untuk setiap cerita": "A comfortable space for every story",
  "Kami menghadirkan pengalaman studio yang mengutamakan kenyamanan, keamanan, dan ekspresi artistik.":
    "We deliver a studio experience prioritizing comfort, safety, and artistic expression.",
  "Dari konsep awal hingga aftercare, tim kami mendampingi setiap langkah perjalanan tato Anda.":
    "From initial concept to aftercare, our team guides every step of your tattoo journey.",
  "Kami merancang studio ini agar Anda merasa seperti di rumah. Jauh dari kesan intimidatif, kami menyambut setiap klien dengan suasana yang tenang dan profesional.":
    "We designed this studio so you feel right at home. Far from intimidating, we welcome every client with a calm and professional atmosphere.",
  "Dilengkapi peralatan sterilisasi kelas medis (autoclave), setiap jarum bersifat single-use dan dibuang setelah dipakai.":
    "Equipped with medical-grade sterilization equipment (autoclave), every needle is single-use and disposed of after use.",
  "Gaya Spesialis Tato": "Specialized Tattoo Styles",
  "Specific Style Tatos": "Specialized Tattoo Styles",
  "Pinup": "Pinup",
  "Gaya klasik dan bold.": "Classic and bold style.",
  "Japanese": "Japanese",
  "Motif tradisional dan modern.": "Traditional and modern motifs.",
  "Fine Line": "Fine Line",
  "Garis presisi dan detail halus.": "Precision lines and fine details.",
  "Blackwork": "Blackwork",
  "Kontras kuat dan geometris.": "Strong contrast and geometric shapes.",
  "Realism": "Realism",
  "Detail realistis dan shading dalam.": "Realistic details and deep shading.",
  "Custom": "Custom",
  "Desain sepenuhnya personal.": "Fully personalized designs.",
  "Exclusive Custom Design": "Exclusive Custom Design",
  "Desain eksklusif dibuat 100% untuk Anda.": "Exclusive designs 100% created for you.",
  "Vegan Ink": "Vegan Ink",
  "Tinta vegan premium yang aman untuk segala jenis kulit.": "Premium vegan ink safe for all skin types.",
  "Private Room": "Private Room",
  "Sesi privat tanpa gangguan untuk kenyamanan maksimal.": "Uninterrupted private sessions for maximum comfort.",
  "Aftercare Kit": "Aftercare Kit",
  "Panduan dan kit perawatan gratis setelah sesi selesai.": "Free aftercare guide and kit after the session.",

  // Services Cards
  "Tato": "Tattoo",
  "Piercing": "Piercing",
  "Custom design, blackwork, fine line, Japanese, hingga realism — dikerjakan oleh artist spesialis.":
    "Custom design, blackwork, fine line, Japanese, to realism — crafted by specialist artists.",
  "Piercing profesional dengan peralatan steril dan jewellery berkualitas.":
    "Professional piercing with sterile equipment and high-quality jewelry.",
  "Piercing profesional dengan peralatan steril.": "Professional piercing with sterile equipment.",
  "Konsultasi desain personal dari konsep hingga sketsa final sebelum eksekusi.":
    "Personal design consultation from concept to final sketch before execution.",
  "Koleksi karya seni dan merchandise studio.": "Studio art collection and merchandise.",
  "Learn More": "Learn More",
  "Read More": "Read More",
  "Selengkapnya": "Read More",

  // How It Works
  "Konsultasi": "Consultation",
  "Diskusikan ide, ukuran, dan penempatan.": "Discuss ideas, size, and placement.",
  "Diskusikan ide, ukuran, penempatan, dan estimasi harga via WhatsApp.":
    "Discuss ideas, size, placement, and price estimates via WhatsApp.",
  "DP & Jadwal": "Deposit & Schedule",
  "Amankan jadwal Anda dengan membayar Down Payment.": "Secure your slot by paying a Down Payment.",
  "Desain": "Design",
  "Review sketsa hingga Anda puas.": "Review sketches until you are satisfied.",
  "Kami menyiapkan desain kustom dan menunjukkannya sebelum hari H.":
    "We prepare custom designs and present them before the day.",
  "Sesi Tato": "Tattoo Session",
  "Proses dengan standar keamanan tinggi.": "Process with high safety standards.",
  "Datang ke studio, bersantai, dan biarkan kami mengerjakan keajaiban.":
    "Come to the studio, relax, and let us do the magic.",
  "Aftercare": "Aftercare",
  "Panduan perawatan pasca sesi.": "Post-session care guide.",
  "Empat langkah sederhana dari ide hingga tato selesai.":
    "Four simple steps from initial idea to completed tattoo.",

  // Creator & Artists
  "Artist Tato": "Tattoo Artist",
  "Tatoist": "Tattoo Artist",
  "Piercing Artist": "Piercing Artist",
  "Spesialis Fine Line": "Fine Line Specialist",
  "Fine Line Specialist": "Fine Line Specialist",
  "Artist Black & Grey": "Black & Grey Artist",
  "Black & Grey Artist": "Black & Grey Artist",
  "Spesialis blackwork dan custom piece dengan pengalaman lebih dari 8 tahun.":
    "Blackwork and custom piece specialist with over 8 years of experience.",
  "Seni tato bagi saya adalah tentang menerjemahkan emosi dan memori menjadi sebuah karya visual yang abadi. Dengan pengalaman lebih dari 8 tahun, fokus saya adalah memastikan setiap klien mendapatkan karya terbaik.":
    "Tattooing for me is about translating emotions and memories into a timeless visual piece. With over 8 years of experience, my focus is ensuring every client gets the best artwork.",
  "Tim artist berpengalaman siap mewujudkan desain impian Anda.":
    "Experienced team of artists ready to realize your dream design.",

  // Testimonials & Stats
  "2.500+ Tato Selesai": "2,500+ Tattoos Done",
  "1.800+ Klien Puas": "1,800+ Happy Clients",
  "15 Tahun Pengalaman": "15 Years Experience",
  "50+ Desain Kustom": "50+ Custom Designs",
  "Tato Selesai": "Tattoos Done",
  "Klien Puas": "Happy Clients",
  "Tahun Pengalaman": "Years Experience",
  "Pengalaman tato terbaik yang pernah saya punya. Artist sangat profesional dan studionya nyaman.":
    "Best tattoo experience I've ever had. Very professional artist and comfortable studio.",
  "Studio bersih, suasana tenang, dan hasil akhirnya melebihi ekspektasi saya.":
    "Clean studio, quiet atmosphere, and the end result exceeded my expectations.",
  "Konsultasi mendalam, desainnya benar-benar personal — saya akan kembali untuk piece berikutnya.":
    "In-depth consultation, truly personal design — I'll be back for my next piece.",
  "Tato Pertama": "First Tattoo",
  "Cover-up": "Cover-up",
  "Sleeve": "Sleeve",

  // Latest News & Newsletter
  "Cara Merawat Tato Baru Agar Tahan Lama": "How To Care For Your New Tattoo",
  "Memilih Gaya Tato Yang Tepat Untuk Anda": "Choosing The Right Tattoo Style",
  "Di Balik Tinta: Tur Studio Kami": "Behind The Ink: Studio Tour",
  "Perawatan": "Aftercare",
  "Gaya Tato": "Tattoo Style",
  "Studio": "Studio",
  "Dapatkan info promo, event, dan inspirasi tato terbaru langsung ke email Anda.":
    "Get the latest promos, events, and tattoo inspiration straight to your inbox.",
  "Masukkan email Anda": "Enter your email",
  "Berlangganan": "Subscribe",
  "Lihat Semua": "View All",

  // FAQ & Form Strings
  "Apakah perlu konsultasi dulu?": "Do I need a consultation first?",
  "Ya, kami merekomendasikan konsultasi sebelum sesi.": "Yes, we recommend a consultation before the session.",
  "Berapa biaya untuk membuat tato?": "How much does a tattoo cost?",
  "Biaya bervariasi tergantung ukuran, detail, dan penempatan. Harga minimal di studio kami adalah Rp 500.000. Hubungi kami untuk estimasi lebih akurat.":
    "Costs vary depending on size, detail, and placement. Our minimum price is IDR 500,000. Contact us for a precise quote.",
  "Apakah alatnya steril dan aman?": "Are the tools sterile and safe?",
  "Ya, kami sangat ketat mengenai sterilisasi. Semua jarum, tube, dan perlengkapan bersifat sekali pakai (single-use). Kami juga menggunakan autoclave untuk peralatan yang dapat digunakan kembali.":
    "Yes, we strictly follow sterilization protocols. All needles, tubes, and equipment are single-use disposable or autoclaved.",
  "Bolehkah membawa desain sendiri?": "Can I bring my own design?",
  "Tentu. Anda bisa membawa referensi, lalu kami akan mendesain ulangnya agar sesuai dengan kontur tubuh dan gaya artistik kami untuk hasil yang maksimal.":
    "Of course. You can bring reference ideas and we will re-design them to suit your body placement for the best results.",
  "Bagaimana cara merawat tato baru?": "How do I care for a new tattoo?",
  "Kami akan memberikan instruksi lengkap setelah sesi selesai, beserta rekomendasi salep aftercare yang aman untuk kulit.":
    "We will provide complete aftercare instructions along with skin-safe ointment recommendations after your session.",
  "Berapa lama proses healing?": "How long is the healing process?",
  "Umumnya 2-4 minggu tergantung ukuran dan area.": "Generally 2-4 weeks depending on size and area.",
  "Apakah bisa cover-up?": "Can I get a cover-up?",
  "Bisa, setelah review desain lama di konsultasi.": "Yes, after reviewing the old design in a consultation.",
  "Minimal usia?": "Minimum age?",
  "Minimal 18 tahun dengan identitas valid.": "Minimum 18 years old with valid ID.",

  "Isi formulir untuk konsultasi dan penjadwalan sesi. Anda juga bisa hubungi kami via WhatsApp, Instagram, atau email.":
    "Fill out the form for consultation and session scheduling. You can also contact us via WhatsApp, Instagram, or email.",
  "Isi formulir di bawah untuk konsultasi dan penjadwalan sesi tato.":
    "Fill out the form below for consultation and tattoo session scheduling.",
  "Siap mengukir cerita Anda?": "Ready to carve your story?",
  "Jadwal konsultasi kami cepat penuh. Booking slot Anda sekarang sebelum kehabisan.":
    "Our consultation schedule fills up quickly. Book your slot now before it's gone.",
  "Hubungi Kami Untuk Estimasi Biaya": "Contact Us For A Quote",
  "Buat janji konsultasi dan wujudkan desain tato impian Anda.":
    "Book a consultation appointment and make your dream tattoo a reality.",
  "Konsultasi via WA": "Consult via WA",
  "Booking via WhatsApp": "Book via WhatsApp",
  "Get a Quote via WA": "Get a Quote via WhatsApp",
  "Punya pertanyaan atau ingin konsultasi? Kirim pesan dan kami akan segera menghubungi Anda.":
    "Have questions or want a consultation? Send us a message and we will get back to you shortly.",
  "Kirim Pesan": "Send Message",
  "Kirim Permintaan": "Send Request",
  "Mengirim…": "Sending…",
  "Apakah Anda berusia 18 tahun atau lebih?": "Are you 18 years old or older?",
  "Studio Tato": "Tattoo Studio",
  "Tato Studio": "Tattoo Studio",
  "Studio tato profesional dengan fokus desain unik, sterilisasi ketat, dan ekspresi artistik personal.":
    "Professional tattoo studio focusing on unique designs, strict sterilization, and personal artistic expression.",
  "Peta lokasi dinonaktifkan. Aktifkan fitur peta lokasi pada panel kustomisasi footer.":
    "Location map is disabled. Enable location map in footer settings."
}

// Reverse dictionary mapping English -> Indonesian
const EN_TO_ID_MAP: Record<string, string> = {}
for (const [idStr, enStr] of Object.entries(ID_TO_EN_MAP)) {
  EN_TO_ID_MAP[enStr] = idStr
}

/**
 * Returns localized string from block data object.
 * If locale is 'en':
 *  1. Uses `fieldName_en` if present and non-empty.
 *  2. Checks exact dictionary match in ID_TO_EN_MAP.
 *  3. Checks prefix/pattern rules for studio descriptions & common copy.
 *  4. Uses fallback if provided and distinct from ID string.
 *  5. Falls back to original string.
 */
export function getLocalizedText(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  fieldName: string,
  locale: Locale | string = "id",
  fallback: string = ""
): string {
  if (!data) return fallback

  const enVal = data[`${fieldName}_en`]
  const idVal = data[fieldName]

  if (locale === "en") {
    // 1. Explicit English value saved in block data
    if (typeof enVal === "string" && enVal.trim() !== "") {
      return enVal
    }

    // 2. Direct dictionary lookup for exact ID text
    if (typeof idVal === "string" && ID_TO_EN_MAP[idVal.trim()]) {
      return ID_TO_EN_MAP[idVal.trim()]
    }

    // 3. Pattern / prefix rules for common sentences & studio descriptions
    if (typeof idVal === "string") {
      const trimmed = idVal.trim()
      if (trimmed.startsWith("Studio ini dirancang")) {
        return "This studio is thoughtfully designed to evoke a sense of calm and inspiration, creating a relaxed environment for your tattoo journey."
      }
      if (trimmed.startsWith("Studio ini memadukan")) {
        return "This studio combines its function as a design consultation space and sterile clinic, ensuring every client feels comfortable and safe."
      }
      if (trimmed.startsWith("Studio tato")) {
        return trimmed
          .replace(/Studio tato/gi, "Tattoo studio")
          .replace(/\bdengan\b/gi, "with")
          .replace(/\bdan\b/gi, "and")
          .replace(/\bdi\b/gi, "in")
      }
    }

    // 4. If an English fallback parameter was provided and is distinct
    if (fallback && fallback.trim() !== "" && fallback !== idVal) {
      return fallback
    }

    // 5. Fallback to raw value
    if (typeof idVal === "string" && idVal.trim() !== "") {
      return idVal
    }

    return fallback
  }

  // locale === "id"
  if (typeof idVal === "string" && idVal.trim() !== "") {
    return idVal
  }

  // Reverse dictionary lookup if only English is present in idVal
  if (typeof idVal === "string" && EN_TO_ID_MAP[idVal.trim()]) {
    return EN_TO_ID_MAP[idVal.trim()]
  }

  return fallback
}
