"use client"

import { useState } from "react"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { AdminSectionCard } from "./admin-section-card"

type AdminFilterBarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  onSubmit?: () => void
  filters?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function AdminFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  onSubmit,
  filters,
  actions,
  className,
}: AdminFilterBarProps) {
  const [filterOpen, setFilterOpen] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <AdminSectionCard className={cn("p-0", className)}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="min-h-11 pl-9 sm:min-h-9"
            />
          </div>
          {filters ? (
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11 shrink-0 md:hidden"
                  />
                }
              >
                <Filter className="size-4" />
                Filter
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter</SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-4">{filters}</div>
                <Button
                  type="button"
                  className="mt-6 w-full min-h-11"
                  onClick={() => {
                    onSubmit?.()
                    setFilterOpen(false)
                  }}
                >
                  Terapkan
                </Button>
              </SheetContent>
            </Sheet>
          ) : null}
          {actions}
        </div>

        {filters ? (
          <div className="hidden flex-wrap items-end gap-3 md:flex">{filters}</div>
        ) : null}

        {onSubmit ? (
          <div className="hidden md:block">
            <Button type="submit" variant="secondary" size="sm">
              Terapkan
            </Button>
          </div>
        ) : null}
      </form>
    </AdminSectionCard>
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
