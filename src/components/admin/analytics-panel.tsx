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

import { MetricCard, PageHeading } from "@/components/design"
import { Users, CreditCard, Building2, ImageIcon } from "lucide-react"

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
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-medium">{title}</h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="currentColor" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
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
    return <p className="text-sm text-muted-foreground">Memuat analytics...</p>
  }

  const { kpis, charts } = data

  return (
    <div className="space-y-8">
      {!compact ? (
        <PageHeading
          title="Analytics"
          description="Ringkasan kesehatan platform Ruang Tato."
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total user" value={String(kpis.totalUsers)} icon={Users} />
        <MetricCard label="User aktif" value={String(kpis.activeUsers)} icon={Users} />
        <MetricCard
          label="User baru bulan ini"
          value={String(kpis.newUsersThisMonth)}
          icon={Users}
        />
        <MetricCard
          label="Subscriber aktif"
          value={String(kpis.activeSubscribers)}
          icon={Users}
        />
        <MetricCard
          label="Total transaksi"
          value={String(kpis.totalTransactions)}
          icon={CreditCard}
        />
        <MetricCard
          label="Total revenue"
          value={formatIDR(kpis.totalRevenue)}
          icon={CreditCard}
        />
        <MetricCard
          label="Revenue bulan ini"
          value={formatIDR(kpis.revenueThisMonth)}
          icon={CreditCard}
        />
        <MetricCard
          label="Website aktif"
          value={String(kpis.activeWebsites)}
          icon={Building2}
        />
        <MetricCard
          label="Website nonaktif"
          value={String(kpis.inactiveWebsites)}
          icon={Building2}
        />
        <MetricCard
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
