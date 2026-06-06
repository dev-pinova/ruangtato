/** Unsplash URLs yang sudah diverifikasi (HTTP 200). */

function unsplash(photoId: string, width = 900) {
  return `https://images.unsplash.com/${photoId}?q=80&w=${width}&auto=format&fit=crop`
}

export const PLACEHOLDER_IMAGES = {
  tattooStudioA: unsplash("photo-1598371839696-5c5bb00bdc28", 800),
  tattooStudioB: unsplash("photo-1565058379802-bbe93b2f703a", 800),
  tattooStudioC: unsplash("photo-1568515045052-f9a854d70bfd", 800),
  tattooWorkA: unsplash("photo-1611501275019-9b5cda994e8d", 900),
  tattooWorkB: unsplash("photo-1522337360788-8b13dee7a37e", 900),
  artistPortraitA: unsplash("photo-1507003211169-0a1dd7228f2d", 400),
  artistPortraitB: unsplash("photo-1500648767791-00dcc994a43e", 400),
  artistPortraitC: unsplash("photo-1494790108377-be9c29b29330", 400),
  artistPortraitD: unsplash("photo-1531123897727-8f129e1688ce", 400),
} as const

export const DEFAULT_STUDIO_COVER = PLACEHOLDER_IMAGES.tattooStudioA
