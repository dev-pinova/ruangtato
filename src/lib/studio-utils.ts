import type { Block, Studio } from "@/lib/types"

export function getVisibleBlocks(studio: Studio): Block[] {
  return studio.blocks.filter((b) => b.visible)
}

export function getCitiesFromStudios(studios: Studio[]): string[] {
  return [...new Set(studios.map((s) => s.city).filter(Boolean))].sort()
}
