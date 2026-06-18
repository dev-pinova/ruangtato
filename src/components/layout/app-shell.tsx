"use client"

import { useEffect, useState, useSyncExternalStore, useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-provider"
import {
  Menu,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Loader2,
} from "lucide-react"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AppShellNavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  external?: boolean
}

export type AppShellNavGroup = {
  label?: string
  items: AppShellNavItem[]
}

export type AppShellUser = {
  name: string
  email: string
  initials: string
  badgeLabel?: string
  avatarUrl?: string
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
    // ignore
  }
}

function isNavActive(pathname: string, href: string) {
  if (href === "/admin" || href === "/app/dashboard") {
    return pathname === href
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppShell({
  children,
  user,
  navGroups,
  logoHref = "/app/dashboard",
  topBarLeft,
  topBarRight,
  mobileShortcuts = [],
  signOutRedirect = "/login",
  childrenWrapperClassName,
  isLoadingUser = false,
}: {
  children: React.ReactNode
  user: AppShellUser | null
  navGroups: AppShellNavGroup[]
  logoHref?: string
  topBarLeft?: React.ReactNode
  topBarRight?: React.ReactNode
  mobileShortcuts?: AppShellNavItem[]
  signOutRedirect?: string
  childrenWrapperClassName?: string
  isLoadingUser?: boolean
}) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot
  )

  function toggleCollapsed() {
    writeCollapsed(!collapsed)
  }

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      const { error } = await authClient.signOut()
      if (error) {
        toast.error(error.message ?? "Gagal keluar. Coba lagi.")
        return
      }
      router.push(signOutRedirect)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal keluar. Coba lagi.")
    } finally {
      setSigningOut(false)
      setLogoutDialogOpen(false)
    }
  }

  function renderNavLink(
    item: AppShellNavItem,
    opts: { onNavigate?: () => void; collapsed?: boolean } = {}
  ) {
    const isCollapsed = opts.collapsed ?? false
    const isActive = isNavActive(pathname, item.href)
    const Icon = item.icon

    const linkClassName = cn(
      "group/nav-item relative flex items-center rounded-md text-sm transition-colors",
      isCollapsed
        ? "h-11 justify-center md:h-9"
        : "min-h-11 gap-2.5 pl-4 pr-2.5 py-2 md:min-h-0 md:py-1.5",
      isActive
        ? "bg-muted/30 text-foreground font-medium"
        : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
    )

    const linkContent = (
      <>
        {isActive && !isCollapsed && (
          <span className="absolute left-0.5 top-2.5 bottom-2.5 w-0.5 rounded bg-[var(--brand-scarlet)]" />
        )}
        <Icon
          className={cn(
            "size-4 shrink-0",
            isActive ? "text-foreground" : "text-muted-foreground group-hover/nav-item:text-foreground"
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

    const LinkComponent = item.external ? "a" : Link
    const linkProps = item.external
      ? { href: item.href, target: "_blank", rel: "noopener noreferrer", onClick: opts.onNavigate }
      : { href: item.href, onClick: opts.onNavigate }

    if (isCollapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger
            render={
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full"
              />
            }
          >
            <LinkComponent
              {...(linkProps as any)}
              aria-current={isActive ? "page" : undefined}
              className={linkClassName}
            >
              {linkContent}
            </LinkComponent>
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
        <LinkComponent
          {...(linkProps as any)}
          aria-current={isActive ? "page" : undefined}
          className={linkClassName}
        >
          {linkContent}
        </LinkComponent>
      </motion.div>
    )
  }

  function renderNav(
    opts: { onNavigate?: () => void; collapsed?: boolean } = {}
  ) {
    const isCollapsed = opts.collapsed ?? false

    return (
      <div className="space-y-4">
        {navGroups.map((group, i) => (
          <div key={group.label || i}>
            {group.label && (
              <p
                className={cn(
                  "px-4 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-all duration-300 ease-in-out whitespace-nowrap",
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
        href="#app-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="relative flex h-dvh bg-background">
        <aside
          data-app-sidebar
          data-collapsed={collapsed ? "true" : "false"}
          className={cn(
            "absolute left-0 inset-y-0 z-20 hidden shrink-0 flex-col border-r border-border bg-card transition-all duration-300 ease-in-out md:flex",
            collapsed ? "w-16" : "w-64"
          )}
        >
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="absolute -right-3 top-3 z-30 h-6 w-6 rounded-full border border-border bg-card p-0 text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none transition-colors"
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
              "flex h-14 shrink-0 items-center border-b border-border/60 transition-all duration-300 ease-in-out",
              collapsed ? "justify-center px-2" : "px-5"
            )}
          >
            <PlatformLogo href={logoHref} variant="app" collapsed={collapsed} />
          </div>

          <div className="flex-1 overflow-y-auto py-4">{renderNav({ collapsed })}</div>

          <div className="shrink-0 border-t border-border p-3">
            {isLoadingUser ? (
              <div
                className={cn(
                  "flex items-center rounded-md transition-all duration-300",
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
                  <div className="h-2 w-24 rounded bg-muted" />
                </div>
              </div>
            ) : user ? (
              <div
                className={cn(
                  "flex flex-col rounded-md transition-all duration-300 ease-in-out",
                  collapsed ? "items-center" : "gap-2 px-2.5 py-1.5"
                )}
              >
                <div
                  className={cn(
                    "flex items-center transition-all duration-300 ease-in-out",
                    collapsed ? "justify-center" : "gap-3"
                  )}
                >
                  <Avatar size="sm">
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "min-w-0 flex-1 transition-all duration-300 ease-in-out whitespace-nowrap",
                      collapsed ? "opacity-0 w-0 overflow-hidden pointer-events-none" : "opacity-100 w-auto"
                    )}
                  >
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                {user.badgeLabel && (
                  !collapsed ? (
                    <div className="transition-all duration-300 ease-in-out opacity-100">
                      <Badge variant="outline" className="text-[10px] uppercase font-medium bg-muted/50">
                        {user.badgeLabel}
                      </Badge>
                    </div>
                  ) : (
                    <div className="transition-all duration-300 ease-in-out opacity-100">
                      <Tooltip>
                        <TooltipTrigger
                        render={
                          <span className="mt-1 flex size-6 items-center justify-center rounded-full bg-card border border-border text-[10px] font-medium uppercase text-muted-foreground">
                            {user.badgeLabel.slice(0, 2)}
                          </span>
                        }
                      />
                        <TooltipContent side="right">
                          {user.badgeLabel}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )
                )}
              </div>
            ) : null}
          </div>
        </aside>

        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
            collapsed ? "md:pl-16" : "md:pl-64"
          )}
        >
          <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 md:px-6">
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
                  <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                  <div className="flex h-14 items-center border-b border-border px-5">
                    <PlatformLogo href={logoHref} variant="app" />
                  </div>
                  <div className="py-4">
                    {renderNav({ onNavigate: () => setMobileOpen(false) })}
                  </div>
                  {user && (
                    <div className="border-t border-border p-4">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      {user.badgeLabel && (
                        <Badge variant="outline" className="mt-2 text-[10px] uppercase font-medium bg-muted/50">
                          {user.badgeLabel}
                        </Badge>
                      )}
                    </div>
                  )}
                </SheetContent>
              </Sheet>

              {topBarLeft}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {topBarRight}

              {user && (
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
                      <Avatar size="sm">
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
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
                      <span>{t.appShell.logout}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </header>

          <main
            id="app-main-content"
            className={cn("flex-1 overflow-y-auto overscroll-contain", childrenWrapperClassName)}
          >
            {children}
          </main>

          {mobileShortcuts.length > 0 && (
            <nav
              aria-label={t.navigation.shortcuts}
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
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>
      </div>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.appShell.logoutConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.appShell.logoutConfirmDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.appShell.logoutCancel}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
            >
              {signingOut ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t.appShell.loggingOut}
                </>
              ) : (
                t.appShell.logoutConfirmBtn
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
