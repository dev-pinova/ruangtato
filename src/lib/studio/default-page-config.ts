import type { Block, BlockData, BlockType } from "@/lib/types"

export const DEFAULT_BLOCK_DATA: Record<BlockType, BlockData> = {
  Header: { title: "Studio Name", ctaText: "Book Now" },
  HeaderOverlay: {
    logoText: "Studio Name",
    tagline: "Tato • Piercing • Art",
    showCenterLogo: true,
    leftLinks: [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Gallery", href: "#gallery" },
    ],
    rightLinks: [
      { label: "Services", href: "#services" },
      { label: "News", href: "#news" },
      { label: "Contact", href: "#contact" },
    ],
  },
  Hero: {
    headline: "Eyes Wide Open",
    subheadline:
      "Studio tato profesional dengan fokus desain unik, konsultasi mendalam, dan standar keamanan tinggi.",
    ctaText: "Get a Tato",
    benefits: [
      "Konsultasi desain personal",
      "Standar sterilisasi ketat",
      "Artist berpengalaman",
    ],
    creator: "Lead Artist",
    image:
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=1200&auto=format&fit=crop",
  },
  HeroSlider: {
    slides: [
      {
        headline: "Art Studio",
        subheadline: "Unique Tatos",
        ctaText: "Get a Tato",
        image:
          "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1600&auto=format&fit=crop",
      },
      {
        headline: "Tato Like Art",
        subheadline: "Custom Pieces",
        ctaText: "Book Consultation",
        image:
          "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=1600&auto=format&fit=crop",
      },
      {
        headline: "Trusted Studio",
        subheadline: "Safe & Sterile",
        ctaText: "Contact Us",
        image:
          "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1600&auto=format&fit=crop",
      },
    ],
  },
  Goals: {
    eyebrow: "About Us",
    headline: "Tato Like Art",
    description:
      "Setiap karya lahir dari konsultasi mendalam dengan klien, kemudian diwujudkan jadi tato yang personal dan tahan waktu.",
    features: [
      { title: "Custom Design", desc: "Desain dibuat khusus untuk setiap klien." },
      { title: "Trusted Studio", desc: "Standar sterilisasi tinggi & aftercare lengkap." },
      { title: "Artist Berpengalaman", desc: "Tim spesialis dengan portofolio nyata." },
    ],
    image:
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1600&auto=format&fit=crop",
  },
  Gallery: {
    eyebrow: "Portfolio",
    headline: "Our Gallery",
    images: [
      {
        src: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=900&auto=format&fit=crop",
        alt: "Tato work 1",
      },
      {
        src: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=900&auto=format&fit=crop",
        alt: "Tato work 2",
      },
      {
        src: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=900&auto=format&fit=crop",
        alt: "Tato work 3",
      },
      {
        src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
        alt: "Tato work 4",
      },
      {
        src: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop",
        alt: "Tato work 5",
      },
      {
        src: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop",
        alt: "Tato work 6",
      },
    ],
  },
  Overview: {
    headline: "Tato Like Art",
    content1:
      "Kami menghadirkan pengalaman studio yang mengutamakan kenyamanan, keamanan, dan ekspresi artistik.",
    content2:
      "Dari konsep awal hingga aftercare, tim kami mendampingi setiap langkah perjalanan tato Anda.",
    image1:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=900&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
  },
  Features: {
    title: "Specific Style Tatos",
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
    eyebrow: "What We Do",
    headline: "Our Services",
    cards: [
      {
        title: "Tato",
        desc: "Custom design, blackwork, fine line, Japanese, hingga realism — dikerjakan oleh artist spesialis.",
        ctaText: "Learn More",
        ctaHref: "#contact",
        image:
          "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=900&auto=format&fit=crop",
      },
      {
        title: "Piercing",
        desc: "Piercing profesional dengan peralatan steril dan jewellery berkualitas.",
        ctaText: "Learn More",
        ctaHref: "#contact",
        image:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
      },
      {
        title: "Custom Design",
        desc: "Konsultasi desain personal dari konsep hingga sketsa final sebelum eksekusi.",
        ctaText: "Learn More",
        ctaHref: "#contact",
        image:
          "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?q=80&w=900&auto=format&fit=crop",
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
    role: "Tatoist",
    bio: "Spesialis blackwork dan custom piece dengan pengalaman lebih dari 8 tahun.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
  ArtistsGrid: {
    headline: "Meet Our Artists",
    subheadline: "Tim artist berpengalaman siap mewujudkan desain impian Anda.",
    artists: [
      {
        name: "Charly Moon",
        role: "Tatoist",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Alex Rivera",
        role: "Piercing Artist",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Maya Chen",
        role: "Fine Line Specialist",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Rio Pradana",
        role: "Black & Grey Artist",
        image:
          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
  StatsCounter: {
    headline: "",
    stats: [
      { value: "2,500", label: "Tatos Done" },
      { value: "1,800", label: "Happy Clients" },
      { value: "15", label: "Years Experience" },
      { value: "50", label: "Custom Designs" },
    ],
  },
  Testimonials: {
    eyebrow: "Testimonial",
    headline: "What Clients Say",
    reviews: [
      {
        text: "Pengalaman tato terbaik yang pernah saya punya. Artist sangat profesional dan studionya nyaman.",
        name: "Luis Rent",
        type: "Cover-up",
      },
      {
        text: "Studio bersih, suasana tenang, dan hasil akhirnya melebihi ekspektasi saya.",
        name: "Christa Falcon",
        type: "First Tato",
      },
      {
        text: "Konsultasi mendalam, desainnya benar-benar personal — saya akan kembali untuk piece berikutnya.",
        name: "Rich Damon",
        type: "Sleeve",
      },
    ],
  },
  LatestNews: {
    eyebrow: "Blog & News",
    headline: "Latest News",
    ctaText: "View All",
    ctaHref: "#news",
    articles: [
      {
        title: "How To Care Your New Tato",
        category: "Aftercare",
        date: "12 Jun 2025",
        image:
          "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=900&auto=format&fit=crop",
        href: "#",
      },
      {
        title: "Choosing The Right Tato Style",
        category: "Style",
        date: "04 Jun 2025",
        image:
          "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=900&auto=format&fit=crop",
        href: "#",
      },
      {
        title: "Behind The Ink: Studio Tour",
        category: "Studio",
        date: "21 Mei 2025",
        image:
          "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=900&auto=format&fit=crop",
        href: "#",
      },
    ],
  },
  Newsletter: {
    eyebrow: "Newsletter",
    headline: "Subscribe to our newsletter",
    description: "Dapatkan info promo, event, dan inspirasi tato terbaru langsung ke email Anda.",
    placeholder: "Enter your email",
    ctaText: "Subscribe",
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
    headline: "Make An Appointment",
    subheadline:
      "Isi formulir untuk konsultasi dan penjadwalan sesi. Anda juga bisa hubungi kami via WhatsApp, Instagram, atau email.",
    ctaText: "Send Request",
    ageLabel: "Are you 18 years old?",
    requireAge: true,
    showMap: false,
    mapEmbedUrl: "",
    mapAddress: "",
    mapHeight: 420,
  },
  FinalCTA: {
    headline: "Contact Us To Get A Quote",
    subheadline: "Buat janji konsultasi dan wujudkan desain tato impian Anda.",
    ctaText: "Get a Quote via WA",
  },
  Footer: {
    title: "Tato Studio",
    address: "Jakarta, Indonesia",
    instagram: "@studiott",
    whatsapp: "WhatsApp",
    email: "hello@studio.com",
    showNewsletter: true,
    newsletterEyebrow: "Newsletter",
    newsletterHeadline: "Subscribe to our newsletter",
    newsletterPlaceholder: "Enter your email",
    newsletterCta: "Subscribe",
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
