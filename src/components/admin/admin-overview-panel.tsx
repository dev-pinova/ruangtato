"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Building2,
  CreditCard,
  ShieldBan,
  Users,
  ArrowRight,
  Activity,
} from "lucide-react"

import {
  AdminLineChart,
  AdminPageHeaderV2,
  AdminPanel,
} from "@/components/admin/ui"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { BorderBeam } from "@/components/ui/border-beam"
import { cn } from "@/lib/utils"
import type { PlatformRole } from "@/lib/admin/admin-auth"

type AnalyticsKpis = {
  totalUsers: number
  activeSubscribers: number
  totalRevenue: number
  revenueThisMonth: number
}

type AnalyticsPayload = {
  kpis: AnalyticsKpis
  charts: {
    transactionGrowth: { month: string; value: number }[]
  }
}

type SuspensionLog = {
  id: string
  studioName: string
  statusAfter: string
  reason: string
  createdAt: string
}

type AuditRow = {
  id: string
  action: string
  targetType: string
  targetId: string
  createdAt: string
}

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const QUICK_ACTIONS = [
  {
    href: "/admin/tenants",
    label: "Review tenants",
    description: "Cari studio & suspend",
    icon: Building2,
  },
  {
    href: "/admin/payments",
    label: "Review payments",
    description: "Transaksi pending/failed",
    icon: CreditCard,
  },
  {
    href: "/admin/suspensions",
    label: "Suspensions",
    description: "Log & reactivate",
    icon: ShieldBan,
    roles: ["super_admin"],
  },
]

