import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminPaginationProps = {
  page: number
  totalPages: number
  total: number
  totalLabel: string
  loading?: boolean
  onPageChange: (page: number) => void
  className?: string
}

export function AdminPagination({
  page,
  totalPages,
  total,
  totalLabel,
  loading,
  onPageChange,
  className,
}: AdminPaginationProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <span>
        {total} {totalLabel} · halaman {page} dari {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="min-h-11 min-w-[44px] sm:min-h-0"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="min-h-11 min-w-[44px] sm:min-h-0"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  )
}
