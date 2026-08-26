import * as React from "react"
import { cn } from "@/lib/utils"

type TypographyProps = React.HTMLAttributes<HTMLElement>

export function H2({ className, ...props }: TypographyProps) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tighter text-foreground first:mt-0 font-sans",
        className
      )}
      {...props}
    />
  )
}

export function P({ className, ...props }: TypographyProps) {
  return (
    <p
      className={cn("leading-relaxed text-foreground/70 font-sans", className)}
      {...props}
    />
  )
}

export function Small({ className, ...props }: TypographyProps) {
  return (
    <small
      className={cn("text-sm font-medium leading-none text-foreground/60 font-sans", className)}
      {...props}
    />
  )
}
