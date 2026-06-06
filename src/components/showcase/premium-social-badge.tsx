import { Star } from "lucide-react"

import { LaurelWreath } from "@/components/showcase/laurel-wreath"

export function PremiumSocialBadge() {
  const label = "Join on Studio"

  return (
    <div className="flex items-center justify-center gap-3 md:gap-5">
      <LaurelWreath side="left" />

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="size-3.5 fill-amber-400 text-amber-400 md:size-4"
            />
          ))}
        </div>
        <p className="max-w-sm text-center text-xs font-medium leading-snug tracking-wide text-white/90 md:max-w-md md:text-sm">
          {label}
        </p>
      </div>

      <LaurelWreath side="right" />
    </div>
  )
}
