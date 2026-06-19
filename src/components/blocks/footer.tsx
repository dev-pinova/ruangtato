"use client"

import { normalizeGoogleMapsEmbedUrl } from "@/lib/google-maps-embed"
import type { FooterData } from "@/lib/types"

export function BlockFooter({ data }: { data: FooterData }) {
  const title = data?.title || "Studio Name"
  const address = data?.address || "Jakarta, Indonesia"
  const instagram = data?.instagram
  const whatsapp = data?.whatsapp
  const facebook = data?.facebook
  const tiktok = data?.tiktok
  const email = data?.email

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
              <p className="font-display text-lg font-semibold uppercase tracking-[0.2em] text-white">
                {title}
              </p>
              {address && (
                <p className="leading-relaxed">
                  {address}
                </p>
              )}
              <div className="space-y-1">
                {email && (
                  <p>
                    <span className="font-display text-[10px] uppercase tracking-[0.2em] text-white/40">Email:</span>{" "}
                    <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                      {email}
                    </a>
                  </p>
                )}
                {whatsapp && (
                  <p>
                    <span className="font-display text-[10px] uppercase tracking-[0.2em] text-white/40">WhatsApp:</span>{" "}
                    <a
                      href={
                        whatsapp.startsWith("http")
                          ? whatsapp
                          : `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {whatsapp.replace(/^https:\/\/wa\.me\//, "") || "Chat Us"}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Social Media Platforms */}
          <div className="space-y-6">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-white">
              Social Media
            </h3>
            <ul className="space-y-3 font-display text-[11px] uppercase tracking-[0.32em] text-white/70">
              {instagram && (
                <li>
                  <a
                    href={
                      instagram.startsWith("http")
                        ? instagram
                        : `https://instagram.com/${instagram.replace(/^@/, "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {facebook && (
                <li>
                  <a
                    href={
                      facebook.startsWith("http")
                        ? facebook
                        : `https://facebook.com/${facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Facebook
                  </a>
                </li>
              )}
              {tiktok && (
                <li>
                  <a
                    href={
                      tiktok.startsWith("http")
                        ? tiktok
                        : `https://tiktok.com/@${tiktok.replace(/^@/, "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    TikTok
                  </a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a
                    href={
                      whatsapp.startsWith("http")
                        ? whatsapp
                        : `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
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
