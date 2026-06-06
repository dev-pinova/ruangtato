import { BadgeCheck } from "lucide-react"

import { cn } from "@/lib/utils"

export function VerifiedCheck({ className }: { className?: string }) {
  return (
    <BadgeCheck
      className={cn("size-4 shrink-0 fill-sky-500/20 text-sky-500", className)}
      aria-label="Studio terverifikasi"
    />
  )
}
