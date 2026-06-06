"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

import type { HeaderOverlayData, HeaderOverlayLink } from "@/lib/types"

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

function NavLink({ link }: { link: HeaderOverlayLink }) {
  return (
    <a
      href={link.href || "#"}
      className="font-display text-[11px] uppercase tracking-[0.32em] text-white/80 transition-colors hover:text-white"
    >
      {link.label}
    </a>
  )
}

/**
 * Transparent overlay header dengan logo center dan menu kiri-kanan.
 * Cocok untuk hero full-bleed di belakangnya.
 */
export function BlockHeaderOverlay({ data }: { data: HeaderOverlayData }) {
  const [open, setOpen] = useState(false)

  const leftLinks = data?.leftLinks?.length ? data.leftLinks : DEFAULT_LEFT
  const rightLinks = data?.rightLinks?.length ? data.rightLinks : DEFAULT_RIGHT
  const logoText = data?.logoText ?? "Studio"
  const tagline = data?.tagline
  const showCenterLogo = data?.showCenterLogo !== false

  return (
    <header className="absolute inset-x-0 top-0 z-40 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 md:px-10 md:py-8">
        {/* Desktop: nav kiri */}
        <nav className="hidden flex-1 items-center justify-end gap-8 md:flex lg:gap-12">
          {leftLinks.map((link, i) => (
            <NavLink key={`l-${i}`} link={link} />
          ))}
        </nav>

        {/* Logo center */}
        {showCenterLogo ? (
          <a
            href="#"
            aria-label={logoText}
            className="hidden shrink-0 flex-col items-center justify-center px-6 md:flex"
          >
            <span className="font-display text-lg font-semibold uppercase tracking-[0.4em] text-white">
              {logoText}
            </span>
            {tagline && (
              <span className="mt-1 text-[9px] uppercase tracking-[0.3em] text-white/60">
                {tagline}
              </span>
            )}
          </a>
        ) : (
          <div className="shrink-0 px-6" />
        )}

        {/* Desktop: nav kanan */}
        <nav className="hidden flex-1 items-center justify-start gap-8 md:flex lg:gap-12">
          {rightLinks.map((link, i) => (
            <NavLink key={`r-${i}`} link={link} />
          ))}
        </nav>

        {/* Mobile: logo kiri + hamburger */}
        <a
          href="#"
          className="font-display text-base font-semibold uppercase tracking-[0.3em] text-white md:hidden"
        >
          {logoText}
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden">
          <div className="border-y border-white/10 bg-black/85 backdrop-blur-md">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {[...leftLinks, ...rightLinks].map((link, i) => (
                <a
                  key={i}
                  href={link.href || "#"}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-display text-xs uppercase tracking-[0.32em] text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-white/70"
              >
                <X className="size-3" />
                Close
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
