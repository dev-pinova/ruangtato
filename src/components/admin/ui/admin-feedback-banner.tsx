"use client"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminFeedbackBannerProps = {
  message: string
  variant?: "success" | "error"
  onDismiss?: () => void
  className?: string
}

export function AdminFeedbackBanner({
  message,
  variant = "success",
  onDismiss,
  className,
}: AdminFeedbackBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm",
        variant === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300",
        className,
      )}
    >
      <span>{message}</span>
      {onDismiss ? (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={onDismiss}
          aria-label="Tutup"
        >
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  )
}
