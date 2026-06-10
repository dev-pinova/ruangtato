import {
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type AdminStatusVariant =
  | "active"
  | "suspended"
  | "expired"
  | "pending"
  | "success"
  | "failed"
  | "draft"
  | "default"

const STYLES: Record<AdminStatusVariant, string> = {
  active: "admin-status-success",
  success: "admin-status-success",
  suspended: "admin-status-error",
  failed: "admin-status-error",
  expired: "admin-status-error",
  pending: "admin-status-warning",
  draft: "admin-status-info",
  default: "",
}

const ICONS: Partial<Record<AdminStatusVariant, LucideIcon>> = {
  active: CheckCircle2,
  success: CheckCircle2,
  suspended: XCircle,
  failed: XCircle,
  expired: XCircle,
  pending: Clock,
  draft: CircleDashed,
}

export function AdminStatusBadge({
  status,
  label,
  className,
}: {
  status: string
  label?: string
  className?: string
}) {
  const variant = (status in STYLES ? status : "default") as AdminStatusVariant
  const Icon = ICONS[variant]

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-normal",
        STYLES[variant],
        className,
      )}
    >
      {Icon ? <Icon className="size-3 shrink-0" aria-hidden /> : null}
      {label ?? status}
    </Badge>
  )
}
