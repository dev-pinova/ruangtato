/** Unsplash URLs yang sudah diverifikasi (HTTP 200). */

function unsplash(photoId: string, width = 900) {
  return `https://images.unsplash.com/${photoId}?q=80&w=${width}&auto=format&fit=crop`
}

export const PLACEHOLDER_IMAGES = {
  tattooStudioA: "/image/studio-interior-reception.jpg",
  tattooStudioB: "/image/studio-workspace-chair.jpg",
  tattooStudioC: "/image/studio-interior-waiting.jpg",
  tattooWorkA: "/image/tattoo-work-blackwork.jpg",
  tattooWorkB: "/image/tattoo-work-floral-leg.jpg",
  artistPortraitA: "/image/artist-portrait-a.jpg",
  artistPortraitB: "/image/artist-portrait-b.jpg",
  artistPortraitC: "/image/artist-portrait-c.jpg",
  artistPortraitD: "/image/artist-process-sketching.jpg",
} as const

export const DEFAULT_STUDIO_COVER = PLACEHOLDER_IMAGES.tattooStudioA
