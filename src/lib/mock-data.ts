import type {
  Studio,
  Lead,
  Subscription,
  Invoice,
  TeamMember,
  AnalyticsSummary,
  DailyAnalytics,
  Plan,
  Block,
} from "./types"

// ─── Studios ──────────────────────────────────────────────

export const MOCK_STUDIOS: Studio[] = [
  {
    id: "1",
    slug: "ink-and-iron",
    name: "Ink & Iron Studio",
    city: "Jakarta",
    waNumber: "6281234567890",
    description:
      "Studio premium dengan fokus blackwork tajam dan realism detail untuk sleeve maupun custom piece.",
    image:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop",
    viewCount: 1205,
    clickCount: 340,
    isTrusted: true,
    isPublished: true,
    tags: ["Blackwork", "Realism"],
    artist: "Bima Aditya",
    blocks: [
      {
        id: "header-1",
        type: "Header",
        data: { title: "Ink & Iron", ctaText: "Book Appointment" },
        visible: true,
      },
      {
        id: "hero-1",
        type: "Hero",
        data: {
          headline: "Blackwork & Realism Specialist.",
          subheadline:
            "Program konsultasi terstruktur bersama artist profesional untuk mengubah ide Anda menjadi desain tattoo matang, personal, dan aman.",
          ctaText: "Hubungi via WA",
          benefits: [
            "Konsultasi konsep 1-on-1 sebelum tattoo",
            "Standar sterilisasi tinggi untuk tiap sesi",
            "Review desain dan aftercare guidance lengkap",
          ],
          creator: "Bima Aditya",
          image:
            "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop",
        },
        visible: true,
      },
      {
        id: "goals-1",
        type: "Goals",
        data: {
          headline: "Mengapa Memilih Kami?",
          description:
            "Bukan sekadar studio tato biasa. Kami menghadirkan pengalaman premium yang mengutamakan keamanan, kenyamanan, dan hasil seni yang presisi.",
          features: [
            {
              title: "Sterilisasi Kelas Medis",
              desc: "Autoclave grade-B dan jarum single-use untuk keamanan maksimal.",
            },
            {
              title: "Desain Kustom 100%",
              desc: "Setiap karya dirancang personal, tidak ada template duplikat.",
            },
            {
              title: "Konsultasi Mendalam",
              desc: "Diskusi konsep, penempatan, dan sizing sebelum sesi dimulai.",
            },
          ],
        },
        visible: true,
      },
      {
        id: "overview-1",
        type: "Overview",
        data: {
          headline: "Ruang Studio yang Nyaman",
          content1:
            "Kami merancang studio ini agar Anda merasa seperti di rumah. Jauh dari kesan intimidatif, kami menyambut setiap klien dengan suasana yang tenang dan profesional.",
          content2:
            "Dilengkapi dengan peralatan sterilisasi kelas medis (autoclave), setiap jarum bersifat single-use dan dibuang setelah dipakai.",
        },
        visible: true,
      },
      {
        id: "features-1",
        type: "Features",
        data: {
          title: "Layanan & Keahlian",
          items: [
            {
              title: "Custom Design",
              desc: "Desain eksklusif dibuat 100% untuk Anda.",
            },
            {
              title: "Vegan Ink",
              desc: "Menggunakan tinta vegan premium yang aman.",
            },
            {
              title: "Private Room",
              desc: "Sesi privat tanpa gangguan untuk kenyamanan maksimal.",
            },
            {
              title: "Aftercare Kit",
              desc: "Panduan dan kit perawatan gratis setelah tato selesai.",
            },
            {
              title: "Touch Up Gratis",
              desc: "Garansi touch-up gratis 1x dalam 3 bulan pertama.",
            },
            {
              title: "Portfolio Review",
              desc: "Lihat hasil karya kami sebelum memutuskan.",
            },
          ],
        },
        visible: true,
      },
      {
        id: "howitworks-1",
        type: "HowItWorks",
        data: {
          steps: [
            {
              title: "Konsultasi",
              desc: "Diskusikan ide, ukuran, penempatan, dan estimasi harga via WhatsApp.",
            },
            {
              title: "DP & Jadwal",
              desc: "Amankan jadwal Anda dengan membayar Down Payment (DP).",
            },
            {
              title: "Desain",
              desc: "Kami akan menyiapkan desain kustom dan menunjukkannya sebelum hari H.",
            },
            {
              title: "Sesi Tato",
              desc: "Datang ke studio, bersantai, dan biarkan kami mengerjakan keajaiban.",
            },
          ],
        },
        visible: true,
      },
      {
        id: "creatorbio-1",
        type: "CreatorBio",
        data: {
          name: "Bima Aditya",
          role: "Lead Artist & Founder",
          bio: "Seni tato bagi saya adalah tentang menerjemahkan emosi dan memori menjadi sebuah karya visual yang abadi. Dengan pengalaman lebih dari 8 tahun, fokus saya adalah memastikan setiap klien mendapatkan karya terbaik.",
          image:
            "https://images.unsplash.com/photo-1542382257-80da9fb9f5abc?q=80&w=400&auto=format&fit=crop",
        },
        visible: true,
      },
      {
        id: "testimonials-1",
        type: "Testimonials",
        data: {
          reviews: [
            {
              text: "Hasilnya jauh di luar ekspektasi! Studio sangat bersih dan nyaman.",
              name: "Andi R.",
              type: "First Tattoo",
            },
            {
              text: "Detail linework yang luar biasa rapi. Prosesnya juga cepat dan tidak terlalu sakit.",
              name: "Siska M.",
              type: "Sleeve Project",
            },
            {
              text: "Sangat profesional. Dari proses konsultasi desain hingga eksekusi benar-benar mantap.",
              name: "Reza F.",
              type: "Cover Up",
            },
            {
              text: "Baru pertama kali tato, tapi langsung merasa nyaman. Hasil karyanya detail banget.",
              name: "Dian K.",
              type: "Fine Line",
            },
            {
              text: "Desain custom-nya benar-benar unik. Tidak pernah lihat yang serupa di manapun.",
              name: "Fajar P.",
              type: "Geometric",
            },
            {
              text: "Proses booking sampai sesi sangat smooth. Tim-nya ramah dan profesional.",
              name: "Maya S.",
              type: "Realism Portrait",
            },
          ],
        },
        visible: true,
      },
      {
        id: "faq-1",
        type: "FAQ",
        data: {
          faqs: [
            {
              q: "Berapa biaya untuk membuat tato?",
              a: "Biaya bervariasi tergantung ukuran, detail, dan penempatan. Harga minimal di studio kami adalah Rp 500.000. Hubungi kami untuk estimasi lebih akurat.",
            },
            {
              q: "Apakah alatnya steril dan aman?",
              a: "Ya, kami sangat ketat mengenai sterilisasi. Semua jarum, tube, dan perlengkapan bersifat sekali pakai (single-use). Kami juga menggunakan autoclave untuk peralatan yang dapat digunakan kembali.",
            },
            {
              q: "Bolehkah membawa desain sendiri?",
              a: "Tentu. Anda bisa membawa referensi, lalu kami akan mendesain ulangnya agar sesuai dengan kontur tubuh dan gaya artistik kami untuk hasil yang maksimal.",
            },
            {
              q: "Bagaimana cara merawat tato baru?",
              a: "Kami akan memberikan instruksi lengkap setelah sesi selesai, beserta rekomendasi salep aftercare yang aman untuk kulit.",
            },
            {
              q: "Apakah bisa request revisi desain?",
              a: "Bisa. Kami menyediakan hingga 2x revisi desain sebelum sesi dimulai untuk memastikan Anda 100% puas.",
            },
            {
              q: "Berapa lama proses penyembuhan?",
              a: "Umumnya 2-4 minggu untuk lapisan luar, dan hingga 3 bulan untuk penyembuhan sempurna. Ikuti panduan aftercare kami.",
            },
            {
              q: "Apakah studio buka setiap hari?",
              a: "Kami buka Selasa - Minggu, pukul 11:00 - 21:00 WIB. Senin tutup untuk sterilisasi menyeluruh.",
            },
            {
              q: "Bagaimana sistem pembayaran?",
              a: "DP 50% saat booking, pelunasan sebelum atau sesudah sesi. Kami menerima transfer bank dan e-wallet.",
            },
          ],
        },
        visible: true,
      },
      {
        id: "finalcta-1",
        type: "FinalCTA",
        data: {
          headline: "Siap Mengukir Cerita?",
          subheadline:
            "Jadwal konsultasi kami cepat penuh. Booking slot Anda sekarang sebelum kehabisan.",
          ctaText: "Booking Sekarang via WA",
        },
        visible: true,
      },
      {
        id: "footer-1",
        type: "Footer",
        data: {
          title: "Ink & Iron Studio",
          address: "Jl. Sudirman No. 123, Menteng, Jakarta Pusat",
          instagram: "https://instagram.com/inkandiron",
          whatsapp: "6281234567890",
          email: "hello@inkandiron.id",
        },
        visible: true,
      },
    ],
  },
  {
    id: "2",
    slug: "sacred-ink-bali",
    name: "Sacred Ink",
    city: "Bali",
    waNumber: "6289876543210",
    description:
      "Menghadirkan nuansa tribal-modern Bali dengan standar sterilisasi dan konsultasi mendalam.",
    image:
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop",
    viewCount: 890,
    clickCount: 210,
    isTrusted: true,
    isPublished: true,
    tags: ["Traditional", "Tribal"],
    artist: "Ayu Putri",
    blocks: [
      {
        id: "header-2",
        type: "Header",
        data: { title: "Sacred Ink", ctaText: "Book Now" },
        visible: true,
      },
      {
        id: "hero-2",
        type: "Hero",
        data: {
          headline: "Tribal Modern dari Pulau Dewata.",
          subheadline:
            "Menggabungkan warisan seni tradisional Bali dengan teknik modern untuk karya tato yang bermakna dan abadi.",
          ctaText: "Chat via WhatsApp",
          creator: "Ayu Putri",
          image:
            "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=900&auto=format&fit=crop",
        },
        visible: true,
      },
      {
        id: "goals-2",
        type: "Goals",
        data: {
          headline: "Filosofi Kami",
          description:
            "Setiap tato memiliki cerita. Kami menghormati tradisi sambil mengadaptasi teknik kontemporer.",
          features: [
            { title: "Warisan Budaya", desc: "Motif terinspirasi dari seni ukir dan batik Bali." },
            { title: "Teknik Modern", desc: "Peralatan terkini dengan standar internasional." },
            { title: "Konsultasi Spiritual", desc: "Diskusi makna dan simbolisme sebelum sesi." },
          ],
        },
        visible: true,
      },
      { id: "overview-2", type: "Overview", data: {}, visible: true },
      { id: "features-2", type: "Features", data: {}, visible: true },
      { id: "howitworks-2", type: "HowItWorks", data: {}, visible: true },
      {
        id: "creatorbio-2",
        type: "CreatorBio",
        data: {
          name: "Ayu Putri",
          role: "Lead Artist & Cultural Advisor",
          bio: "Tumbuh di keluarga seniman Bali, saya mendalami seni tato sebagai bentuk ekspresi budaya modern. Setiap karya saya adalah jembatan antara tradisi dan kontemporer.",
        },
        visible: true,
      },
      { id: "testimonials-2", type: "Testimonials", data: {}, visible: true },
      { id: "faq-2", type: "FAQ", data: {}, visible: true },
      { id: "finalcta-2", type: "FinalCTA", data: {}, visible: true },
      {
        id: "footer-2",
        type: "Footer",
        data: { title: "Sacred Ink Bali", address: "Jl. Raya Ubud No. 45, Gianyar, Bali" },
        visible: true,
      },
    ],
  },
  {
    id: "3",
    slug: "needles-and-co",
    name: "Needles & Co.",
    city: "Bandung",
    waNumber: "6282345678901",
    description:
      "Spesialis fine line dan line art clean untuk tattoo personal yang subtle namun berkarakter.",
    image:
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=800&auto=format&fit=crop",
    viewCount: 650,
    clickCount: 125,
    isTrusted: false,
    isPublished: true,
    tags: ["Minimalist", "Fine Line"],
    artist: "Fajar N",
    blocks: [
      {
        id: "header-3",
        type: "Header",
        data: { title: "Needles & Co.", ctaText: "Get Inked" },
        visible: true,
      },
      {
        id: "hero-3",
        type: "Hero",
        data: {
          headline: "Minimalis. Presisi. Personal.",
          subheadline:
            "Fine line art yang clean dan detail untuk Anda yang menghargai kesederhanaan bermakna.",
          ctaText: "Konsultasi Gratis",
          creator: "Fajar N",
          image:
            "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=900&auto=format&fit=crop",
        },
        visible: true,
      },
      { id: "goals-3", type: "Goals", data: {}, visible: true },
      { id: "overview-3", type: "Overview", data: {}, visible: true },
      { id: "features-3", type: "Features", data: {}, visible: true },
      { id: "howitworks-3", type: "HowItWorks", data: {}, visible: true },
      { id: "creatorbio-3", type: "CreatorBio", data: { name: "Fajar N", role: "Artist & Founder" }, visible: true },
      { id: "testimonials-3", type: "Testimonials", data: {}, visible: true },
      { id: "faq-3", type: "FAQ", data: {}, visible: true },
      { id: "finalcta-3", type: "FinalCTA", data: {}, visible: true },
      {
        id: "footer-3",
        type: "Footer",
        data: { title: "Needles & Co.", address: "Jl. Braga No. 88, Bandung" },
        visible: true,
      },
    ],
  },
  {
    id: "4",
    slug: "sby-inkcraft",
    name: "SBY Inkcraft",
    city: "Surabaya",
    waNumber: "6283456789012",
    description:
      "Karya japanese-inspired color tattoo dengan storytelling visual yang kuat dan kontras.",
    image:
      "https://images.unsplash.com/photo-1550537687-c91070c4e58f?q=80&w=800&auto=format&fit=crop",
    viewCount: 430,
    clickCount: 98,
    isTrusted: true,
    isPublished: true,
    tags: ["Japanese", "Color"],
    artist: "Chandra",
    blocks: [
      {
        id: "header-4",
        type: "Header",
        data: { title: "SBY Inkcraft", ctaText: "Book Session" },
        visible: true,
      },
      {
        id: "hero-4",
        type: "Hero",
        data: {
          headline: "Japanese Art. Indonesian Soul.",
          subheadline:
            "Color tattoo dengan inspirasi ukiyo-e dan storytelling visual yang kuat.",
          ctaText: "WhatsApp Kami",
          creator: "Chandra",
        },
        visible: true,
      },
      { id: "goals-4", type: "Goals", data: {}, visible: true },
      { id: "overview-4", type: "Overview", data: {}, visible: true },
      { id: "features-4", type: "Features", data: {}, visible: true },
      { id: "howitworks-4", type: "HowItWorks", data: {}, visible: true },
      { id: "creatorbio-4", type: "CreatorBio", data: { name: "Chandra", role: "Senior Artist" }, visible: true },
      { id: "testimonials-4", type: "Testimonials", data: {}, visible: true },
      { id: "faq-4", type: "FAQ", data: {}, visible: true },
      { id: "finalcta-4", type: "FinalCTA", data: {}, visible: true },
      {
        id: "footer-4",
        type: "Footer",
        data: { title: "SBY Inkcraft", address: "Jl. Tunjungan No. 55, Surabaya" },
        visible: true,
      },
    ],
  },
  {
    id: "5",
    slug: "nocturnal-tattoo",
    name: "Nocturnal Tattoo",
    city: "Jakarta",
    waNumber: "6284567890123",
    description:
      "Studio dark surreal dengan custom concept dari moodboard hingga final execution.",
    image:
      "https://images.unsplash.com/photo-1542382257-80da9fb9f5abc?q=80&w=800&auto=format&fit=crop",
    viewCount: 1540,
    clickCount: 450,
    isTrusted: true,
    isPublished: true,
    tags: ["Dark Surrealism"],
    artist: "Naya Safira",
    blocks: [
      {
        id: "header-5",
        type: "Header",
        data: { title: "Nocturnal Tattoo", ctaText: "Explore" },
        visible: true,
      },
      {
        id: "hero-5",
        type: "Hero",
        data: {
          headline: "Dark Art. Deep Meaning.",
          subheadline:
            "Surealisme gelap yang memadukan imajinasi dan emosi ke dalam karya tato yang tak terlupakan.",
          ctaText: "Konsultasi via WA",
          creator: "Naya Safira",
        },
        visible: true,
      },
      { id: "goals-5", type: "Goals", data: {}, visible: true },
      { id: "overview-5", type: "Overview", data: {}, visible: true },
      { id: "features-5", type: "Features", data: {}, visible: true },
      { id: "howitworks-5", type: "HowItWorks", data: {}, visible: true },
      {
        id: "creatorbio-5",
        type: "CreatorBio",
        data: { name: "Naya Safira", role: "Creative Director & Artist" },
        visible: true,
      },
      { id: "testimonials-5", type: "Testimonials", data: {}, visible: true },
      { id: "faq-5", type: "FAQ", data: {}, visible: true },
      { id: "finalcta-5", type: "FinalCTA", data: {}, visible: true },
      {
        id: "footer-5",
        type: "Footer",
        data: { title: "Nocturnal Tattoo", address: "Jl. Kemang Raya No. 12, Jakarta Selatan" },
        visible: true,
      },
    ],
  },
  {
    id: "6",
    slug: "island-ink",
    name: "Island Ink",
    city: "Bali",
    waNumber: "6285678901234",
    description:
      "Geometric dan dotwork presisi tinggi untuk klien yang mencari pattern tattoo modern.",
    image:
      "https://images.unsplash.com/photo-1621360841013-c76831f12250?q=80&w=800&auto=format&fit=crop",
    viewCount: 720,
    clickCount: 180,
    isTrusted: false,
    isPublished: true,
    tags: ["Geometric", "Dotwork"],
    artist: "Bayu Pratama",
    blocks: [
      {
        id: "header-6",
        type: "Header",
        data: { title: "Island Ink", ctaText: "Book Now" },
        visible: true,
      },
      {
        id: "hero-6",
        type: "Hero",
        data: {
          headline: "Presisi Geometris. Harmoni Visual.",
          subheadline: "Dotwork dan geometric art yang memadukan matematika dengan seni tubuh.",
          ctaText: "Hubungi Kami",
          creator: "Bayu Pratama",
        },
        visible: true,
      },
      { id: "goals-6", type: "Goals", data: {}, visible: true },
      { id: "overview-6", type: "Overview", data: {}, visible: true },
      { id: "features-6", type: "Features", data: {}, visible: true },
      { id: "howitworks-6", type: "HowItWorks", data: {}, visible: true },
      { id: "creatorbio-6", type: "CreatorBio", data: { name: "Bayu Pratama", role: "Geometric Specialist" }, visible: true },
      { id: "testimonials-6", type: "Testimonials", data: {}, visible: true },
      { id: "faq-6", type: "FAQ", data: {}, visible: true },
      { id: "finalcta-6", type: "FinalCTA", data: {}, visible: true },
      {
        id: "footer-6",
        type: "Footer",
        data: { title: "Island Ink", address: "Jl. Pantai Kuta No. 77, Bali" },
        visible: true,
      },
    ],
  },
  {
    id: "7",
    slug: "semarang-ink-house",
    name: "Semarang Ink House",
    city: "Semarang",
    waNumber: "6286789012345",
    description:
      "Studio tato keluarga dengan fokus pada new school dan watercolor tattoo yang vibrant.",
    image:
      "https://images.unsplash.com/photo-1590246814883-57c511e76a29?q=80&w=800&auto=format&fit=crop",
    viewCount: 310,
    clickCount: 72,
    isTrusted: false,
    isPublished: true,
    tags: ["New School", "Watercolor"],
    artist: "Galih Wicaksono",
    blocks: [
      { id: "header-7", type: "Header", data: { title: "Semarang Ink House" }, visible: true },
      { id: "hero-7", type: "Hero", data: { headline: "Warna adalah Segalanya." }, visible: true },
      { id: "goals-7", type: "Goals", data: {}, visible: true },
      { id: "overview-7", type: "Overview", data: {}, visible: true },
      { id: "features-7", type: "Features", data: {}, visible: true },
      { id: "howitworks-7", type: "HowItWorks", data: {}, visible: true },
      { id: "creatorbio-7", type: "CreatorBio", data: { name: "Galih Wicaksono" }, visible: true },
      { id: "testimonials-7", type: "Testimonials", data: {}, visible: true },
      { id: "faq-7", type: "FAQ", data: {}, visible: true },
      { id: "finalcta-7", type: "FinalCTA", data: {}, visible: true },
      { id: "footer-7", type: "Footer", data: { title: "Semarang Ink House", address: "Jl. Pemuda No. 33, Semarang" }, visible: true },
    ],
  },
  {
    id: "8",
    slug: "yogya-tattoo-collective",
    name: "Yogya Tattoo Collective",
    city: "Yogyakarta",
    waNumber: "6287890123456",
    description:
      "Kolektif seniman tato Yogya yang menggabungkan seni rupa tradisional Jawa dengan teknik tato modern.",
    image:
      "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=800&auto=format&fit=crop",
    viewCount: 520,
    clickCount: 145,
    isTrusted: true,
    isPublished: true,
    tags: ["Traditional", "Blackwork", "Cultural"],
    artist: "Kolektif YTC",
    blocks: [
      { id: "header-8", type: "Header", data: { title: "Yogya Tattoo Collective" }, visible: true },
      { id: "hero-8", type: "Hero", data: { headline: "Seni Rupa. Seni Kulit." }, visible: true },
      { id: "goals-8", type: "Goals", data: {}, visible: true },
      { id: "overview-8", type: "Overview", data: {}, visible: true },
      { id: "features-8", type: "Features", data: {}, visible: true },
      { id: "howitworks-8", type: "HowItWorks", data: {}, visible: true },
      { id: "creatorbio-8", type: "CreatorBio", data: { name: "Kolektif YTC", role: "Artist Collective" }, visible: true },
      { id: "testimonials-8", type: "Testimonials", data: {}, visible: true },
      { id: "faq-8", type: "FAQ", data: {}, visible: true },
      { id: "finalcta-8", type: "FinalCTA", data: {}, visible: true },
      { id: "footer-8", type: "Footer", data: { title: "Yogya Tattoo Collective", address: "Jl. Malioboro No. 10, Yogyakarta" }, visible: true },
    ],
  },
  {
    id: "9",
    slug: "medan-ink-lab",
    name: "Medan Ink Lab",
    city: "Medan",
    waNumber: "6288901234567",
    description:
      "Laboratorium tato eksperimental Medan dengan fokus pada portrait realism dan micro tattoo.",
    image:
      "https://images.unsplash.com/photo-1523500705334-6ea392b31b4d?q=80&w=800&auto=format&fit=crop",
    viewCount: 280,
    clickCount: 65,
    isTrusted: false,
    isPublished: true,
    tags: ["Realism", "Micro Tattoo", "Portrait"],
    artist: "Danny Siregar",
    blocks: [
      { id: "header-9", type: "Header", data: { title: "Medan Ink Lab" }, visible: true },
      { id: "hero-9", type: "Hero", data: { headline: "Realism Tingkat Tinggi." }, visible: true },
      { id: "goals-9", type: "Goals", data: {}, visible: true },
      { id: "overview-9", type: "Overview", data: {}, visible: true },
      { id: "features-9", type: "Features", data: {}, visible: true },
      { id: "howitworks-9", type: "HowItWorks", data: {}, visible: true },
      { id: "creatorbio-9", type: "CreatorBio", data: { name: "Danny Siregar" }, visible: true },
      { id: "testimonials-9", type: "Testimonials", data: {}, visible: true },
      { id: "faq-9", type: "FAQ", data: {}, visible: true },
      { id: "finalcta-9", type: "FinalCTA", data: {}, visible: true },
      { id: "footer-9", type: "Footer", data: { title: "Medan Ink Lab", address: "Jl. Asia No. 21, Medan" }, visible: true },
    ],
  },
  {
    id: "10",
    slug: "makassar-tattoo-house",
    name: "Makassar Tattoo House",
    city: "Makassar",
    waNumber: "6289012345678",
    description:
      "Studio tato pertama di Makassar dengan sertifikasi sterilisasi dan fokus pada blackwork ornamental.",
    image:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop",
    viewCount: 195,
    clickCount: 42,
    isTrusted: true,
    isPublished: true,
    tags: ["Blackwork", "Ornamental"],
    artist: "Rizki Anwar",
    blocks: [
      { id: "header-10", type: "Header", data: { title: "Makassar Tattoo House" }, visible: true },
      { id: "hero-10", type: "Hero", data: { headline: "Ornamental Excellence." }, visible: true },
      { id: "goals-10", type: "Goals", data: {}, visible: true },
      { id: "overview-10", type: "Overview", data: {}, visible: true },
      { id: "features-10", type: "Features", data: {}, visible: true },
      { id: "howitworks-10", type: "HowItWorks", data: {}, visible: true },
      { id: "creatorbio-10", type: "CreatorBio", data: { name: "Rizki Anwar" }, visible: true },
      { id: "testimonials-10", type: "Testimonials", data: {}, visible: true },
      { id: "faq-10", type: "FAQ", data: {}, visible: true },
      { id: "finalcta-10", type: "FinalCTA", data: {}, visible: true },
      { id: "footer-10", type: "Footer", data: { title: "Makassar Tattoo House", address: "Jl. Somba Opu No. 15, Makassar" }, visible: true },
    ],
  },
]

