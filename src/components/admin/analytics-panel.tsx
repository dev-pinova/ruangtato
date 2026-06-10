"use client"

import { useEffect, useState } from "react"
import { Building2, CreditCard, ImageIcon, Users } from "lucide-react"

import {
  AdminKpiSkeletonGrid,
  AdminLineChart,
  AdminMetricStrip,
  AdminPageHeaderV2,
  AdminPanel,
} from "@/components/admin/ui"

type AnalyticsData = {
  kpis: {
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
    activeSubscribers: number
    totalTransactions: number
    totalRevenue: number
    revenueThisMonth: number
    activeWebsites: number
    inactiveWebsites: number
    portfolioAssets: number
  }
  charts: {
    userGrowth: { month: string; value: number }[]
    transactionGrowth: { month: string; value: number }[]
    subscriberGrowth: { month: string; value: number }[]
  }
}

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

export function AnalyticsPanel({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setData(json?.data ?? null))
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return compact ? (
      <AdminKpiSkeletonGrid count={4} />
    ) : (
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeaderV2
          title="Analytics"
          description="Ringkasan kesehatan platform Ruang Tato."
        />
        <AdminKpiSkeletonGrid count={4} />
      </div>
    )
  }

  const { kpis, charts } = data

  return (
    <div className={compact ? "space-y-8" : "mx-auto max-w-7xl space-y-6"}>
      {!compact ? (
        <AdminPageHeaderV2
          title="Analytics"
          description="Ringkasan kesehatan platform Ruang Tato."
        />
      ) : null}

      <AdminMetricStrip
        items={[
          {
            id: "users",
            label: "Total user",
            count: kpis.totalUsers,
            icon: Users,
            tone: "info",
          },
          {
            id: "subscribers",
            label: "Subscriber aktif",
            count: kpis.activeSubscribers,
            icon: Users,
            tone: "success",
          },
          {
            id: "revenue",
            label: "Revenue bulan ini",
            count: formatIDR(kpis.revenueThisMonth),
            icon: CreditCard,
            tone: "neutral",
          },
          {
            id: "websites",
            label: "Website aktif",
            count: kpis.activeWebsites,
            icon: Building2,
            tone: "neutral",
          },
        ]}
      />

      {!compact ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <AdminLineChart title="Pertumbuhan user" data={charts.userGrowth} />
          <AdminLineChart
            title="Pertumbuhan transaksi"
            data={charts.transactionGrowth}
            valueFormatter={(v) => formatIDR(v)}
          />
          <AdminLineChart
            title="Pertumbuhan subscriber"
            data={charts.subscriberGrowth}
          />
        </div>
      ) : null}

      {!compact ? (
        <AdminPanel>
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCell label="User aktif" value={kpis.activeUsers} />
            <MetricCell label="User baru bulan ini" value={kpis.newUsersThisMonth} />
            <MetricCell label="Total transaksi" value={kpis.totalTransactions} />
            <MetricCell
              label="Total revenue"
              value={formatIDR(kpis.totalRevenue)}
            />
            <MetricCell label="Website nonaktif" value={kpis.inactiveWebsites} />
            <MetricCell
              label="Aset portfolio"
              value={kpis.portfolioAssets}
              icon={ImageIcon}
            />
          </div>
        </AdminPanel>
      ) : null}
    </div>
  )
}

function MetricCell({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number | string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="size-4 text-muted-foreground" aria-hidden /> : null}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  )
}
