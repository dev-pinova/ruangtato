/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils"

type LogoMarkProps = {
  className?: string
  ariaHidden?: boolean
}

export function LogoMark({
  className,
  ariaHidden = true,
}: LogoMarkProps) {
  return (
    <img
      src="/image/logo-ruangtato.svg"
      alt={ariaHidden ? "" : "Ruangtato Logo"}
      aria-hidden={ariaHidden}
      className={cn("shrink-0 object-contain", className)}
    />
  )
}
