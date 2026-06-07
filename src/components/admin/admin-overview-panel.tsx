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
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  AdminKpiCard,
  AdminKpiSkeletonGrid,
  AdminPageHeader,
  AdminSectionCard,
} from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PlatformRole } from "@/lib/admin-auth"

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
      <AdminPageHeader
        title="Overview"
        description={`Selamat datang, ${userName} (${platformRole.replace("_", " ")}).`}
      />

      {loading ? (
        <AdminKpiSkeletonGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminKpiCard
            label="Total users"
            value={String(kpis?.totalUsers ?? 0)}
            icon={Users}
          />
          <AdminKpiCard
            label="Active subscribers"
            value={String(kpis?.activeSubscribers ?? 0)}
            icon={Users}
          />
          <AdminKpiCard
            label="Revenue bulan ini"
            value={formatIDR(kpis?.revenueThisMonth ?? 0)}
            icon={CreditCard}
          />
          <AdminKpiCard
            label="Suspended tenants"
            value={String(suspendedCount)}
            icon={ShieldBan}
            delta={suspendedCount > 0 ? "Perlu review" : "Semua aktif"}
            deltaPositive={suspendedCount === 0}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleActions.map((action) => {
          const Icon = action.icon
          return (
            <AdminSectionCard
              key={action.href}
              className="flex flex-col gap-3 transition-colors hover:bg-muted/20"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30">
                  <Icon className="size-4 text-primary" />
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
            </AdminSectionCard>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminSectionCard>
          <h2 className="mb-4 text-sm font-medium">Revenue trend</h2>
          <div className="min-h-48 md:min-h-56">
            {loading ? (
              <div className="h-full animate-pulse rounded-lg bg-muted" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="oklch(0.72 0.17 145)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada data chart.</p>
            )}
          </div>
        </AdminSectionCard>

        <AdminSectionCard>
          <div className="mb-4 flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <h2 className="text-sm font-medium">Recent activity</h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted" />
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
                      <span className="shrink-0 text-xs text-muted-foreground">
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
                            ? "text-red-400"
                            : "text-emerald-400",
                        )}
                      >
                        {log.statusAfter}
                      </span>
                    </li>
                  ))}
              {recentAudit.length === 0 && recentSuspensions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada aktivitas terbaru.</p>
              ) : null}
            </ul>
          )}
        </AdminSectionCard>
      </div>
    </div>
  )
}
