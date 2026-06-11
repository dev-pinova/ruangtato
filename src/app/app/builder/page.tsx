import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Lock, ShieldAlert } from "lucide-react"
import { eq } from "drizzle-orm"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { BuilderUI } from "@/components/builder/builder-ui"
import { Button } from "@/components/ui/button"
import { getServerSession } from "@/lib/auth/session"
import { getStudioForUser, studioHasActiveSubscription } from "@/lib/studio/studio-service"
import { db } from "@/db"
import { payments } from "@/db/schema"

function BuilderHeader({
  subtitle,
  badge,
}: {
  subtitle: string
  badge: ReactNode
}) {
  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950 px-3 sm:h-16 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <Button
          nativeButton={false}
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          render={<Link href="/app/dashboard" aria-label="Kembali ke dashboard" />}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PlatformLogo href="/app/dashboard" variant="builder" />
        <div className="mx-1 hidden h-4 w-px bg-white/10 sm:mx-2 sm:block" />
        <div className="hidden truncate text-sm font-medium tracking-wide text-muted-foreground sm:block">
          {subtitle}
        </div>
      </div>
      <div className="ml-2 shrink-0">{badge}</div>
    </header>
  )
}

export default async function BuilderPage() {
  if (!process.env.DATABASE_URL || !db) {
    redirect("/app/dashboard")
  }

  const session = await getServerSession()
  if (!session) {
    redirect("/login")
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio) {
    redirect("/register")
  }

  const studioPayments = await db.query.payments.findMany({
    where: eq(payments.studioId, studio.id),
  })

  const isPaid = studioPayments.some(p => 
    p.transactionStatus === "settlement" ||
    p.transactionStatus === "capture" ||
    p.transactionStatus === "success" ||
    (p.rawPayload && typeof p.rawPayload === "object" &&
      ((p.rawPayload as Record<string, any>).transaction_status === "settlement" ||
       (p.rawPayload as Record<string, any>).transaction_status === "capture")
    )
  )

  const hasSubscription = await studioHasActiveSubscription(studio.id)
  const isAllowed = isPaid || hasSubscription

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background selection:bg-primary selection:text-primary-foreground">
      <BuilderHeader
        subtitle="Landing Page Builder"
        badge={
          <div className="max-w-[10rem] truncate rounded-full border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-[10px] font-semibold text-primary sm:max-w-none sm:px-3 sm:text-xs">
            {studio.name}
          </div>
        }
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden relative">
        {!isAllowed ? (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
            <div className="max-w-md w-full rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center shadow-2xl backdrop-blur-md">
              <ShieldAlert className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-red-400 mb-2">Akses Terbatas: Selesaikan Pembayaran</h2>
              <p className="text-sm text-zinc-300 mb-6">
                Fitur Builder Halaman eksklusif untuk pengguna paket Pro. Anda harus menyelesaikan pembayaran sebesar Rp 799.000 untuk menggunakan fitur ini.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  render={<Link href="/checkout" />}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
                >
                  Selesaikan Pembayaran
                </Button>
                <Button
                  render={<Link href="/app/dashboard" />}
                  variant="outline"
                  className="border-white/10 hover:bg-white/5"
                >
                  Kembali
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Builder UI rendered but obscured/disabled if not allowed (or fully rendered if allowed) */}
        {isAllowed ? (
          <BuilderUI studioId={studio.id} initialStudio={studio} />
        ) : (
          <div className="opacity-20 pointer-events-none select-none h-full">
            <BuilderUI studioId={studio.id} initialStudio={studio} />
          </div>
        )}
      </main>
    </div>
  )
}
