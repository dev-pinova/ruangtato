"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Paintbrush,
  BarChart3,
  CreditCard,
  Settings,
  ExternalLink,
  Menu,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
import { ScrollArea } from "@/components/ui/scroll-area"

const NAV_ITEMS = [
  { href: "/app/builder", label: "Builder", icon: Paintbrush },
  { href: "/app/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings", label: "Pengaturan", icon: Settings },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname.startsWith("/app/studio/")) {
    return <>{children}</>
  }

  function renderNavLinks(opts: {
    collapsed?: boolean
    onNavigate?: () => void
  }) {
    return (
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              title={opts.collapsed ? item.label : undefined}
              onClick={opts.onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                opts.collapsed && "justify-center px-0",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!opts.collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        <Separator className="my-2" />

        <a
          href="/app/studio/ink-and-iron"
          target="_blank"
          rel="noopener noreferrer"
          title={opts.collapsed ? "Lihat Studio" : undefined}
          onClick={opts.onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
            opts.collapsed && "justify-center px-0"
          )}
        >
          <ExternalLink className="size-4 shrink-0" />
          {!opts.collapsed && <span>Lihat Studio</span>}
        </a>
      </nav>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-white/5 bg-zinc-950 transition-all duration-300 shrink-0",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-white/5 shrink-0",
            collapsed ? "justify-center px-2" : "px-4"
          )}
        >
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <span className="text-primary font-bold text-lg">{"///"}</span>
            {!collapsed && (
              <span className="font-sans font-bold text-sm tracking-tight">
                Ruang Tato
              </span>
            )}
          </Link>
        </div>

        <ScrollArea className="flex-1 py-4">
          {renderNavLinks({ collapsed })}
        </ScrollArea>

        <div className="border-t border-white/5 p-3 shrink-0">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={cn("w-full", !collapsed && "justify-start")}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <>
                <PanelLeftClose className="size-4" data-icon="inline-start" />
                Tutup Sidebar
              </>
            )}
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-white/5 bg-zinc-950 px-4 gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" showCloseButton={false}>
                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                <div className="flex h-14 items-center border-b border-white/5 px-4 shrink-0 -mt-4 -mx-4">
                  <Link
                    href="/app/dashboard"
                    className="flex items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="text-primary font-bold text-lg">
                      {"///"}
                    </span>
                    <span className="font-sans font-bold text-sm tracking-tight">
                      Ruang Tato
                    </span>
                  </Link>
                </div>
                <div className="py-2">
                  {renderNavLinks({
                    onNavigate: () => setMobileOpen(false),
                  })}
                </div>
              </SheetContent>
            </Sheet>

            <span className="font-sans font-semibold text-sm tracking-tight">
              Ink &amp; Iron Studio
            </span>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
            >
              Published
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                />
              }
            >
              <Avatar size="sm">
                <AvatarFallback>BA</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuItem>
                <User className="size-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" />
                Pengaturan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
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
