import { cn } from "@/lib/utils"

import { Tagline } from "./tagline"

type SectionHeadingProps = {
  title: string
  description?: React.ReactNode
  tagline?: string
  align?: "left" | "center"
  size?: "default" | "lg"
  as?: "h1" | "h2"
  className?: string
}

export function SectionHeading({
  title,
  description,
  tagline,
  align = "left",
  size = "default",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const titleClass =
    size === "lg"
      ? "text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
      : "text-xl font-semibold tracking-tight text-foreground"

  const descriptionClass =
    size === "lg"
      ? "text-base leading-relaxed text-muted-foreground md:text-lg"
      : "text-sm text-muted-foreground"

  return (
    <div
      className={cn(
        "space-y-2",
        align === "center" && "text-center",
        className
      )}
    >
      {tagline && <Tagline>{tagline}</Tagline>}
      <Heading className={titleClass}>{title}</Heading>
      {description && (
        <p className={descriptionClass}>{description}</p>
      )}
    </div>
  )
}
