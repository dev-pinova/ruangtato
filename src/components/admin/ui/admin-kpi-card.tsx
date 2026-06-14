import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { AdminSectionCard } from "./admin-section-card"

type AdminKpiCardProps = {
  label: string
  value: string
  icon?: LucideIcon
  delta?: string
  deltaPositive?: boolean
  loading?: boolean
  className?: string
}

export function AdminKpiCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaPositive,
  loading,
  className,
}: AdminKpiCardProps) {
  if (loading) {
    return (
      <AdminSectionCard className={cn("space-y-3", className)}>
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-7 w-32 animate-pulse rounded bg-muted" />
      </AdminSectionCard>
    )
  }

  return (
    <AdminSectionCard className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {Icon ? <Icon className="size-3.5 shrink-0 text-primary/80" /> : null}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {delta ? (
        <p
          className={cn(
            "text-xs font-medium",
            deltaPositive === false ? "text-destructive" : "text-success",
          )}
        >
          {delta}
        </p>
      ) : null}
    </AdminSectionCard>
  )
}
