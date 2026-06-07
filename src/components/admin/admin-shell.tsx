"use client"

import { useEffect, useState } from "react"
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
} from "lucide-react"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import type { PlatformRole } from "@/lib/admin-auth"

type AdminNavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles?: PlatformRole[]
}

const NAV_ITEMS: AdminNavItem[] = [
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
  {
    href: "/admin/suspensions",
    label: "Suspensions",
    icon: ShieldBan,
    roles: ["super_admin"],
  },
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
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    roles: ["super_admin"],
  },
]

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

  const visibleNav = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user.platformRole),
  )

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  function renderNav(onNavigate?: () => void) {
    return (
      <nav className="flex flex-col gap-0.5 px-3">
        {visibleNav.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border md:flex">
        <div className="flex h-14 items-center border-b border-border px-5">
          <PlatformLogo href="/admin" variant="app" />
        </div>
        <div className="py-4">
          <p className="px-6 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Admin
          </p>
          {renderNav()}
        </div>
        <div className="mt-auto border-t border-border p-4">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            {user.platformRole.replace("_", " ")}
          </p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className="md:hidden" />}
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" showCloseButton={false} className="p-0">
                <SheetTitle className="sr-only">Menu Admin</SheetTitle>
                <div className="flex h-14 items-center border-b border-border px-5">
                  <PlatformLogo href="/admin" variant="app" />
                </div>
                <div className="py-4">{renderNav(() => setMobileOpen(false))}</div>
              </SheetContent>
            </Sheet>
            <span className="text-sm font-medium">Admin Panel</span>
          </div>

          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="size-4" />
            Keluar
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
