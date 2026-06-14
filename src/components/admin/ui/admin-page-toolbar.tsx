"use client"

import { Download, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BorderBeam } from "@/components/ui/border-beam"
import { cn } from "@/lib/utils"
import { AdminPanelInset } from "./admin-panel"

type AdminPageToolbarProps = {
  filters?: React.ReactNode
  search?: React.ReactNode
  onRefresh?: () => void
  onExport?: () => void
  refreshLoading?: boolean
  actions?: React.ReactNode
  className?: string
}

export function AdminPageToolbar({
  filters,
  search,
  onRefresh,
  onExport,
  refreshLoading,
  actions,
  className,
}: AdminPageToolbarProps) {
  return (
    <AdminPanelInset
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {search ? (
          <div className="relative min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-card/20 backdrop-blur-md transition-all focus-within:border-border focus-within:ring-1 focus-within:ring-ring/50 [&_input]:border-0 [&_input]:bg-transparent [&_input]:focus-visible:ring-0">
            {search}
            <BorderBeam size={100} duration={8} borderWidth={1} colorFrom="var(--brand-scarlet)" colorTo="transparent" />
          </div>
        ) : null}
        {filters ? (
          <div className="flex flex-wrap items-end gap-3">{filters}</div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {actions}
        {onRefresh ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11 sm:min-h-0"
            disabled={refreshLoading}
            onClick={onRefresh}
            aria-label="Refresh data"
          >
            <RefreshCw
              className={cn("size-4", refreshLoading && "motion-safe:animate-spin")}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        ) : null}
        {onExport ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11 sm:min-h-0"
            onClick={onExport}
            aria-label="Export data"
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        ) : null}
      </div>
    </AdminPanelInset>
  )
}
