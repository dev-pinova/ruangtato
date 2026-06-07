export const SITE_NAME = "Ruang Tato"

/** Logo putih platform (PNG dengan background hitam). */
export const PLATFORM_LOGO_PATH = "/ruang-tato/logo-putih.png"

/** Domain utama platform */
export const SITE_URL = "https://www.ruangtato.com"

export const SITE_DOMAIN = "www.ruangtato.com"

export const STUDIO_PATH_PREFIX = "/app/studio"

/** Tampilan URL publik tanpa slug, mis. www.ruangtato.com/app/studio/ */
export const STUDIO_URL_DISPLAY_PREFIX = `${SITE_DOMAIN}${STUDIO_PATH_PREFIX}/`

export function studioPublicUrl(slug: string) {
  return `${SITE_URL}${STUDIO_PATH_PREFIX}/${slug}`
}

export function studioPublicPath(slug = "[slug]") {
  return `${SITE_DOMAIN}${STUDIO_PATH_PREFIX}/${slug}`
}

export const SUPPORT_EMAIL = "support@ruangtato.com"
export const PRIVACY_EMAIL = "privacy@ruangtato.com"
export const LEGAL_EMAIL = "legal@ruangtato.com"
export const BILLING_EMAIL = "billing@ruangtato.com"
