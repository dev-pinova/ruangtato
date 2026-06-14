"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  ShieldBan,
  BarChart3,
  ScrollText,
  Settings,
  Menu,
  ChevronRight,
  ChevronLeft,
  Search,
  LogOut,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { AdminStatusBadge } from "@/components/admin/ui/admin-status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth/auth-client"
import type { PlatformRole } from "@/lib/admin/admin-auth"

type AdminNavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles?: PlatformRole[]
  group?: string
}

type AdminNavGroup = {
  label: string
  items: AdminNavItem[]
}

const NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Beranda",
    items: [{ href: "/admin", label: "Ringkasan", icon: LayoutDashboard }],
  },
  {
    label: "Operasional",
    items: [
      {
        href: "/admin/tenants",
        label: "Studio",
        icon: Building2,
        roles: ["super_admin", "admin", "support"],
      },
      {
        href: "/admin/payments",
        label: "Pembayaran",
        icon: CreditCard,
        roles: ["super_admin", "admin", "support", "finance"],
      },
      {
        href: "/admin/suspensions",
        label: "Suspensi",
        icon: ShieldBan,
        roles: ["super_admin"],
      },
    ],
  },
  {
    label: "Wawasan",
    items: [
      {
        href: "/admin/analytics",
        label: "Analitik",
        icon: BarChart3,
        roles: ["super_admin", "admin", "finance"],
      },
      {
        href: "/admin/audit-log",
        label: "Log Audit",
        icon: ScrollText,
        roles: ["super_admin", "admin"],
      },
    ],
  },
  {
    label: "Sistem",
    items: [
      {
        href: "/admin/settings",
        label: "Pengaturan",
        icon: Settings,
        roles: ["super_admin"],
      },
    ],
  },
]

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Ringkasan",
  "/admin/tenants": "Studio",
  "/admin/payments": "Pembayaran",
  "/admin/suspensions": "Suspensi",
  "/admin/analytics": "Analitik",
  "/admin/audit-log": "Log Audit",
  "/admin/settings": "Pengaturan",
}

