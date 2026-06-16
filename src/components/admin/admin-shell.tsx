"use client"

import { useEffect, useMemo, useState } from "react"
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
  Search,
  ChevronRight,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { AppShell, type AppShellNavGroup, type AppShellNavItem } from "@/components/layout/app-shell"
import type { PlatformRole } from "@/lib/admin/admin-auth"

type AdminNavItem = AppShellNavItem & {
  roles?: PlatformRole[]
}

type AdminNavGroup = Omit<AppShellNavGroup, "items"> & {
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
  const [commandOpen, setCommandOpen] = useState(false)

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
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function navigateTo(href: string) {
    router.push(href)
    setCommandOpen(false)
  }

  const topBarLeft = (
    <>
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link href="/admin" className="shrink-0 text-muted-foreground transition-colors hover:text-foreground">
          Admin
        </Link>
        {pathname !== "/admin" ? (
          <>
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate font-medium">{pageTitle}</span>
          </>
        ) : null}
      </nav>
      <Badge variant="outline" className="hidden shrink-0 border-[var(--admin-warning)]/40 text-[var(--admin-warning)] sm:inline-flex">
        PRODUCTION
      </Badge>
    </>
  )

  const topBarRight = (
    <>
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
    </>
  )

  return (
    <>
      <AppShell
        user={{
          name: user.name,
          email: user.email,
          initials,
          badgeLabel: user.platformRole.replace("_", " "),
        }}
        navGroups={visibleGroups}
        mobileShortcuts={mobileShortcuts}
        logoHref="/admin"
        signOutRedirect="/admin/login"
        topBarLeft={topBarLeft}
        topBarRight={topBarRight}
        childrenWrapperClassName="p-4 pb-20 md:p-6 md:pb-6"
      >
        {children}
      </AppShell>

      {commandOpen && (
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
      )}
    </>
  )
}