// ─── Current User Studio (for dashboard/builder context) ──

export const CURRENT_STUDIO = MOCK_STUDIOS[0]

// ─── Leads ────────────────────────────────────────────────

export const MOCK_LEADS: Lead[] = [
  { id: "l1", studioId: "1", name: "Ahmad Rizky", email: "ahmad@gmail.com", message: "Halo, saya tertarik untuk konsultasi desain tato geometrik di area lengan. Bisa appointment minggu depan?", status: "new", createdAt: "2026-06-04T10:30:00Z" },
  { id: "l2", studioId: "1", name: "Sarah Dewi", email: "sarah.d@yahoo.com", message: "Mau tanya harga untuk cover up tato lama ukuran 10x15cm di punggung?", status: "read", createdAt: "2026-06-03T14:20:00Z" },
  { id: "l3", studioId: "1", name: "Budi Santoso", email: null, message: "Berapa lama proses untuk full sleeve blackwork? Dan bisa cicil sesi-nya?", status: "replied", createdAt: "2026-06-02T09:15:00Z" },
  { id: "l4", studioId: "1", name: "Lisa Anggraini", email: "lisa.a@gmail.com", message: "Saya mau bikin tato pertama, fine line kecil di pergelangan tangan. Bisa konsultasi dulu?", status: "new", createdAt: "2026-06-01T16:45:00Z" },
  { id: "l5", studioId: "1", name: "Rendi Prasetyo", email: "rendi.p@outlook.com", message: "Ada slot kosong untuk minggu ini? Mau lanjutin sesi sleeve sebelumnya.", status: "read", createdAt: "2026-05-31T11:00:00Z" },
  { id: "l6", studioId: "1", name: "Mega Putri", email: null, message: "Halo, apakah bisa tato watercolor style? Referensi desainnya sudah saya siapkan.", status: "new", createdAt: "2026-05-30T08:30:00Z" },
  { id: "l7", studioId: "1", name: "Dimas Kurniawan", email: "dimas.k@gmail.com", message: "Mau konsultasi untuk japanese sleeve. Budget sekitar 5-7 juta, feasible?", status: "replied", createdAt: "2026-05-28T13:00:00Z" },
]

