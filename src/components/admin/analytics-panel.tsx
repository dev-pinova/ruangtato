"use client"

import { useEffect, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Building2, CreditCard, ImageIcon, Users } from "lucide-react"

import {
  AdminKpiCard,
  AdminKpiSkeletonGrid,
  AdminPageHeader,
  AdminSectionCard,
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

function ChartCard({
  title,
  data,
}: {
  title: string
  data: { month: string; value: number }[]
}) {
  return (
    <AdminSectionCard>
      <h3 className="mb-4 text-sm font-medium">{title}</h3>
      <div className="min-h-48 w-full md:min-h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
      </div>
    </AdminSectionCard>
  )
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
        <AdminPageHeader
          title="Analytics"
          description="Ringkasan kesehatan platform Ruang Tato."
        />
        <AdminKpiSkeletonGrid count={8} />
      </div>
    )
  }

  const { kpis, charts } = data

  return (
    <div className={compact ? "space-y-8" : "mx-auto max-w-7xl space-y-6"}>
      {!compact ? (
        <AdminPageHeader
          title="Analytics"
          description="Ringkasan kesehatan platform Ruang Tato."
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminKpiCard label="Total user" value={String(kpis.totalUsers)} icon={Users} />
        <AdminKpiCard label="User aktif" value={String(kpis.activeUsers)} icon={Users} />
        <AdminKpiCard
          label="User baru bulan ini"
          value={String(kpis.newUsersThisMonth)}
          icon={Users}
        />
        <AdminKpiCard
          label="Subscriber aktif"
          value={String(kpis.activeSubscribers)}
          icon={Users}
        />
        <AdminKpiCard
          label="Total transaksi"
          value={String(kpis.totalTransactions)}
          icon={CreditCard}
        />
        <AdminKpiCard
          label="Total revenue"
          value={formatIDR(kpis.totalRevenue)}
          icon={CreditCard}
        />
        <AdminKpiCard
          label="Revenue bulan ini"
          value={formatIDR(kpis.revenueThisMonth)}
          icon={CreditCard}
        />
        <AdminKpiCard
          label="Website aktif"
          value={String(kpis.activeWebsites)}
          icon={Building2}
        />
        <AdminKpiCard
          label="Website nonaktif"
          value={String(kpis.inactiveWebsites)}
          icon={Building2}
        />
        <AdminKpiCard
          label="Aset portfolio"
          value={String(kpis.portfolioAssets)}
          icon={ImageIcon}
        />
      </div>

      {!compact ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <ChartCard title="Pertumbuhan user" data={charts.userGrowth} />
          <ChartCard title="Pertumbuhan transaksi" data={charts.transactionGrowth} />
          <ChartCard title="Pertumbuhan subscriber" data={charts.subscriberGrowth} />
        </div>
      ) : null}
    </div>
  )
}
