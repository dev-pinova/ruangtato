import Link from "next/link"

import { LogoMark } from "@/components/brand/logo-mark"
import { LogoWordmark } from "@/components/brand/logo-wordmark"
import type { LogoTone } from "@/lib/brand"
import { SITE_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

type PlatformLogoProps = {
  href?: string
  className?: string
  /** header: marketing nav | footer: footer | auth: login/register | app: sidebar | builder: header builder */
  variant?: "header" | "footer" | "auth" | "app" | "builder"
  collapsed?: boolean
}

const toneByVariant: Record<
  NonNullable<PlatformLogoProps["variant"]>,
  LogoTone
> = {
  header: "dark",
  footer: "dark",
  auth: "dark",
  app: "dark",
  builder: "dark",
}

export function PlatformLogo({
  href = "/",
  className,
  variant = "header",
  collapsed = false,
}: PlatformLogoProps) {
  const tone = toneByVariant[variant]

  const content =
    variant === "app" && collapsed ? (
      <LogoMark tone={tone} className="size-7" ariaHidden={false} />
    ) : variant === "app" || variant === "builder" ? (
      <LogoWordmark
        tone={tone}
        markClassName="size-7"
        textClassName="text-sm"
      />
    ) : variant === "auth" ? (
      <LogoWordmark
        tone={tone}
        markClassName="size-10"
        textClassName="text-lg"
      />
    ) : (
      <LogoWordmark
        tone={tone}
        markClassName="size-9 md:size-10"
        textClassName="text-base md:text-lg"
      />
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
