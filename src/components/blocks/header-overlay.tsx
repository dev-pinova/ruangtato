"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"

import type { HeaderOverlayData, HeaderOverlayLink } from "@/lib/types"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import type { Locale } from "@/lib/i18n/actions"
import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

const DEFAULT_LEFT: HeaderOverlayLink[] = [
  { label: "Demos", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Gallery", href: "#gallery" },
]

const DEFAULT_RIGHT: HeaderOverlayLink[] = [
  { label: "News", href: "#news" },
  { label: "Features", href: "#features" },
  { label: "Contact Us", href: "#contact" },
]

function NavLink({ link, locale }: { link: HeaderOverlayLink; locale: Locale }) {
  const label = getLocalizedText(link, "label", locale, link.label)
  return (
    <a
      href={link.href || "#"}
      className="font-display text-[11px] uppercase tracking-[0.32em] text-white/80 transition-colors hover:text-white"
    >
      {label}
    </a>
  )
}

/**
 * Transparent overlay header dengan logo center dan menu kiri-kanan.
 * Cocok untuk hero full-bleed di belakangnya.
 */
export function BlockHeaderOverlay({
  data,
  locale = "id",
}: {
  data: HeaderOverlayData
  locale?: Locale
}) {
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

  const rawLeft = data?.leftLinks?.length ? data.leftLinks : DEFAULT_LEFT
  const rawRight = data?.rightLinks?.length ? data.rightLinks : DEFAULT_RIGHT
  const leftLinks = rawLeft.map((link) => ({
    ...link,
    label: getLocalizedText(link, "label", locale, link.label),
  }))
  const rightLinks = rawRight.map((link) => ({
    ...link,
    label: getLocalizedText(link, "label", locale, link.label),
  }))
  const logoText = getLocalizedText(data, "logoText", locale, data?.logoText ?? "Studio")
  const tagline = getLocalizedText(data, "tagline", locale, data?.tagline)
  const showCenterLogo = data?.showCenterLogo !== false

  return (
    <header className="absolute inset-x-0 top-0 z-40 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 md:px-10 md:py-8">
        {/* Logo */}
        <a
          href="#"
          aria-label={logoText}
          className="flex shrink-0 flex-col items-start md:items-center justify-center"
        >
          {data?.logoImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={data.logoImage}
              alt={logoText}
              className="h-8 md:h-10 max-w-[150px] md:max-w-[180px] object-contain"
            />
          ) : (
            <>
              <span className="font-display text-base md:text-lg font-semibold uppercase tracking-[0.4em] text-white">
                {logoText}
              </span>
              {tagline && (
                <span className="mt-0.5 text-[9px] uppercase tracking-[0.3em] text-white/60">
                  {tagline}
                </span>
              )}
            </>
          )}
        </a>

        {/* Right side: LanguageSwitcher + Hamburger toggle */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher defaultLocale={locale} />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="overlay-nav-drawer"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Navigation drawer (Desktop & Mobile) */}
      {open && (
        <div className="border-y border-white/10 bg-black/90 backdrop-blur-md">
          <nav
            ref={drawerNavRef}
            id="overlay-nav-drawer"
            tabIndex={-1}
            className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-6 md:px-10"
          >
            {[...leftLinks, ...rightLinks].map((link, i) => (
              <a
                key={i}
                href={link.href || "#"}
                onClick={closeDrawer}
                className="block py-3 font-display text-xs md:text-sm uppercase tracking-[0.32em] text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Language</span>
              <LanguageSwitcher defaultLocale={locale} />
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="mt-4 inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-white/70 hover:text-white"
            >
              <X className="size-3.5" />
              Close
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

