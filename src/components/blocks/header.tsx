"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X } from "lucide-react"

import type { HeaderOverlayLink } from "@/lib/types"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import type { Locale } from "@/lib/i18n/actions"
import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockHeader({ data, locale = "id" }: { data: any; locale?: Locale }) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const drawerNavRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return

    const firstLink = drawerNavRef.current?.querySelector<HTMLAnchorElement>("a")
    ;(firstLink ?? drawerNavRef.current)?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  function closeDrawer() {
    setOpen(false)
    toggleRef.current?.focus()
  }

  const defaultLinks: HeaderOverlayLink[] = locale === "en"
    ? [
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Artists", href: "#artists" },
        { label: "Clients", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ]
    : [
        { label: "Tentang", href: "#about" },
        { label: "Layanan", href: "#services" },
        { label: "Artist", href: "#artists" },
        { label: "Klien", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ]

  const rawLinks: HeaderOverlayLink[] = data?.links || defaultLinks
  const links = rawLinks.map((link) => ({
    ...link,
    label: getLocalizedText(link, "label", locale, link.label),
  }))

  const ctaText = getLocalizedText(data, "ctaText", locale, locale === "en" ? "Booking" : "Booking")

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-md text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="font-sans text-base font-medium tracking-wider text-white">
          {data?.logoImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={data.logoImage}
              alt={data?.title || "Logo"}
              className="h-8 max-w-[150px] object-contain"
            />
          ) : (
            data?.title || "Studio Name"
          )}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher defaultLocale={locale} />
          <a
            href="#contact"
            className="inline-flex h-8 items-center bg-white px-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-black transition-colors hover:bg-white/90"
          >
            {ctaText}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="header-nav-drawer"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Navigation drawer (Desktop & Mobile) */}
      {open && (
        <div className="border-t border-white/10 bg-black/90 backdrop-blur-lg">
          <nav
            ref={drawerNavRef}
            id="header-nav-drawer"
            tabIndex={-1}
            className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-6"
          >
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href || "#"}
                onClick={closeDrawer}
                className="block py-3 font-display text-sm uppercase tracking-[0.3em] text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <a
                href="#contact"
                onClick={closeDrawer}
                className="inline-flex h-10 items-center justify-center bg-white px-6 font-display text-xs uppercase tracking-[0.2em] font-semibold text-black transition-colors hover:bg-white/90"
              >
                {ctaText}
              </a>
              <button
                type="button"
                onClick={closeDrawer}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/70 hover:text-white"
              >
                <X className="size-3.5" />
                Close
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
