"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Paintbrush,
  BarChart3,
  Settings,
  ExternalLink,
  Menu,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  CreditCard,
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { PlatformLogo } from "@/components/brand/platform-logo"
import { authClient } from "@/lib/auth/auth-client"

const NAV_ITEMS = [
  { href: "/app/builder", label: "Builder Halaman", icon: Paintbrush },
  { href: "/app/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings", label: "Pengaturan", icon: Settings },
]

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

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<MeUser | null>(null)
  const [studio, setStudio] = useState<StudioSummary | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
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

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      await authClient.signOut()
      router.push("/login")
      router.refresh()
    } finally {
      setIsSigningOut(false)
      setShowLogoutDialog(false)
    }
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
            <motion.div
              key={item.href}
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href={item.href}
                onClick={opts.onNavigate}
                title={isCollapsed ? item.label : undefined}
                aria-label={isCollapsed ? item.label : undefined}
                className={cn(
                  "group/nav-item relative flex items-center rounded-md text-sm transition-colors",
                  isCollapsed
                    ? "h-9 justify-center"
                    : "gap-2.5 pl-4 pr-2.5 py-1.5",
                  isActive
                    ? "bg-muted/30 text-white font-medium"
                    : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                )}
              >
                {isActive && !isCollapsed && (
                  <span className="absolute left-0.5 top-2.5 bottom-2.5 w-0.5 rounded bg-[var(--brand-scarlet)]" />
                )}
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    isActive ? "text-white" : "text-muted-foreground group-hover/nav-item:text-foreground"
                  )}
                />
                <span
                  className={cn(
                    "transition-all duration-300 ease-in-out whitespace-nowrap",
                    isCollapsed
                      ? "opacity-0 w-0 overflow-hidden pointer-events-none"
                      : "opacity-100 w-auto"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </motion.div>
          )
        })}
      </nav>
    )
  }

  return (
    <div className="relative flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        data-collapsed={collapsed ? "true" : "false"}
        className={cn(
          "absolute left-0 inset-y-0 z-20 hidden shrink-0 flex-col border-r border-border bg-background transition-all duration-300 ease-in-out md:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-3 z-30 h-6 w-6 rounded-full border border-border bg-background p-0 text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        <div
          className={cn(
            "flex h-14 items-center border-b border-border/60 shrink-0 transition-all duration-300 ease-in-out",
            collapsed ? "justify-center px-2" : "px-5"
          )}
        >
          <PlatformLogo href="/app/dashboard" variant="app" collapsed={collapsed} />
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <p
            className={cn(
              "px-6 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-all duration-300 ease-in-out whitespace-nowrap",
              collapsed ? "opacity-0 w-0 h-0 overflow-hidden pb-0 pointer-events-none" : "opacity-100"
            )}
          >
            Studio
          </p>
          {renderNavLinks({ collapsed })}

          <p
            className={cn(
              "px-6 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-all duration-300 ease-in-out whitespace-nowrap",
              collapsed ? "opacity-0 w-0 h-0 overflow-hidden pb-0 mt-0 pointer-events-none" : "opacity-100 mt-6"
            )}
          >
            Publik
          </p>
          <nav
            className={cn(
              "flex flex-col gap-0.5",
              collapsed ? "mt-4 px-2" : "px-3"
            )}
          >
            {studio ? (
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <a
                  href={`/app/studio/${studio.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={collapsed ? "Lihat Studio" : undefined}
                  aria-label={collapsed ? "Lihat Studio" : undefined}
                  className={cn(
                    "flex items-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground",
                    collapsed
                      ? "h-9 justify-center"
                      : "gap-2.5 px-2.5 py-1.5"
                  )}
                >
                  <ExternalLink className="size-4 shrink-0" />
                  <span
                    className={cn(
                      "transition-all duration-300 ease-in-out whitespace-nowrap",
                      collapsed
                        ? "opacity-0 w-0 overflow-hidden pointer-events-none"
                        : "opacity-100 w-auto"
                    )}
                  >
                    Lihat Studio
                  </span>
                </a>
              </motion.div>
            ) : null}
          </nav>
        </div>

        <div className="border-t border-border p-3 shrink-0">
          {isLoading ? (
            <div
              className={cn(
                "flex items-center",
                collapsed ? "justify-center" : "gap-3 px-2.5 py-1.5 animate-pulse"
              )}
            >
              <div className="size-8 rounded-full bg-muted shrink-0" />
              <div
                className={cn(
                  "flex-1 space-y-1.5 transition-all duration-300 ease-in-out whitespace-nowrap",
                  collapsed ? "opacity-0 w-0 overflow-hidden pointer-events-none" : "opacity-100 w-auto"
                )}
              >
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-2.5 w-24 rounded bg-muted" />
              </div>
            </div>
          ) : (
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
              <div
                className={cn(
                  "flex-1 min-w-0 transition-all duration-300 ease-in-out whitespace-nowrap",
                  collapsed ? "opacity-0 w-0 overflow-hidden pointer-events-none" : "opacity-100 w-auto"
                )}
              >
                <p className="truncate text-sm font-medium">{userName}</p>
                {userEmail ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </aside>

      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
          collapsed ? "md:pl-16" : "md:pl-64"
        )}
      >
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
                  <PlatformLogo href="/app/dashboard" variant="app" />
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
              <DropdownMenuItem variant="destructive" onClick={() => setShowLogoutDialog(true)}>
                <LogOut className="size-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Logout confirmation dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <LogOut className="size-5 text-muted-foreground" />
            </AlertDialogMedia>
            <AlertDialogTitle>Keluar dari akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan keluar dari sesi ini. Pastikan semua perubahan sudah tersimpan sebelum melanjutkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSigningOut}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isSigningOut}
              onClick={handleSignOut}
            >
              {isSigningOut ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Keluar…
                </>
              ) : (
                "Ya, Keluar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
