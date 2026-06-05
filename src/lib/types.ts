export type BlockType =
  | "Header"
  | "Hero"
  | "Goals"
  | "Overview"
  | "Features"
  | "HowItWorks"
  | "CreatorBio"
  | "Testimonials"
  | "FAQ"
  | "FinalCTA"
  | "Footer"

export interface HeaderData {
  title?: string
  ctaText?: string
}

export interface HeroData {
  headline?: string
  subheadline?: string
  benefits?: string[]
  ctaText?: string
  creator?: string
  image?: string
}

export interface GoalsData {
  headline?: string
  description?: string
  features?: { title: string; desc: string }[]
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
  reviews?: { text: string; name: string; type: string }[]
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
}

export type BlockData =
  | HeaderData
  | HeroData
  | GoalsData
  | OverviewData
  | FeaturesData
  | HowItWorksData
  | CreatorBioData
  | TestimonialsData
  | FAQData
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
