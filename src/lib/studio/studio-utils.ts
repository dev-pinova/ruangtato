import type {
  ArtistsGridData,
  Block,
  CreatorBioData,
  HeroData,
  HeroSliderData,
  Studio,
} from "@/lib/types"
import { DEFAULT_STUDIO_COVER } from "@/lib/placeholder-images"

export function getVisibleBlocks(studio: Studio): Block[] {
  return studio.blocks.filter((b) => b.visible)
}

/** Foto profil artist dari Creator Bio atau Artists Grid di page config. */
export function getStudioArtistImage(blocks: Block[]): string {
  for (const block of blocks) {
    if (!block.visible || block.type !== "CreatorBio") continue
    const image = (block.data as CreatorBioData)?.image?.trim()
    if (image) return image
  }

  for (const block of blocks) {
    if (!block.visible || block.type !== "ArtistsGrid") continue
    const artists = (block.data as ArtistsGridData)?.artists ?? []
    for (const artist of artists) {
      const image = artist.image?.trim()
      if (image) return image
    }
  }

  return ""
}

/** Cover studio untuk direktori: Hero → HeroSlider → Creator Bio. */
export function getStudioCoverImage(blocks: Block[]): string {
  for (const block of blocks) {
    if (!block.visible || block.type !== "Hero") continue
    const image = (block.data as HeroData)?.image?.trim()
    if (image) return image
  }

  for (const block of blocks) {
    if (!block.visible || block.type !== "HeroSlider") continue
    const slides = (block.data as HeroSliderData)?.slides ?? []
    for (const slide of slides) {
      const image = slide.image?.trim()
      if (image) return image
    }
  }

  for (const block of blocks) {
    if (!block.visible || block.type !== "CreatorBio") continue
    const image = (block.data as CreatorBioData)?.image?.trim()
    if (image) return image
  }

  return ""
}

/** Settings override (non-default) > derived dari blocks > placeholder. */
export function resolveStudioCoverImage(
  stored: string | null | undefined,
  blocks: Block[],
): string {
  const storedTrim = stored?.trim() ?? ""
  if (storedTrim && storedTrim !== DEFAULT_STUDIO_COVER) return storedTrim
  return getStudioCoverImage(blocks) || storedTrim || DEFAULT_STUDIO_COVER
}

export function getCitiesFromStudios(studios: Studio[]): string[] {
  return [...new Set(studios.map((s) => s.city).filter(Boolean))].sort()
}
