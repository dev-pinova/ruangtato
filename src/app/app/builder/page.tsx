import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { desc, eq } from "drizzle-orm"

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

  const latestPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.studioId, studio.id))
    .orderBy(desc(payments.createdAt))
    .limit(1)

  const latestPayment = latestPayments[0]
  const isPaid = latestPayment && (
    latestPayment.transactionStatus === "settlement" ||
    latestPayment.transactionStatus === "capture" ||
    latestPayment.transactionStatus === "success" ||
    (latestPayment.rawPayload && typeof latestPayment.rawPayload === "object" &&
      ((latestPayment.rawPayload as Record<string, any>).transaction_status === "settlement" ||
       (latestPayment.rawPayload as Record<string, any>).transaction_status === "capture")
    )
  )

  if (!isPaid) {
    redirect("/app/billing?warning=Selesaikan%20pembayaran%20sebesar%20Rp%20799.000%20terlebih%20dahulu%20untuk%20mengaktifkan%20fitur%20Builder.")
  }

  const hasSubscription = await studioHasActiveSubscription(studio.id)
  if (!hasSubscription) {
    redirect("/app/billing")
  }

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

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <BuilderUI studioId={studio.id} initialStudio={studio} />
      </main>
    </div>
  )
}
