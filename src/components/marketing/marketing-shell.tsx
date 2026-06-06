import Link from "next/link"

import { Tagline } from "@/components/design"
import { cn } from "@/lib/utils"

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-sans text-base font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <span className="relative inline-flex size-6 items-center justify-center rounded-md bg-primary">
        <span className="size-2 rounded-sm bg-primary-foreground" />
      </span>
      Ruang Tato
    </Link>
  )
}

const PRIMARY_NAV = [
  { href: "/", label: "Direktori" },
  { href: "/pricing", label: "Harga" },
  { href: "/help", label: "Bantuan" },
]

const FOOTER_LINKS = {
  platform: [
    { href: "/", label: "Direktori Studio" },
    { href: "/pricing", label: "Harga" },
    { href: "/help", label: "Pusat Bantuan" },
    { href: "/register", label: "Daftar Studio" },
  ],
  legal: [
    { href: "/privacy", label: "Kebijakan Privasi" },
    { href: "/terms", label: "Syarat & Ketentuan" },
    { href: "/cookies", label: "Kebijakan Cookie" },
  ],
  social: [
    { href: "#", label: "Instagram" },
    { href: "#", label: "Twitter" },
    { href: "#", label: "Email" },
  ],
}

function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Daftar Studio
          </Link>
        </div>
      </div>
    </header>
  )
}

function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Platform landing page eksklusif untuk studio tato profesional di
              Indonesia.
            </p>
          </div>

          <div>
            <Tagline>Platform</Tagline>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Tagline>Legal</Tagline>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Tagline>Sosial</Tagline>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Ruang Tato. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-muted-foreground">
            Dibuat untuk artist tato Indonesia.
          </p>
        </div>
      </div>
    </footer>
  )
}

export function MarketingShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className={cn("flex-1", className)}>{children}</main>
      <MarketingFooter />
    </div>
  )
}

export { MarketingHeader, MarketingFooter }
