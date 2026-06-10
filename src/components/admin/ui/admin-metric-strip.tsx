"use client"

import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type AdminMetricItem = {
  id: string
  label: string
  count: number | string
  icon: LucideIcon
  tone?: "success" | "warning" | "error" | "info" | "neutral"
  active?: boolean
  onClick?: () => void
}

const TONE_STYLES: Record<
  NonNullable<AdminMetricItem["tone"]>,
  { icon: string; active: string }
> = {
  success: {
    icon: "text-[var(--admin-success)]",
    active: "border-[var(--admin-success)]/40 bg-[var(--admin-success)]/5",
  },
  warning: {
    icon: "text-[var(--admin-warning)]",
    active: "border-[var(--admin-warning)]/40 bg-[var(--admin-warning)]/5",
  },
  error: {
    icon: "text-[var(--admin-error)]",
    active: "border-[var(--admin-error)]/40 bg-[var(--admin-error)]/5",
  },
  info: {
    icon: "text-[var(--admin-info)]",
    active: "border-[var(--admin-info)]/40 bg-[var(--admin-info)]/5",
  },
  neutral: {
    icon: "text-muted-foreground",
    active: "border-border bg-muted/50",
  },
}

export function AdminMetricStrip({
  items,
  className,
}: {
  items: AdminMetricItem[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto overscroll-x-contain pb-1",
        className,
      )}
      role="tablist"
      aria-label="Ringkasan status"
    >
      {items.map((item) => {
        const Icon = item.icon
        const tone = item.tone ?? "neutral"
        const styles = TONE_STYLES[tone]
        const isInteractive = Boolean(item.onClick)

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.active}
            disabled={!isInteractive}
            onClick={item.onClick}
            className={cn(
              "flex min-w-[140px] shrink-0 items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors motion-safe:transition-colors",
              isInteractive &&
                "cursor-pointer hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !isInteractive && "cursor-default",
              item.active && styles.active,
            )}
          >
            <Icon className={cn("size-4 shrink-0", styles.icon)} aria-hidden />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-semibold tabular-nums tracking-tight">
                {item.count}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
