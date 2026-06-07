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
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  suspended: "border-red-500/30 bg-red-500/10 text-red-400",
  failed: "border-red-500/30 bg-red-500/10 text-red-400",
  expired: "border-red-500/30 bg-red-500/10 text-red-400",
  pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  draft: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  default: "",
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

  return (
    <Badge
      variant="outline"
      className={cn(STYLES[variant], className)}
    >
      {label ?? status}
    </Badge>
  )
}
