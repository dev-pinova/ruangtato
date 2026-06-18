import Link from "next/link"

import { LogoMark } from "@/components/brand/logo-mark"
import { LogoWordmark } from "@/components/brand/logo-wordmark"
import { SITE_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

type PlatformLogoProps = {
  href?: string
  className?: string
  /** header: marketing nav | footer: footer | auth: login/register | app: sidebar | builder: header builder */
  variant?: "header" | "footer" | "auth" | "app" | "builder"
  collapsed?: boolean
}

const textVariantByVariant: Record<
  NonNullable<PlatformLogoProps["variant"]>,
  "light" | "dark"
> = {
  header: "light",
  footer: "dark",
  auth: "light",
  app: "dark",
  builder: "dark",
}

export function PlatformLogo({
  href = "/",
  className,
  variant = "header",
  collapsed = false,
}: PlatformLogoProps) {
  const textVariant = textVariantByVariant[variant]

  const content =
    variant === "app" && collapsed ? (
      <LogoMark className="h-7 w-auto" ariaHidden={false} />
    ) : variant === "app" || variant === "builder" ? (
      <LogoWordmark
        textVariant={textVariant}
        markClassName="h-7 w-auto"
        textClassName="text-sm"
      />
    ) : variant === "auth" ? (
      <LogoWordmark
        textVariant={textVariant}
        markClassName="h-10 w-auto"
        textClassName="text-lg"
      />
    ) : (
      <LogoWordmark
        textVariant={textVariant}
        markClassName="h-9 w-auto md:h-10"
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
