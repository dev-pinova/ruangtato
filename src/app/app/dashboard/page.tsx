"use client"

import { useState } from "react"
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Users,
  Percent,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { H2 } from "@/components/ui/typography"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  MOCK_ANALYTICS_SUMMARY,
  MOCK_DAILY_ANALYTICS,
  MOCK_LEADS,
} from "@/lib/mock-data"
import type { DailyAnalytics } from "@/lib/types"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const STATUS_CONFIG = {
  new: { label: "Baru", variant: "default" as const },
  read: { label: "Dibaca", variant: "secondary" as const },
  replied: { label: "Dibalas", variant: "outline" as const },
}

const SUMMARY_CARDS = [
  {
    label: "Total Views",
    value: MOCK_ANALYTICS_SUMMARY.totalViews.toLocaleString("id-ID"),
    trend: MOCK_ANALYTICS_SUMMARY.viewsTrend,
    icon: Eye,
  },
  {
    label: "Total Clicks",
    value: MOCK_ANALYTICS_SUMMARY.totalClicks.toLocaleString("id-ID"),
    trend: MOCK_ANALYTICS_SUMMARY.clicksTrend,
    icon: MousePointerClick,
  },
  {
    label: "Conversion Rate",
    value: `${MOCK_ANALYTICS_SUMMARY.conversionRate}%`,
    icon: Percent,
  },
  {
    label: "Total Leads",
    value: MOCK_ANALYTICS_SUMMARY.totalLeads.toLocaleString("id-ID"),
    icon: Users,
  },
]

function BarChart({ data }: { data: DailyAnalytics[] }) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.views, d.clicks)))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-sm bg-primary" />
          <span className="text-muted-foreground">Views</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-sm bg-primary/30" />
          <span className="text-muted-foreground">Clicks</span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-48">
        {data.map((d) => (
          <div
            key={d.date}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div className="w-full flex items-end gap-0.5 h-40">
              <div
                className="flex-1 rounded-t-md bg-primary transition-all duration-500"
                style={{
                  height: `${maxValue > 0 ? (d.views / maxValue) * 100 : 0}%`,
                }}
              />
              <div
                className="flex-1 rounded-t-md bg-primary/30 transition-all duration-500"
                style={{
                  height: `${maxValue > 0 ? (d.clicks / maxValue) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {d.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d")
  const chartData = MOCK_DAILY_ANALYTICS[period]

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl">
      <H2>Dashboard</H2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map((card) => {
          const Icon = card.icon
          const isPositive = card.trend !== undefined && card.trend >= 0
          return (
            <Card key={card.label}>
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Icon className="size-3.5" />
                  {card.label}
                </CardDescription>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {card.value}
                </CardTitle>
              </CardHeader>
              {card.trend !== undefined && (
                <CardContent>
                  <div className="flex items-center gap-1 text-xs">
                    {isPositive ? (
                      <TrendingUp className="size-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="size-3 text-red-400" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        isPositive ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {card.trend}%
                    </span>
                    <span className="text-muted-foreground">
                      vs bulan lalu
                    </span>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Harian</CardTitle>
          <CardAction>
            <div className="flex gap-1">
              {(["7d", "30d", "90d"] as const).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "default" : "ghost"}
                  size="xs"
                  onClick={() => setPeriod(p)}
                >
                  {p === "7d"
                    ? "7 Hari"
                    : p === "30d"
                      ? "30 Hari"
                      : "90 Hari"}
                </Button>
              ))}
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <BarChart data={chartData} />
        </CardContent>
      </Card>

      {/* Leads table */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Terbaru</CardTitle>
          <CardDescription>
            {MOCK_LEADS.length} lead masuk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">
                  Pesan
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_LEADS.slice(0, 7).map((lead) => {
                const status = STATUS_CONFIG[lead.status]
                return (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.email ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[240px] truncate text-muted-foreground">
                      {lead.message}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(lead.createdAt)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
