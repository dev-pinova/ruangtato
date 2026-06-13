import { createDefaultPageConfig } from "@/lib/studio/default-page-config"
import { PLACEHOLDER_IMAGES } from "@/lib/placeholder-images"
import type { Block, FooterData, GoalsData, Studio } from "@/lib/types"

const SHOWCASE_GRID_SIZE = 6

function creatorBioBlock(
  id: string,
  name: string,
  image: string,
): Block {
  return {
    id,
    type: "CreatorBio",
    visible: true,
    data: {
      name,
      role: "Lead Artist",
      bio: `Spesialis custom tattoo dengan pengalaman bertahun-tahun di ${name}.`,
      image,
    },
  }
}

function demoStudio(input: {
  id: string
  slug: string
  name: string
  city: string
  artist: string
  description: string
  image: string
  artistImage: string
  tags: string[]
  viewCount: number
  clickCount: number
  isVerified: boolean
  isTrusted?: boolean
}): Studio {
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    city: input.city,
    waNumber: "6281234567890",
    description: input.description,
    image: input.image,
    viewCount: input.viewCount,
    clickCount: input.clickCount,
    isTrusted: input.isTrusted ?? false,
    isVerified: input.isVerified,
    isPublished: true,
    tags: input.tags,
    artist: input.artist,
    artistImage: input.artistImage,
    blocks: [creatorBioBlock(`creator-${input.slug}`, input.artist, input.artistImage)],
  }
}

/** Studio demo untuk grid showcase (3 berlangganan paid, 3 trial). */
export const SHOWCASE_DEMO_STUDIOS: Studio[] = [
  demoStudio({
    id: "demo-ink-and-iron",
    slug: "ink-and-iron",
    name: "Ink & Iron Tattoo",
    city: "Jakarta",
    artist: "Rizky Pratama",
    description: "Studio blackwork dan custom piece di Jakarta Selatan dengan standar sterilisasi tinggi.",
    image: PLACEHOLDER_IMAGES.tattooStudioA,
    artistImage: PLACEHOLDER_IMAGES.artistPortraitA,
    tags: ["Blackwork", "Custom", "Jakarta"],
    viewCount: 1280,
    clickCount: 340,
    isVerified: true,
    isTrusted: true,
  }),
  demoStudio({
    id: "demo-sakura-ink",
    slug: "sakura-ink",
    name: "Sakura Ink Studio",
    city: "Bandung",
    artist: "Dewi Anggraini",
    description: "Spesialis Japanese traditional dan fine line dengan pendekatan desain personal.",
    image: PLACEHOLDER_IMAGES.tattooStudioB,
    artistImage: PLACEHOLDER_IMAGES.artistPortraitC,
    tags: ["Japanese", "Fine Line", "Bandung"],
    viewCount: 960,
    clickCount: 210,
    isVerified: true,
  }),
  demoStudio({
    id: "demo-bali-skin-art",
    slug: "bali-skin-art",
    name: "Bali Skin Art",
    city: "Denpasar",
    artist: "Made Wijaya",
    description: "Tattoo & piercing studio tropis dengan fokus realism dan cover-up berkualitas.",
    image: PLACEHOLDER_IMAGES.tattooStudioC,
    artistImage: PLACEHOLDER_IMAGES.artistPortraitB,
    tags: ["Realism", "Piercing", "Bali"],
    viewCount: 840,
    clickCount: 190,
    isVerified: true,
  }),
  demoStudio({
    id: "demo-neon-needle",
    slug: "neon-needle",
    name: "Neon Needle",
    city: "Yogyakarta",
    artist: "Adit Mahendra",
    description: "Studio tattoo modern dengan gaya neo-traditional dan warna cerah yang bold.",
    image: PLACEHOLDER_IMAGES.tattooWorkA,
    artistImage: PLACEHOLDER_IMAGES.artistPortraitD,
    tags: ["Neo-Traditional", "Color", "Yogyakarta"],
    viewCount: 520,
    clickCount: 120,
    isVerified: false,
  }),
  demoStudio({
    id: "demo-shadow-line",
    slug: "shadow-line",
    name: "Shadow Line",
    city: "Semarang",
    artist: "Clara Sutanto",
    description: "Fine line dan minimal tattoo dengan konsultasi desain yang detail dan sabar.",
    image: PLACEHOLDER_IMAGES.tattooWorkB,
    artistImage: PLACEHOLDER_IMAGES.artistPortraitC,
    tags: ["Fine Line", "Minimal", "Semarang"],
    viewCount: 410,
    clickCount: 95,
    isVerified: false,
  }),
  demoStudio({
    id: "demo-iron-canvas",
    slug: "iron-canvas",
    name: "Iron Canvas",
    city: "Surabaya",
    artist: "Bima Kusuma",
    description: "Custom sleeve dan large-scale piece dikerjakan oleh tim artist berpengalaman.",
    image: PLACEHOLDER_IMAGES.tattooStudioB,
    artistImage: PLACEHOLDER_IMAGES.artistPortraitA,
    tags: ["Sleeve", "Custom", "Surabaya"],
    viewCount: 380,
    clickCount: 88,
    isVerified: false,
  }),
]

/**
 * Bangun landing page lengkap (preset Tattoo Studio 128) untuk satu demo studio
 * showcase berdasarkan slug. Dipakai agar kartu demo di beranda saat diklik
 * tetap membuka halaman landing page nyata, bukan 404.
 */
export function getShowcaseDemoStudioBySlug(slug: string): Studio | null {
  const demo = SHOWCASE_DEMO_STUDIOS.find((studio) => studio.slug === slug)
  if (!demo) return null

  const blocks = createDefaultPageConfig(demo.name)

  // Sesuaikan beberapa block dengan data demo agar landing page terasa spesifik.
  for (const block of blocks) {
    if (block.type === "Goals") {
      block.data = {
        ...(block.data as GoalsData),
        description: demo.description,
      }
    }
    if (block.type === "Footer") {
      block.data = {
        ...(block.data as FooterData),
        title: demo.name,
        address: `${demo.city}, Indonesia`,
      }
    }
  }

  return { ...demo, blocks }
}

/** Gabungkan studio publik dengan demo hingga grid 2×3 (6 kartu). */
export function buildShowcaseStudios(published: Studio[]): Studio[] {
  const merged: Studio[] = [...published]
  const usedSlugs = new Set(published.map((studio) => studio.slug))

  for (const demo of SHOWCASE_DEMO_STUDIOS) {
    if (merged.length >= SHOWCASE_GRID_SIZE) break
    if (usedSlugs.has(demo.slug)) continue
    merged.push(demo)
    usedSlugs.add(demo.slug)
  }

  return merged.slice(0, SHOWCASE_GRID_SIZE)
}

export { SHOWCASE_GRID_SIZE }
