import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  /** Render inside a dashed-border surface (use when standing alone in a card body). */
  bordered?: boolean
  className?: string
}

/**
 * Shared member-app empty state. Mirrors the admin panel's empty-state
 * rhythm (icon chip + title + description + optional action) so both
 * surfaces share one foundation, tuned lighter for the consumer app.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  bordered = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        bordered && "rounded-lg border border-dashed border-border",
        className,
      )}
    >
      {Icon ? (
        <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted">
          <Icon className="size-5 text-muted-foreground" aria-hidden />
        </div>
      ) : null}
      <div className="max-w-sm space-y-1">
        <p className="text-pretty text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="text-pretty text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actionLabel && actionHref ? (
        <Button
          nativeButton={false}
          size="sm"
          variant="outline"
          render={<Link href={actionHref} />}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
