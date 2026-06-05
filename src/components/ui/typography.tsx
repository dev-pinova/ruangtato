import * as React from "react"
import { cn } from "@/lib/utils"

type TypographyProps = React.HTMLAttributes<HTMLElement>

export function H1({ className, ...props }: TypographyProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-5xl font-bold tracking-tighter lg:text-7xl font-sans text-foreground",
        className
      )}
      {...props}
    />
  )
}

export function H2({ className, ...props }: TypographyProps) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tighter first:mt-0 font-sans text-foreground",
        className
      )}
      {...props}
    />
  )
}

export function H3({ className, ...props }: TypographyProps) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tighter font-sans text-foreground",
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

export function Large({ className, ...props }: TypographyProps) {
  return (
    <div className={cn("text-lg font-semibold text-foreground font-sans", className)} {...props} />
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

export function Muted({ className, ...props }: TypographyProps) {
  return (
    <p
      className={cn("text-sm text-muted-foreground font-sans", className)}
      {...props}
    />
  )
}
