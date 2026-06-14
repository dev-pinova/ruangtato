"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home, RotateCw } from "lucide-react"

import { MarketingShell } from "@/components/marketing/marketing-shell"
import { SectionHeading } from "@/components/design"
import { Button } from "@/components/ui/button"

/**
 * Route-level error boundary for the homepage. Catches render/data failures
 * (e.g. the database call in page.tsx throwing) and offers recovery instead
 * of a blank screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[homepage] render error:", error)
  }, [error])

  return (
    <MarketingShell>
      <section className="flex flex-1 items-center border-b border-border bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center md:px-6 md:py-28">
          <div
            className="mx-auto mb-6 inline-flex size-14 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
            aria-hidden
          >
            <AlertTriangle className="size-6" />
          </div>

          <SectionHeading
            as="h1"
            size="lg"
            align="center"
            title="Ada kendala memuat halaman"
            description="Maaf, kami gagal memuat daftar studio saat ini. Coba muat ulang sebentar lagi."
          />

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={reset} className="gap-2">
              <RotateCw className="size-4" aria-hidden />
              Coba lagi
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              className="gap-2"
              render={<Link href="/" />}
            >
              <Home className="size-4" aria-hidden />
              Kembali ke beranda
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