// ─── Subscription ─────────────────────────────────────────

export const MOCK_SUBSCRIPTION: Subscription = {
  id: "sub-1",
  studioId: "1",
  planType: "6months",
  status: "active",
  expiresAt: "2026-12-04T00:00:00Z",
  createdAt: "2026-06-04T00:00:00Z",
}

// ─── Invoices ─────────────────────────────────────────────

export const MOCK_INVOICES: Invoice[] = [
  { id: "inv-1", studioId: "1", planType: "Pro (6 Bulan)", amount: 449000, status: "paid", paidAt: "2026-06-04T10:00:00Z", createdAt: "2026-06-04T09:55:00Z" },
  { id: "inv-2", studioId: "1", planType: "Growth (3 Bulan)", amount: 249000, status: "paid", paidAt: "2026-03-04T10:00:00Z", createdAt: "2026-03-04T09:50:00Z" },
  { id: "inv-3", studioId: "1", planType: "Starter (1 Bulan)", amount: 99000, status: "paid", paidAt: "2025-12-04T10:00:00Z", createdAt: "2025-12-04T09:45:00Z" },
]

// ─── Team Members ─────────────────────────────────────────

export const MOCK_TEAM: TeamMember[] = [
  { id: "tm-1", name: "Bima Aditya", email: "bima@inkandiron.id", role: "owner", joinedAt: "2025-01-15T00:00:00Z" },
  { id: "tm-2", name: "Sari Handayani", email: "sari@inkandiron.id", role: "admin", joinedAt: "2025-03-20T00:00:00Z" },
  { id: "tm-3", name: "Dwi Kurniawan", email: "dwi@inkandiron.id", role: "member", joinedAt: "2025-06-10T00:00:00Z" },
]

