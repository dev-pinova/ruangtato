import { cn } from "@/lib/utils"

export function AdminSectionCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 md:p-5",
        className,
      )}
    >
      {children}
    </div>
  )
}
