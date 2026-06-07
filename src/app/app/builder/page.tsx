import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { BuilderUI } from "@/components/builder/builder-ui"
import { Button } from "@/components/ui/button"
import { getServerSession } from "@/lib/session"
import { getStudioForUser, studioHasActiveSubscription } from "@/lib/studio-service"

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
  if (!process.env.DATABASE_URL) {
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

  const hasSubscription = await studioHasActiveSubscription(studio.id)
  if (!hasSubscription) {
    redirect("/app/billing")
  }

  return (
    <div className="flex h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <BuilderHeader
        subtitle="Landing Page Builder"
        badge={
          <div className="max-w-[10rem] truncate rounded-full border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-[10px] font-semibold text-primary sm:max-w-none sm:px-3 sm:text-xs">
            {studio.name}
          </div>
        }
      />

      <main className="min-h-0 flex-1">
        <BuilderUI studioId={studio.id} initialStudio={studio} />
      </main>
    </div>
  )
}
