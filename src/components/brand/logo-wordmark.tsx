import { LogoMark } from "@/components/brand/logo-mark"
import {
  BRAND_WORDMARK_PREFIX,
  BRAND_WORDMARK_SUFFIX,
  type LogoTone,
} from "@/lib/brand"
import { cn } from "@/lib/utils"

type LogoWordmarkProps = {
  tone?: LogoTone
  className?: string
  markClassName?: string
  textClassName?: string
  showText?: boolean
}

export function LogoWordmark({
  tone = "dark",
  className,
  markClassName,
  textClassName,
  showText = true,
}: LogoWordmarkProps) {
  const prefixColor = tone === "dark" ? "text-white" : "text-foreground"

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} className={cn("size-8", markClassName)} />
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