export function AdminOverviewPanel({
  userName,
  platformRole,
}: {
  userName: string
  platformRole: PlatformRole
}) {
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null)
  const [suspendedCount, setSuspendedCount] = useState(0)
  const [recentSuspensions, setRecentSuspensions] = useState<SuspensionLog[]>([])
  const [recentAudit, setRecentAudit] = useState<AuditRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [analyticsRes, suspensionsRes, auditRes] = await Promise.all([
          fetch("/api/admin/analytics"),
          fetch("/api/admin/suspensions"),
          fetch("/api/admin/audit-logs?limit=5"),
        ])

        if (analyticsRes.ok) {
          const json = await analyticsRes.json()
          if (json?.data) setAnalytics(json.data as AnalyticsPayload)
        }

        if (suspensionsRes.ok) {
          const json = await suspensionsRes.json()
          const suspended = json?.data?.suspended ?? []
          const logs = json?.data?.logs ?? []
          setSuspendedCount(suspended.length)
          setRecentSuspensions(logs.slice(0, 3))
        }

        if (auditRes.ok) {
          const json = await auditRes.json()
          setRecentAudit((json?.data ?? []).slice(0, 5))
        }
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const kpis = analytics?.kpis
  const chartData = analytics?.charts?.transactionGrowth ?? []

  const visibleActions = QUICK_ACTIONS.filter(
    (action) => !action.roles || action.roles.includes(platformRole),
  )

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeaderV2
        title="Overview"
        description={`Selamat datang, ${userName} (${platformRole.replace("_", " ")}).`}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[180px] lg:col-span-2 lg:row-span-2 rounded-xl bg-zinc-950/20" />
          <Skeleton className="h-[180px] lg:col-span-1 lg:row-span-2 rounded-xl bg-zinc-950/20" />
          <Skeleton className="h-[82px] lg:col-span-1 lg:row-span-1 rounded-xl bg-zinc-950/20" />
          <Skeleton className="h-[82px] lg:col-span-1 lg:row-span-1 rounded-xl bg-zinc-950/20" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Revenue (Bento Hero - spans 2 cols, 2 rows on lg) */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 backdrop-blur-md p-6 flex flex-col justify-between min-h-[180px] lg:col-span-2 lg:row-span-2 group hover:border-zinc-700/85 transition-all shadow-lg shadow-black/25">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue Bulan Ini</span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--brand-scarlet)]/10 text-[var(--brand-scarlet)]">
                  <CreditCard className="size-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
                  {formatIDR(kpis?.revenueThisMonth ?? 0)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5">Pendapatan kotor yang diterima dari langganan aktif bulan berjalan.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-900/60 pt-4 text-[10px] text-muted-foreground">
              <span>GERBANG PEMBAYARAN</span>
              <span className="text-[var(--admin-success)] flex items-center gap-1.5 font-medium">
                <span className="size-1.5 rounded-full bg-[var(--admin-success)] animate-pulse" />
                Midtrans Terkoneksi
              </span>
            </div>
            {/* Premium neon glow BorderBeam */}
            <BorderBeam size={250} duration={8} borderWidth={1.5} colorFrom="var(--brand-scarlet)" colorTo="transparent" />
          </div>

          {/* Card 2: Active Subscribers (Tall card - spans 1 col, 2 rows on lg) */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/30 backdrop-blur-xs p-6 flex flex-col justify-between min-h-[180px] lg:col-span-1 lg:row-span-2 group hover:border-zinc-700/85 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Subscribers</span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--admin-info)]/10 text-[var(--admin-info)]">
                  <Users className="size-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-4xl font-extrabold tracking-tight text-white tabular-nums">
                  {kpis?.activeSubscribers ?? 0}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5">Studio tato yang terdaftar dan memiliki paket langganan aktif.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-900/60 pt-4 text-[10px] text-muted-foreground">
              <span>TREN PLATFORM</span>
              <span className="text-[var(--admin-info)] font-medium">Pertumbuhan Stabil</span>
            </div>
          </div>

          {/* Card 3: Total Users (Small card - spans 1 col, 1 row on lg) */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/20 p-5 flex flex-col justify-between min-h-[82px] lg:col-span-1 lg:row-span-1 group hover:border-zinc-700/85 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Users</span>
              <Users className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-white tabular-nums">
                {kpis?.totalUsers ?? 0}
              </h3>
              <span className="text-[10px] text-muted-foreground font-mono">Terdaftar</span>
            </div>
          </div>

          {/* Card 4: Suspended Tenants (Small card - spans 1 col, 1 row on lg) */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/20 p-5 flex flex-col justify-between min-h-[82px] lg:col-span-1 lg:row-span-1 group hover:border-zinc-700/85 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suspended</span>
              <ShieldBan className={cn("size-4", suspendedCount > 0 ? "text-[var(--admin-error)] animate-pulse" : "text-muted-foreground")} />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-white tabular-nums">
                {suspendedCount}
              </h3>
              <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded", suspendedCount > 0 ? "bg-[var(--admin-error)]/10 text-[var(--admin-error)]" : "bg-[var(--admin-success)]/10 text-[var(--admin-success)]")}>
                {suspendedCount > 0 ? "Perlu Tinjauan" : "Sistem Aman"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleActions.map((action) => {
          const Icon = action.icon
          return (
            <div
              key={action.href}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/20"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                  <Icon className="size-4 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{action.label}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
              <Button
                nativeButton={false}
                variant="outline"
                size="sm"
                className="w-full"
                render={<Link href={action.href} />}
              >
                Buka
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminLineChart
          title="Revenue trend"
          data={chartData}
          valueFormatter={(v) => formatIDR(v)}
          loading={loading}
        />

        <AdminPanel>
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" aria-hidden />
              <h2 className="text-sm font-medium">Recent activity</h2>
            </div>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {recentAudit.length > 0
                  ? recentAudit.map((row) => (
                      <li
                        key={row.id}
                        className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 text-sm last:border-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-xs">{row.action}</p>
                          <p className="truncate text-muted-foreground">
                            {row.targetType}:{row.targetId.slice(0, 8)}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {formatDate(row.createdAt)}
                        </span>
                      </li>
                    ))
                  : recentSuspensions.map((log) => (
                      <li
                        key={log.id}
                        className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 text-sm last:border-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="font-medium">{log.studioName}</p>
                          <p className="truncate text-muted-foreground">{log.reason}</p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 text-xs",
                            log.statusAfter === "suspended"
                              ? "text-[var(--admin-error)]"
                              : "text-[var(--admin-success)]",
                          )}
                        >
                          {log.statusAfter}
                        </span>
                      </li>
                    ))}
                {recentAudit.length === 0 && recentSuspensions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Belum ada aktivitas terbaru.
                  </p>
                ) : null}
              </ul>
            )}
          </div>
        </AdminPanel>
      </div>
    </div>
  )
}
