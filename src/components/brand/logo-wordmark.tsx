import { LogoMark } from "@/components/brand/logo-mark"
import {
  BRAND_WORDMARK_PREFIX,
  BRAND_WORDMARK_SUFFIX,
} from "@/lib/brand"
import { cn } from "@/lib/utils"

type LogoWordmarkProps = {
  className?: string
  markClassName?: string
  textClassName?: string
  showText?: boolean
  /** Text color variant: "light" = white text, "dark" = foreground text */
  textVariant?: "light" | "dark"
}

export function LogoWordmark({
  className,
  markClassName,
  textClassName,
  showText = true,
  textVariant = "light",
}: LogoWordmarkProps) {
  const prefixColor = textVariant === "light" ? "text-white" : "text-foreground"

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-8 w-auto", markClassName)} />
      {showText ? (
        <span
          aria-hidden
          className={cn("font-semibold tracking-tight", textClassName)}
        >
          <span className={prefixColor}>{BRAND_WORDMARK_PREFIX}</span>
          <span className="text-brand-scarlet">{BRAND_WORDMARK_SUFFIX}</span>
        </span>
      ) : null}
    </span>
  )
}
