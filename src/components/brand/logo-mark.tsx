/* eslint-disable @next/next/no-img-element */
import { BRAND_LOGO_SVG } from "@/lib/brand"
import { cn } from "@/lib/utils"

type LogoMarkProps = {
  className?: string
  ariaHidden?: boolean
  variant?: "default" | "monogram"
}

export function LogoMark({
  className,
  ariaHidden = true,
  variant = "default",
}: LogoMarkProps) {
  const imgSrc = variant === "monogram" ? "/image/logo-mark.svg" : BRAND_LOGO_SVG

  return (
    <img
      src={imgSrc}
      alt={ariaHidden ? "" : "Ruangtato Logo"}
      aria-hidden={ariaHidden}
      className={cn("shrink-0 object-contain", className)}
    />
  )
}