// ─── Analytics ─────────────────────────────────────────────

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalViews: 1205,
  totalClicks: 340,
  conversionRate: 28.2,
  totalLeads: 47,
  viewsTrend: 12.5,
  clicksTrend: 8.3,
}

export const MOCK_DAILY_ANALYTICS: Record<string, DailyAnalytics[]> = {
  "7d": [
    { date: "29 May", views: 45, clicks: 12, leads: 2 },
    { date: "30 May", views: 52, clicks: 18, leads: 1 },
    { date: "31 May", views: 38, clicks: 10, leads: 3 },
    { date: "1 Jun", views: 67, clicks: 22, leads: 2 },
    { date: "2 Jun", views: 55, clicks: 15, leads: 1 },
    { date: "3 Jun", views: 71, clicks: 25, leads: 4 },
    { date: "4 Jun", views: 63, clicks: 20, leads: 2 },
  ],
  "30d": [
    { date: "W1 May", views: 280, clicks: 85, leads: 8 },
    { date: "W2 May", views: 310, clicks: 92, leads: 12 },
    { date: "W3 May", views: 295, clicks: 78, leads: 9 },
    { date: "W4 May", views: 320, clicks: 105, leads: 14 },
  ],
  "90d": [
    { date: "Mar", views: 890, clicks: 245, leads: 28 },
    { date: "Apr", views: 1050, clicks: 310, leads: 35 },
    { date: "May", views: 1205, clicks: 340, leads: 43 },
  ],
}

