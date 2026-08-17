"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/lib/i18n/language-provider"
import { SITE_DOMAIN, SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"


function MarketingHeader() {
  const { t } = useLanguage()

  const PRIMARY_NAV = [{ href: "/app", label: t.navigation.studios }]

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
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            className="hidden text-white/70 hover:bg-transparent hover:text-white md:inline-flex"
            render={<Link href="/login" />}
          >
            {t.navigation.login}
          </Button>
          <Button
            size="sm"
            variant="default"
            nativeButton={false}
            className="font-medium px-3.5 text-xs sm:text-sm transition-colors"
            render={<Link href="/register" />}
          >
            {t.cta.button}
          </Button>
        </div>
      </div>
    </header>
  )
}

function MarketingFooter() {
  const { t } = useLanguage()

  const FOOTER_LINKS = {
    platform: [
      { href: "/app", label: t.navigation.studios },
      { href: "/pricing", label: t.navigation.pricing },
      { href: "/help", label: t.navigation.help },
      { href: "/register", label: t.cta.button },
    ],
    legal: [
      { href: "/privacy", label: t.navigation.privacy },
      { href: "/terms", label: t.navigation.terms },
      { href: "/subscription", label: t.navigation.subscription },
      { href: "/cookies", label: t.navigation.cookies },
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

  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 md:px-6 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand Info */}
          <div className="sm:col-span-2 md:col-span-5 lg:col-span-5">
            <PlatformLogo variant="footer" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              {t.footer.desc}{" "}
              <a
                href={SITE_URL}
                className="font-medium text-neutral-300 underline-offset-4 hover:text-white hover:underline"
              >
                {SITE_DOMAIN}
              </a>
            </p>
            <div className="mt-5 space-y-1.5 text-xs text-neutral-500">
              <p className="leading-relaxed">Jalan Bunisari Nomor 22, Desa Kuta, Kec. Kuta, Kab. Badung, Provinsi Bali</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                <a href="mailto:Info@ruangtato.com" className="hover:text-neutral-300 transition-colors">
                  Info@ruangtato.com
                </a>
                <span className="text-neutral-700 hidden sm:inline">•</span>
                <a href="https://wa.me/628133985462" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">
                  +62 813-3985-462
                </a>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Platform
            </p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Legal
            </p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-3 lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Sosial
            </p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 sm:mt-16 flex flex-col items-center justify-between gap-3 border-t border-neutral-900 pt-6 sm:pt-8 md:flex-row text-center md:text-left">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()}{" "}
            <a
              href={SITE_URL}
              className="hover:text-neutral-300 transition-colors"
            >
              {SITE_DOMAIN}
            </a>
            . {t.footer.copyright}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
            {t.footer.madeWith}
            <Heart
              className="size-3 fill-red-500 text-red-500 inline"
              aria-hidden
            />
            {t.footer.forArtists}
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
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-200">
      <MarketingHeader />
      <main className={cn("flex-1", className)}>{children}</main>
      <MarketingFooter />
    </div>
  )
}

export { MarketingHeader, MarketingFooter }
