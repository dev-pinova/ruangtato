export const SITE_NAME = "Ruang Tato"

/** Logo mark SVG — monogram RT (design system). */
export const PLATFORM_LOGO_PATH = "/image/logo-mark.svg"

/** Domain utama platform */
export const SITE_URL = "https://www.ruangtato.com"

export const SITE_DOMAIN = "www.ruangtato.com"

export const STUDIO_PATH_PREFIX = ""

/** Tampilan URL publik tanpa slug, mis. www.ruangtato.com/ */
export const STUDIO_URL_DISPLAY_PREFIX = `${SITE_DOMAIN}/`

export function studioPublicUrl(slug: string) {
  return `${SITE_URL}/${slug}`
}

export function studioPublicPath(slug = "[slug]") {
  return `${SITE_DOMAIN}/${slug}`
}

export const SUPPORT_EMAIL = "support@ruangtato.com"
export const PRIVACY_EMAIL = "privacy@ruangtato.com"
export const LEGAL_EMAIL = "legal@ruangtato.com"
export const BILLING_EMAIL = "billing@ruangtato.com"
