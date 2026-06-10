import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminEmptyStateV2Props = {
  icon?: LucideIcon
  title: string
  description?: string
  celebratory?: boolean
  actionLabel?: string
  actionHref?: string
  className?: string
}

function EmptyIllustration({ celebratory }: { celebratory?: boolean }) {
  const Icon = celebratory ? Sparkles : null

  return (
    <svg
      viewBox="0 0 120 80"
      className="mx-auto h-24 w-32 text-muted-foreground/40"
      aria-hidden
    >
      <rect
        x="10"
        y="20"
        width="100"
        height="50"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="24"
        y1="36"
        x2="72"
        y2="36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="24"
        y1="48"
        x2="56"
        y2="48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <line
        x1="24"
        y1="60"
        x2="88"
        y2="60"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.25"
      />
      {Icon ? (
        <circle cx="92" cy="28" r="10" fill="var(--admin-success)" opacity="0.2" />
      ) : null}
    </svg>
  )
}

export function AdminEmptyStateV2({
  icon: Icon,
  title,
  description,
  celebratory,
  actionLabel,
  actionHref,
  className,
}: AdminEmptyStateV2Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        className,
      )}
    >
      <EmptyIllustration celebratory={celebratory} />
      {Icon ? (
        <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted">
          <Icon className="size-5 text-muted-foreground" aria-hidden />
        </div>
      ) : null}
      <div className="max-w-md space-y-2">
        <p className="text-pretty text-base font-medium">{title}</p>
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
