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
  AdminDataTable,
  AdminKpiCard,
  AdminLineChart,
  AdminPageHeaderV2,
  AdminPanel,
  AdminStatusBadge,
  type AdminTableColumn,
} from "@/components/admin/ui"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { PlatformRole } from "@/lib/admin/admin-auth"

type AnalyticsKpis = {
  totalUsers: number
  activeSubscribers: number
  totalRevenue: number
  revenueThisMonth: number
}

type AnalyticsPayload = {
  kpis: AnalyticsKpis
  breakdowns: {
    planTypes: { planType: string; count: number }[]
    paymentMethods: { method: string; count: number }[]
  }
  latestSubscriptions: {
    id: string
    studioName: string
    planType: string
    status: string
    createdAt: string | null
    expiresAt: string | null
  }[]
  charts: {
    userGrowth: { month: string; value: number }[]
    transactionGrowth: { month: string; value: number }[]
    subscriberGrowth: { month: string; value: number }[]
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

type LatestSubscription = AnalyticsPayload["latestSubscriptions"][number]

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
  const transactionChartData = analytics?.charts?.transactionGrowth ?? []
  const userChartData = analytics?.charts?.userGrowth ?? []
  const subscriberChartData = analytics?.charts?.subscriberGrowth ?? []
  const planTypes = analytics?.breakdowns?.planTypes ?? []
  const paymentMethods = analytics?.breakdowns?.paymentMethods ?? []
  const latestSubs = analytics?.latestSubscriptions ?? []

  const visibleActions = QUICK_ACTIONS.filter(
    (action) => !action.roles || action.roles.includes(platformRole),
  )

  const subscriberColumns: AdminTableColumn<LatestSubscription>[] = [
    {
      key: "studioName",
      header: "Studio",
      cell: (row) => <span className="font-medium text-foreground">{row.studioName}</span>,
    },
    {
      key: "planType",
      header: "Paket",
      cell: (row) => <span className="capitalize text-muted-foreground">{row.planType}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <AdminStatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      header: "Tanggal Daftar",
      numeric: true,
      hideOnMobile: true,
      cell: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.createdAt ? formatDate(row.createdAt) : "—"}
        </span>
      ),
    },
    {
      key: "expiresAt",
      header: "Masa Berlaku",
      numeric: true,
      hideOnMobile: true,
      cell: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.expiresAt ? formatDate(row.expiresAt) : "—"}
        </span>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeaderV2
        title="Overview"
        description={`Selamat datang, ${userName} (${platformRole.replace("_", " ")}).`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminKpiCard
          label="Total Revenue"
          value={formatIDR(kpis?.totalRevenue ?? 0)}
          icon={CreditCard}
          delta={`Bulan ini: ${formatIDR(kpis?.revenueThisMonth ?? 0)}`}
          loading={loading}
        />
        <AdminKpiCard
          label="Active Subscribers"
          value={(kpis?.activeSubscribers ?? 0).toLocaleString("id-ID")}
          icon={Users}
          loading={loading}
        />
        <AdminKpiCard
          label="Total Users"
          value={(kpis?.totalUsers ?? 0).toLocaleString("id-ID")}
          icon={Users}
          loading={loading}
        />
        <AdminKpiCard
          label="Suspended"
          value={suspendedCount.toLocaleString("id-ID")}
          icon={ShieldBan}
          delta={suspendedCount > 0 ? "Perlu tinjauan" : "Sistem aman"}
          deltaPositive={suspendedCount === 0}
          loading={loading}
        />
      </div>

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

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminLineChart
          title="Revenue trend"
          data={transactionChartData}
          valueFormatter={(v) => formatIDR(v)}
          loading={loading}
        />
        <AdminLineChart
          title="User growth"
          data={userChartData}
          valueFormatter={(v) => v.toString()}
          loading={loading}
        />
        <AdminLineChart
          title="Subscriber growth"
          data={subscriberChartData}
          valueFormatter={(v) => v.toString()}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminPanel className="lg:col-span-1 flex flex-col gap-0">
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" aria-hidden />
              <h2 className="text-sm font-medium">Distribusi & Aktivitas</h2>
            </div>
          </div>
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Jenis Paket</h3>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : planTypes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada data</p>
              ) : (
                <div className="space-y-2">
                  {planTypes.map(p => (
                    <div key={p.planType} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{p.planType}</span>
                      <span className="font-medium tabular-nums">{p.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Metode Pembayaran</h3>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : paymentMethods.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada data</p>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map(p => (
                    <div key={p.method} className="flex items-center justify-between text-sm">
                      <span className="uppercase">{p.method.replace(/_/g, " ")}</span>
                      <span className="font-medium tabular-nums">{p.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h3>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
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
                            <p className="truncate text-muted-foreground text-[10px]">
                              {row.targetType}:{row.targetId.slice(0, 8)}
                            </p>
                          </div>
                          <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
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
                            <p className="truncate text-muted-foreground text-[10px]">{log.reason}</p>
                          </div>
                          <AdminStatusBadge status={log.statusAfter} className="shrink-0" />
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
          </div>
        </AdminPanel>

        <AdminPanel className="lg:col-span-2">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-medium">Pendaftar Langganan Terbaru</h2>
          </div>
          <div className="p-4">
            <AdminDataTable
              columns={subscriberColumns}
              rows={latestSubs}
              rowKey={(row) => row.id}
              loading={loading}
              emptyIcon={CreditCard}
              emptyTitle="Belum ada pendaftar langganan"
              emptyDescription="Pendaftar langganan terbaru akan muncul di sini."
            />
          </div>
        </AdminPanel>
      </div>
    </div>
  )
}
