import { cn } from "@/lib/utils"

import { Tagline } from "./tagline"

type SectionHeadingProps = {
  title: string
  description?: React.ReactNode
  tagline?: string
  align?: "left" | "center"
  size?: "default" | "lg"
  as?: "h1" | "h2"
  tone?: "default" | "inverse"
  className?: string
}

export function SectionHeading({
  title,
  description,
  tagline,
  align = "left",
  size = "default",
  as: Heading = "h2",
  tone = "default",
  className,
}: SectionHeadingProps) {
  const isInverse = tone === "inverse"

  const titleClass = cn(
    size === "lg"
      ? "text-4xl font-semibold tracking-tight md:text-5xl"
      : "text-xl font-semibold tracking-tight",
    isInverse ? "text-white" : "text-foreground"
  )

  const descriptionClass = cn(
    size === "lg"
      ? "text-base leading-relaxed md:text-lg"
      : "text-sm",
    isInverse ? "text-white/75" : "text-muted-foreground"
  )

  return (
    <div
      className={cn(
        "space-y-2",
        align === "center" && "text-center",
        className
      )}
    >
      {tagline && (
        <Tagline className={isInverse ? "text-white/60" : undefined}>
          {tagline}
        </Tagline>
      )}
      <Heading className={titleClass}>{title}</Heading>
      {description && (
        <p className={descriptionClass}>{description}</p>
      )}
    </div>
  )
}
