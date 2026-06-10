import { cn } from "@/lib/utils"

export function AdminPanel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("admin-panel overflow-hidden", className)}>
      {children}
    </div>
  )
}

export function AdminPanelInset({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("admin-inset px-4 py-3", className)}>
      {children}
    </div>
  )
}
