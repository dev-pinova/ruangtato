import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminPageHeaderV2Props = {
  title: string
  description?: string
  badge?: string
  docsHref?: string
  actions?: React.ReactNode
  className?: string
}

export function AdminPageHeaderV2({
  title,
  description,
  badge,
  docsHref,
  actions,
  className,
}: AdminPageHeaderV2Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-pretty text-xl font-semibold tracking-tight md:text-2xl">
            {title}
          </h1>
          {badge ? (
            <Badge variant="outline" className="font-normal">
              {badge}
            </Badge>
          ) : null}
        </div>
        {description ? (
          <p className="text-pretty text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {docsHref ? (
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            className="min-h-11 sm:min-h-0"
            render={
              <Link href={docsHref} target="_blank" rel="noopener noreferrer" />
            }
          >
            Docs
            <ExternalLink className="size-3.5" aria-hidden />
          </Button>
        ) : null}
        {actions}
      </div>
    </div>
  )
}