// ─── Plans ────────────────────────────────────────────────

export const MOCK_PLANS: Plan[] = [
  {
    id: "plan-1",
    name: "Starter",
    duration: "1 Bulan",
    months: 1,
    price: 99000,
    pricePerMonth: 99000,
    features: [
      "1 Landing Page",
      "11 Blok Komponen",
      "Custom Slug URL",
      "Lead Capture Form",
      "Statistik Dasar",
    ],
  },
  {
    id: "plan-2",
    name: "Growth",
    duration: "3 Bulan",
    months: 3,
    price: 249000,
    pricePerMonth: 83000,
    features: [
      "Semua fitur Starter",
      "Priority Support",
      "Trusted Badge Request",
      "Analytics Dashboard",
      "Hemat 16%",
    ],
  },
  {
    id: "plan-3",
    name: "Pro",
    duration: "6 Bulan",
    months: 6,
    price: 449000,
    pricePerMonth: 74833,
    popular: true,
    features: [
      "Semua fitur Growth",
      "Custom Domain (soon)",
      "Team Management (3 user)",
      "Lead Export",
      "Hemat 24%",
    ],
  },
  {
    id: "plan-4",
    name: "Enterprise",
    duration: "12 Bulan",
    months: 12,
    price: 799000,
    pricePerMonth: 66583,
    features: [
      "Semua fitur Pro",
      "Team Unlimited",
      "API Access (soon)",
      "Dedicated Support",
      "Hemat 33%",
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────

export function getStudioBySlug(slug: string): Studio | undefined {
  return MOCK_STUDIOS.find((s) => s.slug === slug)
}

export function getVisibleBlocks(studio: Studio): Block[] {
  return studio.blocks.filter((b) => b.visible)
}

export const ALL_CITIES = [...new Set(MOCK_STUDIOS.map((s) => s.city))].sort()

export const ALL_TAGS = [...new Set(MOCK_STUDIOS.flatMap((s) => s.tags))].sort()
