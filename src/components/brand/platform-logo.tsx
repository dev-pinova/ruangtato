import Link from "next/link"

import { PLATFORM_LOGO_PATH, SITE_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

type PlatformLogoProps = {
  href?: string
  className?: string
  /** header: marketing nav gelap | footer: footer terang | auth: halaman login/register | app: sidebar dashboard | builder: header builder */
  variant?: "header" | "footer" | "auth" | "app" | "builder"
  collapsed?: boolean
}

const imageClassByVariant: Record<
  NonNullable<PlatformLogoProps["variant"]>,
  string
> = {
  header:
    "h-11 w-auto max-w-[200px] object-contain object-left md:h-12 md:max-w-[220px]",
  footer:
    "h-11 w-auto max-w-[200px] object-contain object-left md:h-12 md:max-w-[220px]",
  auth: "h-10 w-auto max-w-[180px] object-contain",
  app: "h-8 w-auto max-w-[140px] object-contain object-left",
  builder:
    "h-8 w-auto max-w-[160px] object-contain object-left sm:h-9 sm:max-w-[180px]",
}

export function PlatformLogo({
  href = "/",
  className,
  variant = "header",
  collapsed = false,
}: PlatformLogoProps) {
  const needsDarkBackdrop = variant === "footer" || variant === "auth" || variant === "app"
  const imageClass =
    variant === "app" && collapsed
      ? "h-7 w-7 object-contain"
      : imageClassByVariant[variant]

  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={PLATFORM_LOGO_PATH}
      alt={SITE_NAME}
      className={imageClass}
    />
  )

  const content = needsDarkBackdrop ? (
    <span
      className={cn(
        "inline-flex items-center bg-black",
        variant === "footer" && "rounded-lg px-3 py-2",
        variant === "auth" && "rounded-lg px-4 py-2.5",
        variant === "app" && "rounded-md px-2 py-1.5",
      )}
    >
      {image}
    </span>
  ) : (
    image
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
