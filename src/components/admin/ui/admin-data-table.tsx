"use client"

import type { LucideIcon } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { AdminEmptyStateV2 } from "./admin-empty-state-v2"
import { AdminTableSkeleton } from "./admin-loading-skeleton"
import { AdminPanel } from "./admin-panel"

export type AdminTableColumn<T> = {
  key: string
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
  numeric?: boolean
}

type AdminDataTableProps<T> = {
  columns: AdminTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  loading?: boolean
  onRowClick?: (row: T) => void
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription?: string
  emptyCelebratory?: boolean
  mobileCard?: (row: T) => React.ReactNode
  className?: string
}

export function AdminDataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  onRowClick,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyCelebratory,
  mobileCard,
  className,
}: AdminDataTableProps<T>) {
  const desktopColumns = columns.filter((c) => !c.hideOnMobile)

  if (loading) {
    return (
      <AdminPanel className={className}>
        <AdminTableSkeleton />
      </AdminPanel>
    )
  }

  if (rows.length === 0) {
    return (
      <AdminPanel className={className}>
        <AdminEmptyStateV2
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          celebratory={emptyCelebratory}
        />
      </AdminPanel>
    )
  }

  return (
    <>
      {/* Mobile card list */}
      <div className={cn("space-y-3 md:hidden", className)}>
        {rows.map((row) => (
          <div
            key={rowKey(row)}
            role={onRowClick ? "button" : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            onKeyDown={
              onRowClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onRowClick(row)
                    }
                  }
                : undefined
            }
            className={cn(
              "rounded-xl border border-border bg-card p-4",
              onRowClick &&
                "cursor-pointer transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            {mobileCard ? (
              mobileCard(row)
            ) : (
              <div className="space-y-2">
                {desktopColumns.map((col) => (
                  <div key={col.key} className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{col.header}</span>
                    <span
                      className={cn(
                        "min-w-0 text-right font-medium",
                        col.numeric && "tabular-nums",
                      )}
                    >
                      {col.cell(row)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <AdminPanel className={cn("hidden md:block", className)}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "text-xs font-medium uppercase tracking-wide text-muted-foreground",
                    col.className,
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={rowKey(row)}
                className={onRowClick ? "cursor-pointer" : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      "min-w-0",
                      col.numeric && "tabular-nums",
                      col.className,
                    )}
                  >
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminPanel>
    </>
  )
}
