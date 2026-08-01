import type { Block, BlockData, BlockType } from "@/lib/types"

export const DEFAULT_BLOCK_DATA: Record<BlockType, BlockData> = {
  Header: {
    title: "Nama Studio",
    logoImage: "",
    ctaText: "Booking Sekarang",
    links: [
      { label: "Tentang", href: "#about" },
      { label: "Layanan", href: "#services" },
      { label: "Artist", href: "#artists" },
      { label: "Klien", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  HeaderOverlay: {
    logoText: "Nama Studio",
    logoImage: "",
    tagline: "Tato • Piercing • Seni",
    showCenterLogo: true,
    leftLinks: [
      { label: "Beranda", href: "#home" },
      { label: "Tentang", href: "#about" },
      { label: "Galeri", href: "#gallery" },
    ],
    rightLinks: [
      { label: "Layanan", href: "#services" },
      { label: "Berita", href: "#news" },
      { label: "Kontak", href: "#contact" },
    ],
  },
  Hero: {
    headline: "Tato yang Menceritakan Siapa Anda",
    subheadline:
      "Studio tato profesional dengan fokus desain unik, konsultasi mendalam, dan standar keamanan tinggi.",
    ctaText: "Konsultasi Sekarang",
    benefits: [
      "Konsultasi desain personal",
      "Standar sterilisasi ketat",
      "Artist berpengalaman",
    ],
    creator: "Lead Artist",
    image: "/image/studio-workspace-chair.jpg",
  },
  HeroSlider: {
    slides: [
      {
        headline: "Studio Seni Tato",
        subheadline: "Desain Unik & Personal",
        ctaText: "Konsultasi Sekarang",
        image: "/image/tattoo-process-inking.jpg",
      },
      {
        headline: "Karya Seni Tato",
        subheadline: "Desain Kustom Eksklusif",
        ctaText: "Buat Janji Konsultasi",
        image: "/image/studio-interior-reception.jpg",
      },
      {
        headline: "Studio Terpercaya",
        subheadline: "Aman & Steril",
        ctaText: "Hubungi Kami",
        image: "/image/studio-interior-gallery.jpg",
      },
    ],
  },
  Goals: {
    eyebrow: "Tentang Kami",
    headline: "Seni Tato Abadi",
    description:
      "Setiap karya lahir dari konsultasi mendalam dengan klien, kemudian diwujudkan jadi tato yang personal dan tahan waktu.",
    features: [
      { title: "Desain Kustom", desc: "Desain dibuat khusus untuk setiap klien." },
      { title: "Studio Terpercaya", desc: "Standar sterilisasi tinggi & aftercare lengkap." },
      { title: "Artist Berpengalaman", desc: "Tim spesialis dengan portofolio nyata." },
    ],
    image: "/image/studio-workspace-minimalist.jpg",
  },
  Gallery: {
    eyebrow: "Portofolio",
    headline: "Galeri Kami",
    images: [
      {
        src: "/image/tattoo-work-blackwork.jpg",
        alt: "Karya tato 1",
      },
      {
        src: "/image/tattoo-work-floral-leg.jpg",
        alt: "Karya tato 2",
      },
      {
        src: "/image/tattoo-work-color-arm.jpg",
        alt: "Karya tato 3",
      },
      {
        src: "/image/tattoo-work-fineline-wrist.jpg",
        alt: "Karya tato 4",
      },
      {
        src: "/image/tattoo-work-realism.jpg",
        alt: "Karya tato 5",
      },
      {
        src: "/image/tattoo-process-leg.jpg",
        alt: "Karya tato 6",
      },
    ],
  },
  Overview: {
    headline: "Seni Tato Abadi",
    content1:
      "Kami menghadirkan pengalaman studio yang mengutamakan kenyamanan, keamanan, dan ekspresi artistik.",
    content2:
      "Dari konsep awal hingga aftercare, tim kami mendampingi setiap langkah perjalanan tato Anda.",
    image1: "/image/studio-interior-reception.jpg",
    image2: "/image/studio-interior-waiting.jpg",
  },
  Features: {
    title: "Gaya Spesialis Tato",
    items: [
      { title: "Pinup", desc: "Gaya klasik dan bold." },
      { title: "Japanese", desc: "Motif tradisional dan modern." },
      { title: "Fine Line", desc: "Garis presisi dan detail halus." },
      { title: "Blackwork", desc: "Kontras kuat dan geometris." },
      { title: "Realism", desc: "Detail realistis dan shading dalam." },
      { title: "Custom", desc: "Desain sepenuhnya personal." },
    ],
  },
  ServicesCards: {
    eyebrow: "Layanan Kami",
    headline: "Layanan & Keahlian",
    cards: [
      {
        title: "Tato",
        desc: "Custom design, blackwork, fine line, Japanese, hingga realism — dikerjakan oleh artist spesialis.",
        ctaText: "Selengkapnya",
        ctaHref: "#contact",
        image: "/image/tattoo-process-inking.jpg",
      },
      {
        title: "Piercing",
        desc: "Piercing profesional dengan peralatan steril dan jewellery berkualitas.",
        ctaText: "Selengkapnya",
        ctaHref: "#contact",
        image: "/image/tattoo-tools-machine.jpg",
      },
      {
        title: "Desain Kustom",
        desc: "Konsultasi desain personal dari konsep hingga sketsa final sebelum eksekusi.",
        ctaText: "Selengkapnya",
        ctaHref: "#contact",
        image: "/image/artist-process-sketching.jpg",
      },
    ],
  },
  HowItWorks: {
    steps: [
      { title: "Konsultasi", desc: "Diskusikan ide, ukuran, dan penempatan." },
      { title: "Desain", desc: "Review sketsa hingga Anda puas." },
      { title: "Sesi Tato", desc: "Proses dengan standar keamanan tinggi." },
      { title: "Aftercare", desc: "Panduan perawatan pasca sesi." },
    ],
  },
  CreatorBio: {
    name: "Charly Moon",
    role: "Artist Tato",
    bio: "Spesialis blackwork dan custom piece dengan pengalaman lebih dari 8 tahun.",
    image: "/image/artist-portrait-c.jpg",
  },
  ArtistsGrid: {
    headline: "Temui Artist Kami",
    subheadline: "Tim artist berpengalaman siap mewujudkan desain impian Anda.",
    artists: [
      {
        name: "Charly Moon",
        role: "Artist Tato",
        image: "/image/artist-portrait-c.jpg",
      },
      {
        name: "Alex Rivera",
        role: "Piercing Artist",
        image: "/image/artist-portrait-b.jpg",
      },
      {
        name: "Maya Chen",
        role: "Spesialis Fine Line",
        image: "/image/artist-portrait-a.jpg",
      },
      {
        name: "Rio Pradana",
        role: "Artist Black & Grey",
        image: "/image/artist-process-sketching.jpg",
      },
    ],
  },
  StatsCounter: {
    headline: "",
    stats: [
      { value: "2.500+", label: "Tato Selesai" },
      { value: "1.800+", label: "Klien Puas" },
      { value: "15", label: "Tahun Pengalaman" },
      { value: "50+", label: "Desain Kustom" },
    ],
  },
  Testimonials: {
    eyebrow: "Testimoni",
    headline: "Kata Klien Kami",
    reviews: [
      {
        text: "Pengalaman tato terbaik yang pernah saya punya. Artist sangat profesional dan studionya nyaman.",
        name: "Luis Rent",
        type: "Cover-up",
        avatar: "/image/artist-portrait-c.jpg",
        rating: 5,
      },
      {
        text: "Studio bersih, suasana tenang, dan hasil akhirnya melebihi ekspektasi saya.",
        name: "Christa Falcon",
        type: "Tato Pertama",
        avatar: "/image/artist-portrait-b.jpg",
        rating: 5,
      },
      {
        text: "Konsultasi mendalam, desainnya benar-benar personal — saya akan kembali untuk piece berikutnya.",
        name: "Rich Damon",
        type: "Sleeve",
        avatar: "/image/artist-portrait-a.jpg",
        rating: 5,
      },
    ],
  },
  LatestNews: {
    eyebrow: "Blog & Berita",
    headline: "Berita Terbaru",
    ctaText: "Lihat Semua",
    ctaHref: "#news",
    articles: [
      {
        title: "Cara Merawat Tato Baru Agar Tahan Lama",
        category: "Perawatan",
        date: "12 Jun 2025",
        image: "/image/tattoo-process-stencil.jpg",
        href: "#",
      },
      {
        title: "Memilih Gaya Tato Yang Tepat Untuk Anda",
        category: "Gaya Tato",
        date: "04 Jun 2025",
        image: "/image/tattoo-sketch-skull.jpg",
        href: "#",
      },
      {
        title: "Di Balik Tinta: Tur Studio Kami",
        category: "Studio",
        date: "21 Mei 2025",
        image: "/image/studio-interior-gallery.jpg",
        href: "#",
      },
    ],
  },
  Newsletter: {
    eyebrow: "Newsletter",
    headline: "Berlangganan Newsletter Kami",
    description: "Dapatkan info promo, event, dan inspirasi tato terbaru langsung ke email Anda.",
    placeholder: "Masukkan email Anda",
    ctaText: "Berlangganan",
  },
  FAQ: {
    faqs: [
      { q: "Apakah perlu konsultasi dulu?", a: "Ya, kami merekomendasikan konsultasi sebelum sesi." },
      { q: "Berapa lama proses healing?", a: "Umumnya 2-4 minggu tergantung ukuran dan area." },
      { q: "Apakah bisa cover-up?", a: "Bisa, setelah review desain lama di konsultasi." },
      { q: "Minimal usia?", a: "Minimal 18 tahun dengan identitas valid." },
    ],
  },
  AppointmentForm: {
    headline: "Buat Janji Temu",
    subheadline:
      "Isi formulir untuk konsultasi dan penjadwalan sesi. Anda juga bisa hubungi kami via WhatsApp, Instagram, atau email.",
    ctaText: "Kirim Permintaan",
    ageLabel: "Apakah Anda berusia 18 tahun atau lebih?",
    requireAge: true,
    showMap: false,
    mapEmbedUrl: "",
    mapAddress: "",
    mapHeight: 420,
  },
  FinalCTA: {
    headline: "Hubungi Kami Untuk Estimasi Biaya",
    subheadline: "Buat janji konsultasi dan wujudkan desain tato impian Anda.",
    ctaText: "Konsultasi via WA",
  },
  Footer: {
    title: "Studio Tato",
    logoImage: "",
    description: "Studio tato profesional dengan fokus desain unik, sterilisasi ketat, dan ekspresi artistik personal.",
    address: "Jakarta, Indonesia",
    instagram: "https://instagram.com",
    whatsapp: "https://wa.me",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
    email: "hello@studio.com",
    showMap: false,
    mapEmbedUrl: "",
    mapHeight: 200,
  },
  LeadForm: {
    title: "Hubungi kami",
    description: "Punya pertanyaan atau ingin konsultasi? Kirim pesan dan kami akan segera menghubungi Anda.",
    ctaText: "Kirim Pesan",
  },
}

/** Tato Studio 128 single-page preset — inspired by tato-128.webflow.io.
 *  Setiap block punya anchor target sesuai menu HeaderOverlay
 *  (Home / About / Gallery / Services / News / Contact). */
const SECTION_ORDER: BlockType[] = [
  "HeaderOverlay",
  "HeroSlider",
  "Goals",
  "Gallery",
  "ServicesCards",
  "LatestNews",
  "AppointmentForm",
  "Footer",
]

export function createDefaultPageConfig(studioName?: string): Block[] {
  const blocks = SECTION_ORDER.map((type, index) => ({
    id: `${type.toLowerCase()}-${index + 1}`,
    type,
    data: { ...DEFAULT_BLOCK_DATA[type] },
    visible: true,
  }))

  if (studioName) {
    const overlay = blocks.find((b) => b.type === "HeaderOverlay")
    const header = blocks.find((b) => b.type === "Header")
    const footer = blocks.find((b) => b.type === "Footer")
    if (overlay) overlay.data = { ...overlay.data, logoText: studioName }
    if (header) header.data = { ...header.data, title: studioName }
    if (footer) footer.data = { ...footer.data, title: studioName }
  }

  return blocks
}

export function createSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48)
}
