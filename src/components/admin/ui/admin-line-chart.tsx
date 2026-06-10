"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { AdminSectionCard } from "./admin-section-card"

const chartConfig = {
  value: {
    label: "Nilai",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type AdminLineChartProps = {
  title: string
  data: { month: string; value: number }[]
  valueFormatter?: (value: number) => string
  loading?: boolean
}

export function AdminLineChart({
  title,
  data,
  valueFormatter = (v) => String(v),
  loading,
}: AdminLineChartProps) {
  const hasData = data.length > 0

  if (loading) {
    return (
      <AdminSectionCard>
        <Skeleton className="mb-4 h-4 w-28" />
        <Skeleton className="h-48 w-full md:h-56" />
      </AdminSectionCard>
    )
  }

  return (
    <AdminSectionCard>
      <h3 className="mb-4 text-sm font-medium">{title}</h3>
      <div className="h-48 w-full md:h-56">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full"
            initialDimension={{ width: 400, height: 200 }}
          >
            <AreaChart
              data={data}
              margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="var(--color-value)" floodOpacity={0.4} />
                </filter>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="hsl(var(--border))"
                strokeOpacity={0.15}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Bulan ${label}`}
                    formatter={(value) => valueFormatter(Number(value))}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#chartColor)"
                filter="url(#glow)"
                dot={{ r: 3, fill: "var(--color-value)", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "var(--color-value)", strokeWidth: 2, stroke: "#000" }}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Belum ada data chart.
          </div>
        )}
      </div>
    </AdminSectionCard>
  )
}
