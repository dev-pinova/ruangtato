"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type SortBy = "views" | "clicks" | "name"

export function FilterBar({
  sortBy,
  onSortChange,
  trustedOnly,
  onTrustedToggle,
}: {
  sortBy: SortBy
  onSortChange: (sort: SortBy) => void
  trustedOnly: boolean
  onTrustedToggle: () => void
}) {
  return (
    <div className="sticky top-16 z-30 border-y border-white/5 bg-background/90 py-4 backdrop-blur-xl">
      <div className="container mx-auto flex flex-col gap-3 px-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant={sortBy === "views" ? "secondary" : "ghost"}
            className={cn(
              "h-9 rounded-full px-4 text-xs",
              sortBy === "views" ? "bg-white/10" : "text-white/70"
            )}
            onClick={() => onSortChange("views")}
          >
            All studios
          </Button>
          <Button
            variant={sortBy === "clicks" ? "secondary" : "ghost"}
            className={cn(
              "h-9 rounded-full px-4 text-xs",
              sortBy === "clicks" ? "bg-white/10" : "text-white/70"
            )}
            onClick={() => onSortChange("clicks")}
          >
            Trending
          </Button>
          <Button
            variant={sortBy === "name" ? "secondary" : "ghost"}
            className={cn(
              "h-9 rounded-full px-4 text-xs",
              sortBy === "name" ? "bg-white/10" : "text-white/70"
            )}
            onClick={() => onSortChange("name")}
          >
            A-Z
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-[11px]">
            Sort: {sortBy === "views" ? "most viewed" : sortBy === "clicks" ? "most clicked" : "alphabetical"}
          </Badge>
          <label className="flex cursor-pointer items-center gap-2">
            <Switch checked={trustedOnly} onCheckedChange={onTrustedToggle} size="sm" />
            <Badge
              variant={trustedOnly ? "default" : "outline"}
              className="cursor-pointer text-[11px]"
            >
              Trusted only
            </Badge>
          </label>
        </div>
      </div>
    </div>
  )
}
