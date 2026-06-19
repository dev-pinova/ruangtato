"use client"

import { normalizeGoogleMapsEmbedUrl } from "@/lib/google-maps-embed"
import type { FooterData } from "@/lib/types"

function formatSocialHandle(urlOrHandle: string, fallbackName: string, prefix = "") {
  if (!urlOrHandle) return ""
  let handle = urlOrHandle.trim()
  if (handle.includes("/")) {
    const parts = handle.replace(/\/$/, "").split("/")
    handle = parts[parts.length - 1]
  }
  handle = handle.replace(/^@/, "")
  return prefix ? `${prefix}${handle}` : handle
}

function formatWhatsAppLabel(whatsappValue: string) {
  if (!whatsappValue) return ""
  const val = whatsappValue.trim()
  if (val.startsWith("http")) {
    return "WhatsApp Chat"
  }
  return val.replace(/[^\d+]/g, "")
}

export function BlockFooter({ data }: { data: FooterData }) {
  const title = data?.title || "Studio Name"
  const address = data?.address || "Jakarta, Indonesia"
  const instagram = data?.instagram
  const whatsapp = data?.whatsapp
  const facebook = data?.facebook
  const tiktok = data?.tiktok

  const showMap = data?.showMap === true
  const mapHeight = data?.mapHeight ?? 200
  const mapEmbedUrl = data?.mapEmbedUrl?.trim() ?? ""
  const normalizedMapUrl = mapEmbedUrl
    ? normalizeGoogleMapsEmbedUrl(mapEmbedUrl)
    : null

  const hasValidMap = Boolean(normalizedMapUrl)

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
        {/* 3-Column Layout */}
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          
          {/* Column 1: Contact Info */}
          <div className="space-y-6">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-white">
              Contact
            </h3>
            <div className="space-y-4 font-sans text-sm text-white/70">
              {data?.logoImage ? (
                <img
                  // eslint-disable-next-line @next/next/no-img-element
                  src={data.logoImage}
                  alt={title}
                  className="h-10 max-w-[150px] object-contain"
                />
              ) : (
                <p className="font-display text-lg font-semibold uppercase tracking-[0.2em] text-white">
                  {title}
                </p>
              )}
              {data?.description && (
                <p className="leading-relaxed text-xs text-white/50">
                  {data.description}
                </p>
              )}
              {address && (
                <p className="leading-relaxed">
                  {address}
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Social Media Platforms (Icons vertically stacked with usernames) */}
          <div className="space-y-6">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-white">
              Social Media
            </h3>
            <div className="flex flex-col gap-4">
              {instagram && (
                <a
                  href={
                    instagram.startsWith("http")
                      ? instagram
                      : `https://instagram.com/${instagram.replace(/^@/, "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group text-sm text-white/70 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all group-hover:bg-white group-hover:text-black group-hover:border-white">
                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </span>
                  <span className="font-display text-xs uppercase tracking-[0.16em] group-hover:underline">
                    {formatSocialHandle(instagram, title, "@")}
                  </span>
                </a>
              )}
              {tiktok && (
                <a
                  href={
                    tiktok.startsWith("http")
                      ? tiktok
                      : `https://tiktok.com/@${tiktok.replace(/^@/, "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group text-sm text-white/70 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all group-hover:bg-white group-hover:text-black group-hover:border-white">
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.75-3.95-1.72-.07.82-.12 1.64-.17 2.45-.13 2.12-.97 4.22-2.51 5.71-1.61 1.61-3.95 2.51-6.24 2.43-2.67-.03-5.32-1.49-6.64-3.81-1.48-2.51-1.43-5.91.22-8.31 1.41-2.12 3.96-3.41 6.53-3.23.08 1.34.02 2.69.04 4.03-1.12-.08-2.3.36-3.03 1.22-.84.94-1.01 2.33-.56 3.5.47 1.27 1.83 2.13 3.17 2.05 1.4-.02 2.73-.97 3.23-2.28.32-.78.36-1.64.35-2.48V.02z"/>
                    </svg>
                  </span>
                  <span className="font-display text-xs uppercase tracking-[0.16em] group-hover:underline">
                    {formatSocialHandle(tiktok, title, "@")}
                  </span>
                </a>
              )}
              {facebook && (
                <a
                  href={
                    facebook.startsWith("http")
                      ? facebook
                      : `https://facebook.com/${facebook}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group text-sm text-white/70 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all group-hover:bg-white group-hover:text-black group-hover:border-white">
                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </span>
                  <span className="font-display text-xs uppercase tracking-[0.16em] group-hover:underline">
                    {formatSocialHandle(facebook, title, "")}
                  </span>
                </a>
              )}
              {whatsapp && (
                <a
                  href={
                    whatsapp.startsWith("http")
                      ? whatsapp
                      : `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group text-sm text-white/70 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all group-hover:bg-white group-hover:text-black group-hover:border-white">
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.012 2.25c-5.38 0-9.75 4.37-9.75 9.75 0 1.9.54 3.67 1.48 5.18L2.5 22.5l5.52-1.44a9.7 9.7 0 0 0 3.99.88c5.38 0 9.75-4.37 9.75-9.75s-4.37-9.75-9.75-9.75zm5.54 12.87c-.24.68-1.22 1.25-1.7 1.29-.44.04-.87.21-2.82-.57-2.35-.94-3.86-3.32-3.98-3.48-.12-.16-.97-1.29-.97-2.47 0-1.18.61-1.76.83-2 .22-.24.48-.3.64-.3.16 0 .32.01.46.01.15 0 .35-.06.55.42.2.49.69 1.68.75 1.8.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.26.32-.37.43-.12.12-.25.25-.11.49.14.24.62 1.03 1.34 1.67.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.61-.71.77-.95.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.57-.18 1.25z"/>
                    </svg>
                  </span>
                  <span className="font-display text-xs uppercase tracking-[0.16em] group-hover:underline">
                    {formatWhatsAppLabel(whatsapp)}
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Column 3: Google Maps Snippet */}
          <div className="space-y-6 sm:col-span-2 md:col-span-1">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-white">
              Location
            </h3>
            {showMap && hasValidMap ? (
              <div
                className="overflow-hidden border border-white/10"
                style={{ height: mapHeight }}
              >
                <iframe
                  src={normalizedMapUrl!}
                  title="Lokasi studio footer"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                  allowFullScreen
                />
              </div>
            ) : showMap ? (
              <div
                className="flex items-center justify-center border border-dashed border-white/20 bg-white/5 px-6 text-center"
                style={{ height: mapHeight, minHeight: 150 }}
              >
                <p className="font-display text-[10px] uppercase tracking-[0.28em] text-white/40">
                  {mapEmbedUrl ? "URL embed tidak valid" : "Masukkan URL Google Maps"}
                </p>
              </div>
            ) : (
              <p className="font-sans text-sm text-white/55 leading-relaxed">
                Peta lokasi dinonaktifkan. Aktifkan fitur peta lokasi pada panel kustomisasi footer.
              </p>
            )}
          </div>
        </div>

        {/* Footer Bottom copyright info */}
        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-[10px] uppercase tracking-[0.32em] text-white/40 md:flex-row">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {title}. All Rights Reserved.
          </p>
          <p>Powered By Ruang Tato</p>
        </div>
      </div>
    </footer>
  )
}
