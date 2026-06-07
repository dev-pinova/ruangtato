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
import { AdminEmptyState } from "./admin-empty-state"
import { AdminTableSkeleton } from "./admin-loading-skeleton"

export type AdminTableColumn<T> = {
  key: string
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
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
  mobileCard,
  className,
}: AdminDataTableProps<T>) {
  const desktopColumns = columns.filter((c) => !c.hideOnMobile)

  if (loading) {
    return <AdminTableSkeleton />
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border">
        <AdminEmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
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
              "rounded-xl border border-border bg-card/50 p-4",
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
                    <span className="text-right font-medium">{col.cell(row)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className={cn("hidden rounded-xl border border-border md:block", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
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
                  <TableCell key={col.key} className={col.className}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
