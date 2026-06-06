export type BlockType =
  | "Header"
  | "HeaderOverlay"
  | "Hero"
  | "HeroSlider"
  | "Goals"
  | "Gallery"
  | "Overview"
  | "Features"
  | "ServicesCards"
  | "HowItWorks"
  | "CreatorBio"
  | "ArtistsGrid"
  | "StatsCounter"
  | "Testimonials"
  | "LatestNews"
  | "Newsletter"
  | "FAQ"
  | "AppointmentForm"
  | "FinalCTA"
  | "Footer"

export interface HeaderData {
  title?: string
  ctaText?: string
}

export interface HeaderOverlayLink {
  label?: string
  href?: string
}

export interface HeaderOverlayData {
  /** Teks logo center (default: nama studio) */
  logoText?: string
  /** Tagline kecil di bawah logo (opsional) */
  tagline?: string
  /** Link kiri (default 3 item) */
  leftLinks?: HeaderOverlayLink[]
  /** Link kanan (default 3 item) */
  rightLinks?: HeaderOverlayLink[]
  /** Tampilkan logo center di antara nav kiri-kanan */
  showCenterLogo?: boolean
}

export interface HeroData {
  headline?: string
  subheadline?: string
  benefits?: string[]
  ctaText?: string
  creator?: string
  image?: string
}

export interface HeroSlide {
  headline?: string
  subheadline?: string
  ctaText?: string
  image?: string
}

export interface HeroSliderData {
  slides?: HeroSlide[]
}

export interface ArtistItem {
  name?: string
  role?: string
  image?: string
}

export interface ArtistsGridData {
  headline?: string
  subheadline?: string
  artists?: ArtistItem[]
}

export interface StatItem {
  value?: string
  label?: string
}

export interface StatsCounterData {
  headline?: string
  stats?: StatItem[]
}

export interface ServiceCard {
  title?: string
  desc?: string
  image?: string
  /** Label CTA per kartu (default: "Read More") */
  ctaText?: string
  ctaHref?: string
}

export interface ServicesCardsData {
  eyebrow?: string
  headline?: string
  cards?: ServiceCard[]
}

export interface AppointmentFormData {
  headline?: string
  subheadline?: string
  ctaText?: string
  /** Teks label checkbox usia (default: "Are you 18 years old?"). */
  ageLabel?: string
  /** Wajibkan centang konfirmasi usia ≥18 sebelum submit (default: true). */
  requireAge?: boolean
  /** Tampilkan Google Maps di samping form (default: false). */
  showMap?: boolean
  /** URL embed dari Google Maps (Share → Embed a map). */
  mapEmbedUrl?: string
  /** Label alamat opsional di bawah peta. */
  mapAddress?: string
  /** Tinggi peta dalam px (default: 420). */
  mapHeight?: number
}

export interface GoalsData {
  /** Teks kecil di atas headline (mis. "ABOUT US"). */
  eyebrow?: string
  headline?: string
  description?: string
  features?: { title: string; desc: string }[]
  /** URL gambar latar / preview untuk style "About + video play button". */
  image?: string
  /** URL video opsional. Jika kosong, tombol play hanya dekoratif. */
  videoUrl?: string
}

export interface GalleryImage {
  src?: string
  alt?: string
}

export interface GalleryData {
  eyebrow?: string
  headline?: string
  subheadline?: string
  images?: GalleryImage[]
}

export interface OverviewData {
  headline?: string
  content1?: string
  content2?: string
  image1?: string
  image2?: string
}

export interface FeaturesData {
  title?: string
  items?: { title: string; desc: string }[]
}

export interface HowItWorksData {
  steps?: { title: string; desc: string }[]
}

export interface CreatorBioData {
  name?: string
  role?: string
  bio?: string
  image?: string
}

export interface TestimonialsData {
  eyebrow?: string
  headline?: string
  reviews?: { text: string; name: string; type: string }[]
}

export interface NewsArticle {
  title?: string
  category?: string
  date?: string
  image?: string
  href?: string
}

export interface LatestNewsData {
  eyebrow?: string
  headline?: string
  ctaText?: string
  ctaHref?: string
  articles?: NewsArticle[]
}

export interface NewsletterData {
  eyebrow?: string
  headline?: string
  description?: string
  placeholder?: string
  ctaText?: string
}

export interface FAQData {
  faqs?: { q: string; a: string }[]
}

export interface FinalCTAData {
  headline?: string
  subheadline?: string
  ctaText?: string
}

export interface FooterData {
  title?: string
  address?: string
  instagram?: string
  whatsapp?: string
  email?: string
  /** Aktifkan form subscribe newsletter inline di footer (default: false). */
  showNewsletter?: boolean
  /** Teks kecil di atas form newsletter (default: "Newsletter"). */
  newsletterEyebrow?: string
  /** Headline di atas form newsletter (default: "Subscribe to our newsletter"). */
  newsletterHeadline?: string
  /** Placeholder input email (default: "Enter your email"). */
  newsletterPlaceholder?: string
  /** Label tombol subscribe (default: "Subscribe"). */
  newsletterCta?: string
}

export type BlockData =
  | HeaderData
  | HeaderOverlayData
  | HeroData
  | HeroSliderData
  | GoalsData
  | GalleryData
  | OverviewData
  | FeaturesData
  | ServicesCardsData
  | HowItWorksData
  | CreatorBioData
  | ArtistsGridData
  | StatsCounterData
  | TestimonialsData
  | LatestNewsData
  | NewsletterData
  | FAQData
  | AppointmentFormData
  | FinalCTAData
  | FooterData

export interface Block {
  id: string
  type: BlockType
  data: BlockData
  visible: boolean
}

export interface Studio {
  id: string
  slug: string
  name: string
  city: string
  waNumber: string
  description: string
  image: string
  viewCount: number
  clickCount: number
  isTrusted: boolean
  isPublished: boolean
  tags: string[]
  artist: string
  blocks: Block[]
}

export interface Lead {
  id: string
  studioId: string
  name: string
  email: string | null
  message: string
  status: "new" | "read" | "replied"
  createdAt: string
}

export interface Subscription {
  id: string
  studioId: string
  planType: "1month" | "3months" | "6months" | "12months"
  status: "active" | "expired" | "pending" | "cancelled"
  expiresAt: string
  createdAt: string
}

export interface Invoice {
  id: string
  studioId: string
  planType: string
  amount: number
  status: "paid" | "pending" | "failed"
  paidAt: string | null
  createdAt: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "member"
  joinedAt: string
  avatar?: string
}

export interface AnalyticsSummary {
  totalViews: number
  totalClicks: number
  conversionRate: number
  totalLeads: number
  viewsTrend: number
  clicksTrend: number
}

export interface DailyAnalytics {
  date: string
  views: number
  clicks: number
  leads: number
}

export interface Plan {
  id: string
  name: string
  duration: string
  months: number
  price: number
  pricePerMonth: number
  features: string[]
  popular?: boolean
}
