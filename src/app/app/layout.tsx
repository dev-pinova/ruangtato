"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Paintbrush,
  BarChart3,
  CreditCard,
  Settings,
  ExternalLink,
  Menu,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { authClient } from "@/lib/auth-client"

const NAV_ITEMS = [
  { href: "/app/builder", label: "Builder", icon: Paintbrush },
  { href: "/app/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings", label: "Pengaturan", icon: Settings },
]

function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      href="/app/dashboard"
      aria-label="Ruang Tato"
      className="inline-flex items-center gap-2 font-sans text-sm font-semibold tracking-tight"
    >
      <span className="relative inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-primary">
        <span className="size-2 rounded-sm bg-primary-foreground" />
      </span>
      {!collapsed && <span>Ruang Tato</span>}
    </Link>
  )
}

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed"
const SIDEBAR_CHANGE_EVENT = "sidebar-collapsed-change"

function getCollapsedSnapshot(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true"
  } catch {
    return false
  }
}

function getCollapsedServerSnapshot(): boolean {
  return false
}

function subscribeCollapsed(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  window.addEventListener("storage", callback)
  window.addEventListener(SIDEBAR_CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(SIDEBAR_CHANGE_EVENT, callback)
  }
}

function writeCollapsed(value: boolean) {
  try {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value))
    window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT))
  } catch {
    // ignore storage write failures
  }
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

type StudioSummary = {
  name: string
  slug: string
  isPublished: boolean
}

type MeUser = {
  name: string
  email: string
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<MeUser | null>(null)
  const [studio, setStudio] = useState<StudioSummary | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot
  )

  function toggleCollapsed() {
    writeCollapsed(!collapsed)
  }

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
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
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

    window.addEventListener("studio-profile-updated", onStudioProfileUpdated)
    return () => {
      window.removeEventListener("studio-profile-updated", onStudioProfileUpdated)
    }
  }, [])

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  const userName = user?.name ?? "Memuat…"
  const userEmail = user?.email ?? ""
  const initials = getInitials(user?.name)
  const userTitle = userEmail ? `${userName} — ${userEmail}` : userName

  if (pathname.startsWith("/app/studio/") || pathname === "/app/builder") {
    return <>{children}</>
  }

  function renderNavLinks(
    opts: { onNavigate?: () => void; collapsed?: boolean } = {}
  ) {
    const isCollapsed = opts.collapsed ?? false
    return (
      <nav
        className={cn(
          "flex flex-col gap-0.5",
          isCollapsed ? "px-2" : "px-3"
        )}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={opts.onNavigate}
              title={isCollapsed ? item.label : undefined}
              aria-label={isCollapsed ? item.label : undefined}
              className={cn(
                "group/nav-item flex items-center rounded-md text-sm transition-colors",
                isCollapsed
                  ? "h-9 justify-center"
                  : "gap-2.5 px-2.5 py-1.5",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        data-collapsed={collapsed ? "true" : "false"}
        className={cn(
          "hidden shrink-0 flex-col border-r border-border bg-background transition-all duration-200 md:flex",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-border shrink-0",
            collapsed ? "justify-center px-2" : "px-5"
          )}
        >
          <Logo collapsed={collapsed} />
        </div>

        <div
          className={cn(
            "flex shrink-0 border-b border-border py-2",
            collapsed ? "justify-center px-2" : "justify-end px-3"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {!collapsed && (
            <p className="px-6 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Studio
            </p>
          )}
          {renderNavLinks({ collapsed })}

          {!collapsed && (
            <p className="mt-6 px-6 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Publik
            </p>
          )}
          <nav
            className={cn(
              "flex flex-col gap-0.5",
              collapsed ? "mt-4 px-2" : "px-3"
            )}
          >
            {studio ? (
              <a
                href={`/app/studio/${studio.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                title={collapsed ? "Lihat Studio" : undefined}
                aria-label={collapsed ? "Lihat Studio" : undefined}
                className={cn(
                  "flex items-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
                  collapsed
                    ? "h-9 justify-center"
                    : "gap-2.5 px-2.5 py-1.5"
                )}
              >
                <ExternalLink className="size-4 shrink-0" />
                {!collapsed && <span>Lihat Studio</span>}
              </a>
            ) : null}
          </nav>
        </div>

        <div className="border-t border-border p-3 shrink-0">
          <div
            className={cn(
              "flex items-center rounded-md",
              collapsed ? "justify-center" : "gap-3 px-2.5 py-1.5"
            )}
            title={collapsed ? userTitle : undefined}
          >
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{userName}</p>
                {userEmail ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 md:px-6 gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="md:hidden" />
                }
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" showCloseButton={false} className="p-0">
                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                <div className="flex h-14 items-center border-b border-border px-5 shrink-0">
                  <Logo />
                </div>
                <div className="py-4">
                  <p className="px-6 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Studio
                  </p>
                  {renderNavLinks({
                    onNavigate: () => setMobileOpen(false),
                  })}
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {studio?.name ?? "Studio Anda"}
              </span>
              {studio?.isPublished ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Live
                </span>
              ) : null}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full" />
              }
            >
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuItem
                render={<Link href="/app/settings" />}
              >
                <User className="size-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/app/settings" />}
              >
                <Settings className="size-4" />
                Pengaturan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                <LogOut className="size-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
