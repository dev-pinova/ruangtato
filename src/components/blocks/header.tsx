import type { HeaderOverlayLink } from "@/lib/types"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import type { Locale } from "@/lib/i18n/actions"
import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockHeader({ data, locale = "id" }: { data: any; locale?: Locale }) {
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

        <nav className="hidden items-center gap-6 text-xs uppercase tracking-widest text-white/65 md:flex">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher defaultLocale={locale} />
          <a
            href="#contact"
            className="inline-flex h-8 items-center bg-white px-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-black transition-colors hover:bg-white/90"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </header>
  )
}

