import type { HeaderOverlayLink } from "@/lib/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockHeader({ data }: { data: any }) {
  const links: HeaderOverlayLink[] = data?.links || [
    { label: "Tentang", href: "#about" },
    { label: "Layanan", href: "#services" },
    { label: "Artist", href: "#artists" },
    { label: "Klien", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-md text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="font-sans text-base font-medium tracking-wider text-white">
          {data?.logoImage ? (
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

        <a
          href="#contact"
          className="inline-flex h-8 items-center bg-white px-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-black transition-colors hover:bg-white/90"
        >
          {data?.ctaText || "Booking"}
        </a>
      </div>
    </header>
  )
}
