"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  ShieldBan,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from "lucide-react"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AdminStatusBadge } from "@/components/admin/ui/admin-status-badge"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import type { PlatformRole } from "@/lib/admin-auth"

type AdminNavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles?: PlatformRole[]
}

type AdminNavGroup = {
  label: string
  items: AdminNavItem[]
}

const NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Home",
    items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      {
        href: "/admin/tenants",
        label: "Tenants",
        icon: Building2,
        roles: ["super_admin", "admin", "support"],
      },
      {
        href: "/admin/payments",
        label: "Payments",
        icon: CreditCard,
        roles: ["super_admin", "admin", "support", "finance"],
      },
      {
        href: "/admin/suspensions",
        label: "Suspensions",
        icon: ShieldBan,
        roles: ["super_admin"],
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        href: "/admin/analytics",
        label: "Analytics",
        icon: BarChart3,
        roles: ["super_admin", "admin", "finance"],
      },
      {
        href: "/admin/audit-log",
        label: "Audit Log",
        icon: ScrollText,
        roles: ["super_admin", "admin"],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        href: "/admin/settings",
        label: "Settings",
        icon: Settings,
        roles: ["super_admin"],
      },
    ],
  },
]

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/tenants": "Tenants",
  "/admin/payments": "Payments",
  "/admin/suspensions": "Suspensions",
  "/admin/analytics": "Analytics",
  "/admin/audit-log": "Audit Log",
  "/admin/settings": "Settings",
}

const MOBILE_SHORTCUTS: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  {
    href: "/admin/tenants",
    label: "Tenants",
    icon: Building2,
    roles: ["super_admin", "admin", "support"],
  },
  {
    href: "/admin/payments",
    label: "Payments",
    icon: CreditCard,
    roles: ["super_admin", "admin", "support", "finance"],
  },
]

const SIDEBAR_STORAGE_KEY = "admin-sidebar-collapsed"
const SIDEBAR_CHANGE_EVENT = "admin-sidebar-collapsed-change"

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
    // ignore
  }
}

function getInitials(name: string) {
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

function isNavActive(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(`${href}/`)
}

type AdminUser = {
  name: string
  email: string
  platformRole: PlatformRole
}

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: AdminUser
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot,
  )

  const visibleGroups = useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter(
          (item) => !item.roles || item.roles.includes(user.platformRole),
        ),
      })).filter((group) => group.items.length > 0),
    [user.platformRole],
  )

  const mobileShortcuts = MOBILE_SHORTCUTS.filter(
    (item) => !item.roles || item.roles.includes(user.platformRole),
  )

  const pageTitle = PAGE_TITLES[pathname] ?? "Admin"
  const initials = getInitials(user.name)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  function toggleCollapsed() {
    writeCollapsed(!collapsed)
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  function renderNav(
    opts: { onNavigate?: () => void; collapsed?: boolean } = {},
  ) {
    const isCollapsed = opts.collapsed ?? false

    return (
      <div className="space-y-4">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            {!isCollapsed && group.label !== "Home" ? (
              <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
            ) : null}
            <nav className={cn("flex flex-col gap-0.5", isCollapsed ? "px-2" : "px-3")}>
              {group.items.map((item) => {
                const isActive = isNavActive(pathname, item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={opts.onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center rounded-md text-sm transition-colors motion-safe:transition-all",
                      isCollapsed
                        ? "h-11 justify-center md:h-9"
                        : "min-h-11 gap-2.5 px-2.5 py-2 md:min-h-0 md:py-1.5",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    {isActive ? (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
                    ) : null}
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {!isCollapsed ? <span>{item.label}</span> : null}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-dvh bg-background">
      <aside
        data-admin-sidebar
        data-collapsed={collapsed ? "true" : "false"}
        className={cn(
          "hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar motion-safe:transition-all motion-safe:duration-200 md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div
          className={cn(
            "flex h-14 shrink-0 items-center border-b border-sidebar-border",
            collapsed ? "justify-center px-2" : "px-5",
          )}
        >
          <PlatformLogo href="/admin" variant="app" collapsed={collapsed} />
        </div>

        <div
          className={cn(
            "flex shrink-0 border-b border-sidebar-border py-2",
            collapsed ? "justify-center px-2" : "justify-end px-3",
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

        <div className="flex-1 overflow-y-auto py-4">{renderNav({ collapsed })}</div>

        <div className="shrink-0 border-t border-sidebar-border p-3">
          <div
            className={cn(
              "flex items-center rounded-md",
              collapsed ? "justify-center" : "gap-3 px-2.5 py-1.5",
            )}
            title={collapsed ? `${user.name} — ${user.email}` : undefined}
          >
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-11 min-w-11 md:hidden"
                  />
                }
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" showCloseButton={false} className="w-72 p-0">
                <SheetTitle className="sr-only">Menu Admin</SheetTitle>
                <div className="flex h-14 items-center border-b border-border px-5">
                  <PlatformLogo href="/admin" variant="app" />
                </div>
                <div className="py-4">
                  {renderNav({ onNavigate: () => setMobileOpen(false) })}
                </div>
                <div className="border-t border-border p-4">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <AdminStatusBadge
                    status="active"
                    label={user.platformRole.replace("_", " ")}
                    className="mt-2"
                  />
                </div>
              </SheetContent>
            </Sheet>

            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
              <Link
                href="/admin"
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                Admin
              </Link>
              {pathname !== "/admin" ? (
                <>
                  <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium">{pageTitle}</span>
                </>
              ) : null}
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-11 min-w-11 rounded-full"
                />
              }
            >
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <AdminStatusBadge
                    status="active"
                    label={user.platformRole.replace("_", " ")}
                  />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                <LogOut className="size-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>

        <nav
          aria-label="Shortcut navigasi"
          className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/95 backdrop-blur md:hidden"
        >
          {mobileShortcuts.map((item) => {
            const isActive = isNavActive(pathname, item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
