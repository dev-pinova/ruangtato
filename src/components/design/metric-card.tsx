import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type MetricCardProps = {
  label: string
  value: string
  icon?: LucideIcon
  trend?: number
  trendLabel?: string
  className?: string
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs bulan lalu",
  className,
}: MetricCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <Card className={className}>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          {Icon && <Icon className="size-3.5" />}
          {label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {value}
        </CardTitle>
      </CardHeader>
      {trend !== undefined && (
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
              {trend}%
            </span>
            <span className="text-muted-foreground">{trendLabel}</span>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
