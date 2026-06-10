import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { AdminSectionCard } from "./admin-section-card"

export function AdminKpiSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex min-w-[140px] shrink-0 items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
        >
          <Skeleton className="size-4 shrink-0 rounded" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

export function AdminChartSkeleton({ className }: { className?: string }) {
  return (
    <AdminSectionCard className={className}>
      <Skeleton className="mb-4 h-4 w-28" />
      <Skeleton className="h-48 w-full md:h-56" />
    </AdminSectionCard>
  )
}

export function AdminPageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <AdminKpiSkeletonGrid />
      <AdminTableSkeleton />
    </div>
  )
}