const MOBILE_SHORTCUTS: AdminNavItem[] = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  {
    href: "/admin/tenants",
    label: "Studio",
    icon: Building2,
    roles: ["super_admin", "admin", "support"],
  },
  {
    href: "/admin/payments",
    label: "Pembayaran",
    icon: CreditCard,
    roles: ["super_admin", "admin", "support", "finance"],
  },
]

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
  const [commandOpen, setCommandOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const collapsed = isCollapsed

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile nav on route change; pathname is an external (router) signal
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  async function handleSignOut() {
    if (signingOut) return

    setSigningOut(true)
    try {
      const { error } = await authClient.signOut()
      if (error) {
        toast.error(error.message ?? "Gagal keluar. Coba lagi.")
        return
      }
      router.push("/admin/login")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal keluar. Coba lagi.")
    } finally {
      setSigningOut(false)
    }
  }

  function navigateTo(href: string) {
    router.push(href)
    setCommandOpen(false)
    setMobileOpen(false)
  }

  function renderNavLink(
    item: AdminNavItem,
    opts: { onNavigate?: () => void; collapsed?: boolean } = {},
  ) {
    const isCollapsed = opts.collapsed ?? false
    const isActive = isNavActive(pathname, item.href)
    const Icon = item.icon

    const linkClassName = cn(
      "group relative flex items-center rounded-md text-sm transition-colors",
      isCollapsed
        ? "h-11 justify-center md:h-9"
        : "min-h-11 gap-2.5 pl-4 pr-2.5 py-2 md:min-h-0 md:py-1.5",
      isActive
        ? "bg-sidebar-accent/50 text-foreground font-medium"
        : "text-muted-foreground hover:bg-sidebar-accent/30 hover:text-foreground",
    )

    const linkContent = (
      <>
        {isActive && !isCollapsed ? (
          <span className="absolute left-0.5 top-2.5 bottom-2.5 w-0.5 rounded bg-[var(--brand-scarlet)]" />
        ) : null}
        <Icon
          className={cn(
            "size-4 shrink-0",
            isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
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
      </>
    )

    if (isCollapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger
            render={
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full"
              >
                <Link
                  href={item.href}
                  onClick={opts.onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={linkClassName}
                />
              </motion.div>
            }
          >
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      )
    }

    return (
      <motion.div
        key={item.href}
        whileHover={{ x: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Link
          href={item.href}
          onClick={opts.onNavigate}
          aria-current={isActive ? "page" : undefined}
          className={linkClassName}
        >
          {linkContent}
        </Link>
      </motion.div>
    )
  }

  function renderNav(
    opts: { onNavigate?: () => void; collapsed?: boolean } = {},
  ) {
    const isCollapsed = opts.collapsed ?? false

    return (
      <div className="space-y-4">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            {group.label !== "Home" && (
              <p
                className={cn(
                  "px-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-all duration-300 ease-in-out whitespace-nowrap",
                  isCollapsed ? "opacity-0 w-0 h-0 overflow-hidden pb-0 pointer-events-none" : "opacity-100"
                )}
              >
                {group.label}
              </p>
            )}
            <nav className={cn("flex flex-col gap-0.5", isCollapsed ? "px-2" : "px-3")}>
              {group.items.map((item) => renderNavLink(item, opts))}
            </nav>
          </div>
        ))}
      </div>
    )
  }

  return (
    <TooltipProvider delay={0}>
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="relative flex h-dvh bg-background">
        <aside
          data-admin-sidebar
          data-collapsed={collapsed ? "true" : "false"}
          className={cn(
            "absolute left-0 inset-y-0 z-20 hidden shrink-0 flex-col border-r border-border bg-card transition-all duration-300 ease-in-out md:flex",
            collapsed ? "w-16" : "w-64",
          )}
        >
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-3 z-30 h-6 w-6 rounded-full border border-border bg-card p-0 text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>

          <div
            className={cn(
              "flex h-12 shrink-0 items-center border-b border-border/60 transition-all duration-300 ease-in-out",
              collapsed ? "justify-center px-2" : "px-5",
            )}
          >
            <PlatformLogo href="/admin" variant="app" collapsed={collapsed} />
          </div>

          <div className="flex-1 overflow-y-auto py-4">{renderNav({ collapsed })}</div>

          <div className="shrink-0 border-t border-border p-3">
            <div
              className={cn(
                "flex flex-col rounded-md transition-all duration-300 ease-in-out",
                collapsed ? "items-center" : "gap-2 px-2.5 py-1.5",
              )}
            >
              <div
                className={cn(
                  "flex items-center transition-all duration-300 ease-in-out",
                  collapsed ? "justify-center" : "gap-3",
                )}
              >
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "min-w-0 flex-1 transition-all duration-300 ease-in-out whitespace-nowrap",
                    collapsed ? "opacity-0 w-0 overflow-hidden pointer-events-none" : "opacity-100 w-auto"
                  )}
                >
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              {!collapsed ? (
                <div className="transition-all duration-300 ease-in-out opacity-100">
                  <AdminStatusBadge
                    status="active"
                    label={user.platformRole.replace("_", " ")}
                  />
                </div>
              ) : (
                <div className="transition-all duration-300 ease-in-out opacity-100">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <span className="mt-1 flex size-6 items-center justify-center rounded-full bg-card border border-border text-[10px] font-medium uppercase text-muted-foreground">
                          {user.platformRole.slice(0, 2)}
                        </span>
                      }
                    />
                    <TooltipContent side="right">
                      {user.platformRole.replace("_", " ")}
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
              {!collapsed ? (
                <p className="text-[10px] text-muted-foreground transition-all duration-300 ease-in-out whitespace-nowrap opacity-100">
                  Tekan <kbd className="rounded border border-border px-1">Ctrl+K</kbd> untuk
                  cari
                </p>
              ) : null}
            </div>
          </div>
        </aside>

        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
            collapsed ? "md:pl-16" : "md:pl-64",
          )}
        >
          <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="min-h-11 min-w-11 md:hidden"
                      aria-label="Buka menu navigasi"
                    />
                  }
                >
                  <Menu className="size-4" />
                </SheetTrigger>
                <SheetContent
                  side="left"
                  showCloseButton={false}
                  className="w-72 overscroll-contain p-0"
                >
                  <SheetTitle className="sr-only">Menu Admin</SheetTitle>
                  <div className="flex h-12 items-center border-b border-border px-5">
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

              <nav
                aria-label="Breadcrumb"
                className="flex min-w-0 items-center gap-1.5 text-sm"
              >
                <Link
                  href="/admin"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                >
                  Admin
                </Link>
                {pathname !== "/admin" ? (
                  <>
                    <ChevronRight
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="truncate font-medium">{pageTitle}</span>
                  </>
                ) : null}
              </nav>

              <Badge
                variant="outline"
                className="hidden shrink-0 border-[var(--admin-warning)]/40 text-[var(--admin-warning)] sm:inline-flex"
              >
                PRODUCTION
              </Badge>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden h-8 gap-2 text-muted-foreground sm:flex"
                onClick={() => setCommandOpen(true)}
                aria-label="Buka pencarian"
              >
                <Search className="size-3.5" />
                <span className="text-xs">Search</span>
                <kbd className="pointer-events-none hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium lg:inline">
                  Ctrl+K
                </kbd>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11 sm:hidden"
                onClick={() => setCommandOpen(true)}
                aria-label="Buka pencarian"
              >
                <Search className="size-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="group/signout relative min-h-11 min-w-11 rounded-full"
                      aria-label="Menu profil"
                    />
                  }
                >
                  {signingOut ? (
                    <Loader2 className="size-4 motion-safe:animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground motion-safe:transition-opacity group-hover/signout:opacity-0">
                        {initials}
                      </span>
                      <LogOut
                        className="pointer-events-none absolute size-4 text-muted-foreground opacity-0 motion-safe:transition-opacity group-hover/signout:opacity-100"
                        aria-hidden
                      />
                    </>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setLogoutDialogOpen(true)}
                  >
                    <LogOut className="mr-2 size-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main
            id="admin-main"
            className="flex-1 overflow-y-auto overscroll-contain p-4 pb-20 md:p-6 md:pb-6"
          >
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

      {commandOpen ? (
        <CommandDialog
          open={commandOpen}
          onOpenChange={setCommandOpen}
          title="Navigasi Admin"
          description="Cari halaman admin"
        >
          <CommandInput placeholder="Cari halaman..." />
          <CommandList>
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            {visibleGroups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <CommandItem
                      key={item.href}
                      value={`${group.label} ${item.label}`}
                      onSelect={() => navigateTo(item.href)}
                    >
                      <Icon className="size-4" />
                      {item.label}
                      <CommandShortcut className="hidden sm:inline">
                        {item.href.replace("/admin", "") || "/"}
                      </CommandShortcut>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </CommandDialog>
      ) : null}

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari Dashboard Super Admin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
            >
              {signingOut ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Mengeluarkan...
                </>
              ) : (
                "Ya, Keluar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
