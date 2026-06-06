import type {
  ArtistsGridData,
  Block,
  CreatorBioData,
  Studio,
} from "@/lib/types"

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

export function getCitiesFromStudios(studios: Studio[]): string[] {
  return [...new Set(studios.map((s) => s.city).filter(Boolean))].sort()
}
