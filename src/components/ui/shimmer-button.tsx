import React, { CSSProperties } from "react"
import { cn } from "@/lib/utils"

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  shimmerDuration?: string
  borderRadius?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "var(--brand-scarlet)",
      shimmerSize = "0.08em",
      shimmerDuration = "2.5s",
      borderRadius = "9999px",
      background = "oklch(0.12 0 0)",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--shimmer-duration": shimmerDuration,
            "--border-radius": borderRadius,
            "--background": background,
          } as CSSProperties
        }
        ref={ref}
        className={cn(
          "group relative flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/5 px-6 py-3 text-white [background:var(--background)] [border-radius:var(--border-radius)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
          "shadow-[0_0_12px_rgba(255,255,255,0.02)] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]",
          className,
        )}
        {...props}
      >
        {/* spark container */}
        <div className="absolute inset-0 z-0 overflow-visible [container-type:size]">
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] w-[100cqw] animate-shimmer-button-shimmer [aspect-ratio:1] [background:radial-gradient(circle_at_100%_100%,var(--shimmer-color)_0,transparent_30%)] [offset-anchor:100%_100%] [offset-path:rect(0_auto_auto_0_round_var(--border-radius))]" />
        </div>
        
        {/* content */}
        <div className="relative z-10 flex items-center gap-2">
          {children}
        </div>

        {/* backdrop */}
        <div className="absolute inset-[1px] -z-10 [background:var(--background)] [border-radius:calc(var(--border-radius)-1px)] transition-colors duration-300 group-hover:bg-zinc-900" />
      </button>
    )
  },
)

ShimmerButton.displayName = "ShimmerButton"
