import Link from "next/link"
import { Heart } from "lucide-react"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { Tagline } from "@/components/design"
import { Button } from "@/components/ui/button"
import { SITE_DOMAIN, SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

const PRIMARY_NAV = [{ href: "/#browse", label: "Browse" }]

const FOOTER_LINKS = {
  platform: [
    { href: "/#browse", label: "Browse" },
    { href: "/pricing", label: "Harga" },
    { href: "/help", label: "Bantuan" },
    { href: "/register", label: "Daftar Studio" },
  ],
  legal: [
    { href: "/privacy", label: "Kebijakan Privasi" },
    { href: "/terms", label: "Syarat & Ketentuan" },
    { href: "/subscription", label: "Kebijakan Langganan" },
    { href: "/cookies", label: "Kebijakan Cookie" },
  ],
  social: [
    {
      href: "https://api.whatsapp.com/send/?phone=628133985462&text&type=phone_number&app_absent=0",
      label: "WhatsApp",
    },
    { href: "https://web.facebook.com/ruangtato", label: "Facebook" },
    { href: "https://www.instagram.com/ruangtato", label: "Instagram" },
    { href: "https://www.tiktok.com/@ruangtato", label: "TikTok" },
  ],
}

function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <PlatformLogo variant="header" />
          <nav className="hidden items-center gap-6 md:flex">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            className="hidden text-white/70 hover:bg-transparent hover:text-white md:inline-flex"
            render={<Link href="/login" />}
          >
            Masuk
          </Button>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/register" />}
          >
            Daftar Studio
          </Button>
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
            <PlatformLogo variant="footer" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Platform landing page eksklusif untuk studio tattoo profesional di
              Indonesia.{" "}
              <a
                href={SITE_URL}
                className="font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
              >
                {SITE_DOMAIN}
              </a>
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
                    target="_blank"
                    rel="noopener noreferrer"
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
            &copy; {new Date().getFullYear()}{" "}
            <a
              href={SITE_URL}
              className="underline-offset-4 hover:underline"
            >
              {SITE_DOMAIN}
            </a>
            . Hak cipta dilindungi.
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            Dibuat dengan
            <Heart
              className="size-3 fill-red-500 text-red-500"
              aria-hidden
            />
            untuk artist tato Indonesia.
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
