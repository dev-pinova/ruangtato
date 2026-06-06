const ALLOWED_HOSTS = new Set([
  "www.google.com",
  "google.com",
  "maps.google.com",
])

function extractSrcFromIframe(html: string): string | null {
  const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/i)
  return match?.[1]?.trim() ?? null
}

function isAllowedEmbedHost(hostname: string): boolean {
  if (ALLOWED_HOSTS.has(hostname)) return true
  return hostname.endsWith(".google.com") && hostname.includes("maps")
}

export function isValidGoogleMapsEmbedUrl(url: string): boolean {
  const normalized = normalizeGoogleMapsEmbedUrl(url)
  return normalized !== null
}

/** Normalisasi URL embed Google Maps dari URL mentah atau snippet iframe. */
export function normalizeGoogleMapsEmbedUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  let candidate = trimmed

  if (trimmed.includes("<iframe")) {
    const extracted = extractSrcFromIframe(trimmed)
    if (!extracted) return null
    candidate = extracted
  }

  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return null
  }

  if (parsed.protocol !== "https:") return null
  if (!isAllowedEmbedHost(parsed.hostname)) return null
  if (!parsed.pathname.startsWith("/maps/embed")) return null

  return parsed.toString()
}
