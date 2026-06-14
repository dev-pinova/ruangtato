import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BorderBeam } from "@/components/ui/border-beam"

type MetricCardProps = {
  label: string
  value: string
  icon?: LucideIcon
  trend?: number
  trendLabel?: string
  className?: string
  isFeatured?: boolean
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs bulan lalu",
  className,
  isFeatured = false,
}: MetricCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <Card className={cn("relative overflow-hidden bg-card border border-border", className)}>
      {isFeatured && (
        <BorderBeam
          size={180}
          duration={6}
          delay={0}
          colorFrom="var(--brand-scarlet)"
          colorTo="oklch(100% 0 0 / 10%)"
        />
      )}
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
              <TrendingUp className="size-3 text-success" />
            ) : (
              <TrendingDown className="size-3 text-destructive" />
            )}
            <span
              className={cn(
                "font-medium",
                isPositive ? "text-success" : "text-destructive"
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
