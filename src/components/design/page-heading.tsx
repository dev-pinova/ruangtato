import { cn } from "@/lib/utils"

type PageHeadingProps = {
  title: string
  description?: string
  actions?: React.ReactNode
  size?: "default" | "sm"
  align?: "left" | "center"
  className?: string
}

export function PageHeading({
  title,
  description,
  actions,
  size = "default",
  align = "left",
  className,
}: PageHeadingProps) {
  const titleClass =
    size === "sm"
      ? "text-pretty text-lg font-semibold tracking-tight text-foreground md:text-xl"
      : "text-pretty text-xl font-semibold tracking-tight text-foreground md:text-2xl"

  if (align === "center") {
    return (
      <div className={cn("text-center", className)}>
        <h1 className={titleClass}>{title}</h1>
        {description && (
          <p className="mt-2 text-pretty text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className={titleClass}>{title}</h1>
        {description && (
          <p className="mt-1 text-pretty text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
