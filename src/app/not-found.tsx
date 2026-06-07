import type { Metadata } from "next"
import Link from "next/link"
import { Compass, HelpCircle, Home, LogIn } from "lucide-react"

import { SectionHeading } from "@/components/design"
import { MarketingShell } from "@/components/marketing/marketing-shell"
import { buttonVariants } from "@/components/ui/button"
import { createPageMetadata } from "@/lib/seo"
import { SITE_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  {
    href: "/",
    label: "Kembali ke Beranda",
    description: "Temukan studio tattoo di beranda",
    icon: Home,
    variant: "default" as const,
    primary: true,
  },
  {
    href: "/#browse",
    label: "Jelajahi Studio",
    description: "Lihat direktori studio terpercaya",
    icon: Compass,
    variant: "outline" as const,
    primary: false,
  },
  {
    href: "/login",
    label: "Masuk",
    description: "Akses dashboard studio Anda",
    icon: LogIn,
    variant: "outline" as const,
    primary: false,
  },
  {
    href: "/help",
    label: "Bantuan",
    description: "FAQ dan pusat bantuan",
    icon: HelpCircle,
    variant: "outline" as const,
    primary: false,
  },
]

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Halaman Tidak Ditemukan",
    description: `Halaman yang Anda cari tidak ada atau sudah dipindahkan. Kembali ke beranda ${SITE_NAME} atau jelajahi studio tattoo di Indonesia.`,
    noIndex: true,
  }),
  alternates: {},
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
}

export default function NotFound() {
  return (
    <MarketingShell>
      <section className="flex flex-1 items-center border-b border-border bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center md:px-6 md:py-28">
          <p
            className="font-serif text-8xl font-light tracking-tight text-muted-foreground/30 md:text-9xl"
            aria-hidden
          >
            404
          </p>

          <SectionHeading
            as="h1"
            size="lg"
            align="center"
            tagline="404"
            title="Halaman tidak ditemukan"
            description={
              <>
                Halaman yang Anda cari tidak ada, sudah dipindahkan, atau tautannya
                sudah tidak aktif. Tenang — studio tattoo terpercaya masih menunggu
                di beranda {SITE_NAME}.
              </>
            }
            className="mt-6"
          />

          <nav
            aria-label="Navigasi dari halaman 404"
            className="mt-10 grid gap-3 sm:grid-cols-2"
          >
            {NAV_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    buttonVariants({
                      variant: link.variant,
                      size: "lg",
                    }),
                    "h-auto flex-col items-start gap-1 px-4 py-3 text-left",
                    link.primary && "sm:col-span-2"
                  )}
                >
                  <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <Icon className="size-4" aria-hidden />
                    {link.label}
                  </span>
                  <span className="text-xs font-normal opacity-80">
                    {link.description}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </section>
    </MarketingShell>
  )
}
