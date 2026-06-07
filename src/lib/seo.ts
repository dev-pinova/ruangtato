import type { Metadata } from "next"

import {
  PLATFORM_LOGO_PATH,
  SITE_NAME,
  SITE_URL,
  studioPublicUrl,
} from "@/lib/site"

export const DEFAULT_DESCRIPTION =
  "Temukan studio tattoo terpercaya di Indonesia. Ruang Tato menyediakan direktori studio dan landing page profesional untuk booking konsultasi via WhatsApp."

export const DEFAULT_KEYWORDS = [
  "studio tattoo",
  "tattoo Indonesia",
  "direktori studio tattoo",
  "landing page studio tattoo",
  "booking tattoo",
  "portofolio tattoo",
  "Ruang Tato",
]

export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image"
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`

type PageMetadataInput = {
  title: string
  description?: string
  path?: string
  image?: string | null
  noIndex?: boolean
  keywords?: string[]
}

function toAbsoluteUrl(path: string) {
  if (path.startsWith("http")) return path
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image,
  noIndex = false,
  keywords = DEFAULT_KEYWORDS,
}: PageMetadataInput): Metadata {
  const canonical = toAbsoluteUrl(path)
  const ogImage = image ? toAbsoluteUrl(image) : toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH)

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Direktori & Landing Page Studio Tattoo`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: "/icon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Direktori & Landing Page Studio Tattoo`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Direktori Studio Tattoo Indonesia`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "id-ID",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: toAbsoluteUrl(PLATFORM_LOGO_PATH),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: toAbsoluteUrl(PLATFORM_LOGO_PATH),
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      "https://www.instagram.com/ruangtato",
      "https://web.facebook.com/ruangtato",
      "https://www.tiktok.com/@ruangtato",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["Indonesian", "English"],
      url: "https://api.whatsapp.com/send/?phone=628133985462",
    },
  }
}

export function buildStudioJsonLd(input: {
  name: string
  slug: string
  description: string
  city: string
  image: string
  artist: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: input.name,
    url: studioPublicUrl(input.slug),
    description: input.description,
    image: input.image.startsWith("http") ? input.image : toAbsoluteUrl(input.image),
    address: {
      "@type": "PostalAddress",
      addressLocality: input.city,
      addressCountry: "ID",
    },
    employee: {
      "@type": "Person",
      name: input.artist,
    },
    parentOrganization: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export const PUBLIC_STATIC_PATHS = [
  "/",
  "/pricing",
  "/help",
  "/privacy",
  "/terms",
  "/subscription",
  "/cookies",
] as const

export const STATIC_PAGE_SEO = {
  "/": {
    title: "Direktori Studio Tattoo Indonesia",
    description:
      "Temukan studio tattoo terpercaya di Indonesia. Jelajahi portofolio artist, filter berdasarkan kota dan gaya, lalu booking konsultasi lewat WhatsApp.",
  },
  "/pricing": {
    title: "Harga & Paket Langganan",
    description:
      "Pilih paket langganan Ruang Tato untuk studio tattoo Anda. Landing page profesional mulai Rp 99.000/bulan dengan builder drag-and-drop.",
  },
  "/help": {
    title: "Pusat Bantuan",
    description:
      "FAQ dan panduan menggunakan Ruang Tato: builder landing page, publikasi studio, billing, dan manajemen lead.",
  },
  "/privacy": {
    title: "Kebijakan Privasi",
    description:
      "Kebijakan privasi Ruang Tato menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  },
  "/terms": {
    title: "Syarat & Ketentuan",
    description:
      "Syarat dan ketentuan penggunaan platform Ruang Tato untuk studio tattoo di Indonesia.",
  },
  "/subscription": {
    title: "Kebijakan Langganan",
    description:
      "Kebijakan langganan dan pembayaran Ruang Tato untuk studio tattoo yang menggunakan platform landing page berbayar.",
  },
  "/cookies": {
    title: "Kebijakan Cookie",
    description:
      "Penjelasan tentang penggunaan cookie dan teknologi serupa di platform Ruang Tato.",
  },
} as const satisfies Record<
  (typeof PUBLIC_STATIC_PATHS)[number],
  { title: string; description: string }
>

export function staticPageMetadata(path: (typeof PUBLIC_STATIC_PATHS)[number]) {
  const { title, description } = STATIC_PAGE_SEO[path]
  return createPageMetadata({ title, description, path })
}

export const NOINDEX_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/app/dashboard",
  "/app/builder",
  "/app/billing",
  "/app/settings",
] as const
