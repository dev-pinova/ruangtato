import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PlatformRole } from "@/lib/admin/admin-auth"

/**
 * Single source of truth for platform-role colors and labels across the
 * admin panel. Semantics: the more powerful the role, the stronger the
 * signal — super_admin uses the destructive (red) token, descending to
 * success (green) for finance. Regular (non-staff) users are neutral.
 */
const ROLE_BADGE_CLASS: Record<PlatformRole, string> = {
  super_admin: "bg-destructive/10 text-destructive border-destructive/20",
  admin: "bg-warning/10 text-warning border-warning/20",
  support: "bg-info/10 text-info border-info/20",
  finance: "bg-success/10 text-success border-success/20",
}

const ROLE_LABEL: Record<PlatformRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  support: "Support",
  finance: "Finance",
}

const NEUTRAL_CLASS = "bg-muted text-muted-foreground border-border"
const NEUTRAL_LABEL = "Regular User"

export function roleBadgeClass(role: string | null | undefined): string {
  return role && role in ROLE_BADGE_CLASS
    ? ROLE_BADGE_CLASS[role as PlatformRole]
    : NEUTRAL_CLASS
}

export function roleLabel(role: string | null | undefined): string {
  return role && role in ROLE_LABEL
    ? ROLE_LABEL[role as PlatformRole]
    : NEUTRAL_LABEL
}

export function AdminRoleBadge({
  role,
  className,
}: {
  role: string | null | undefined
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", roleBadgeClass(role), className)}
    >
      {roleLabel(role)}
    </Badge>
  )
}
