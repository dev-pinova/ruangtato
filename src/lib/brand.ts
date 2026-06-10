/** Brand color tokens — Ruangtato design system */
export const BRAND_INK_BLACK = "#121212"
export const BRAND_INK_STROKE = "#1C1C1E"
export const BRAND_SCARLET = "#FF3B30"
export const BRAND_CANVAS = "#FFFFFF"
export const BRAND_FRAME_DARK = "#2C2C2E"
export const BRAND_FRAME_LIGHT = "#D1D1D6"

/** Combination mark lockup — visual only; SITE_NAME stays human-readable for SEO */
export const BRAND_WORDMARK_PREFIX = "RUANG"
export const BRAND_WORDMARK_SUFFIX = "TATO"

export type LogoTone = "dark" | "light"

type MonogramOptions = {
  tone: LogoTone
  showFrame?: boolean
}

/** Monogram RT paths — shared between React SVG and static assets */
export function monogramStrokeColor(tone: LogoTone) {
  return tone === "dark" ? BRAND_CANVAS : BRAND_INK_STROKE
}

export function monogramFrameColors(tone: LogoTone) {
  return {
    circle: tone === "dark" ? BRAND_FRAME_DARK : BRAND_FRAME_LIGHT,
    rect: BRAND_SCARLET,
    rectOpacity: tone === "dark" ? 0.4 : 0.5,
  }
}

/** Build favicon / OG SVG string (full app-icon frame) */
export function buildLogoMarkSvg({ tone, showFrame = true }: MonogramOptions) {
  const stroke = monogramStrokeColor(tone)
  const { circle, rect, rectOpacity } = monogramFrameColors(tone)

  const frame = showFrame
    ? `<circle cx="100" cy="100" r="90" fill="none" stroke="${circle}" stroke-width="2" stroke-dasharray="4 4"/>
  <rect x="35" y="35" width="130" height="130" rx="16" fill="none" stroke="${rect}" stroke-width="3" opacity="${rectOpacity}"/>`
    : ""

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  ${frame}
  <path d="M70 65 H135" stroke="${stroke}" stroke-width="10" stroke-linecap="square"/>
  <path d="M95 65 V135 L100 148 L105 135" fill="none" stroke="${stroke}" stroke-width="10" stroke-linecap="square" stroke-linejoin="miter"/>
  <path d="M95 65 C135 65, 135 100, 95 100" fill="none" stroke="${stroke}" stroke-width="10" stroke-linecap="square"/>
  <path d="M105 100 L130 138" stroke="${stroke}" stroke-width="10" stroke-linecap="square"/>
</svg>`
}

export function logoMarkDataUri(options: MonogramOptions) {
  const svg = buildLogoMarkSvg(options)
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
}
