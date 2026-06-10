"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type AdminFilterBarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  onSubmit?: () => void
  className?: string
}

/** Compact search input for use inside AdminPageToolbar */
export function AdminFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  onSubmit,
  className,
}: AdminFilterBarProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit} className={cn("min-w-0", className)}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="min-h-11 pl-9 sm:min-h-9"
          aria-label={searchPlaceholder}
        />
      </div>
    </form>
  )
}

export function AdminFilterField({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex min-w-[140px] flex-col gap-1.5", className)}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
