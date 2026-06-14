import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface BentoGridProps {
  children: ReactNode
  className?: string
}

interface BentoCardProps {
  name: string
  description: string
  className?: string
  /** Optional icon rendered top-left. */
  icon?: ReactNode
  /** Optional decorative background (image / gradient layer). */
  background?: ReactNode
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[16rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function BentoCard({
  name,
  description,
  className,
  icon,
  background,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card",
        "transition-all duration-300 hover:border-foreground/30 hover:shadow-md",
        className,
      )}
    >
      {/* Decorative background layer (optional) */}
      {background && (
        <div className="pointer-events-none absolute inset-0 z-0">{background}</div>
      )}

      <div className="relative z-10 flex flex-col gap-2 p-6">
        {icon && (
          <div className="mb-2 inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {name}
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
