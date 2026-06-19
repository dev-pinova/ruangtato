import Link from "next/link"

import { LogoMark } from "@/components/brand/logo-mark"
import { SITE_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

type PlatformLogoProps = {
  href?: string
  className?: string
  /** header: marketing nav | footer: footer | auth: login/register | app: sidebar | builder: header builder */
  variant?: "header" | "footer" | "auth" | "app" | "builder"
  collapsed?: boolean
}

export function PlatformLogo({
  href = "/",
  className,
  variant = "header",
  collapsed = false,
}: PlatformLogoProps) {
  const content =
    variant === "app" && collapsed ? (
      <LogoMark className="h-7 w-7" ariaHidden={false} variant="monogram" />
    ) : variant === "auth" ? (
      <LogoMark className="h-12 w-auto md:h-14" ariaHidden={false} />
    ) : variant === "app" || variant === "builder" ? (
      <LogoMark className="h-8 w-auto" ariaHidden={false} />
    ) : (
      <LogoMark className="h-9 w-auto md:h-10" ariaHidden={false} />
    )

  return (
    <Link
      href={href}
      aria-label={SITE_NAME}
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      {content}
    </Link>
  )
}
