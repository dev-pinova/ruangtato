"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Paintbrush,
  BarChart3,
  Settings,
  ExternalLink,
  CreditCard,
} from "lucide-react"
import { AppShell, type AppShellNavGroup, type AppShellNavItem } from "@/components/layout/app-shell"

const NAV_ITEMS: AppShellNavItem[] = [
  { href: "/app/builder", label: "Builder Halaman", icon: Paintbrush },
  { href: "/app/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings", label: "Pengaturan", icon: Settings },
]

type StudioSummary = {
  name: string
  slug: string
  isPublished: boolean
}

type MeUser = {
  name: string
  email: string
}

function getInitials(name: string | undefined) {
  if (!name?.trim()) return "?"
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  )
}

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<MeUser | null>(null)
  const [studio, setStudio] = useState<StudioSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    function applyStudioSummary(data: {
      name: string
      slug: string
      isPublished: boolean
    }) {
      setStudio({
        name: data.name,
        slug: data.slug,
        isPublished: data.isPublished,
      })
    }

    function onStudioProfileUpdated(event: Event) {
      const detail = (event as CustomEvent<StudioSummary>).detail
      if (detail) applyStudioSummary(detail)
    }

    fetch("/api/studios/me")
      .then(async (r) => {
        if (r.status === 403) {
          const json = await r.json().catch(() => null)
          if (json?.suspended) {
            router.push("/app/account-suspended")
            return null
          }
        }
        return r.ok ? r.json() : null
      })
      .then((data) => {
        if (!data) return
        if (data?.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
          })
        }
        if (data?.studio) {
          applyStudioSummary(data.studio)
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })

    window.addEventListener("studio-profile-updated", onStudioProfileUpdated)
    return () => {
      window.removeEventListener("studio-profile-updated", onStudioProfileUpdated)
    }
  }, [router])

  // Public path exception
  if (pathname.startsWith("/app/studio/") || pathname === "/app/builder") {
    return <>{children}</>
  }

  const initials = getInitials(user?.name)

  const navGroups: AppShellNavGroup[] = [
    {
      label: "Studio",
      items: NAV_ITEMS,
    },
    ...(studio
      ? [
          {
            label: "Publik",
            items: [
              {
                href: `/app/studio/${studio.slug}`,
                label: "Lihat Studio",
                icon: ExternalLink,
                external: true,
              },
            ],
          },
        ]
      : []),
  ]

  const topBarLeft = (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
      ) : (
        <>
          <span className="text-sm font-medium">
            {studio?.name ?? "Studio Anda"}
          </span>
          {studio?.isPublished ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              Live
            </span>
          ) : null}
        </>
      )}
    </div>
  )

  const mobileShortcuts = NAV_ITEMS.filter(
    (item) => item.href !== "/app/builder" && item.href !== "/app/settings"
  )

  const appUser = user ? {
    name: user.name,
    email: user.email,
    initials,
  } : null

  return (
    <AppShell
      user={appUser}
      isLoadingUser={isLoading}
      navGroups={navGroups}
      mobileShortcuts={mobileShortcuts}
      logoHref="/app/dashboard"
      signOutRedirect="/login"
      topBarLeft={topBarLeft}
    >
      {children}
    </AppShell>
  )
}
