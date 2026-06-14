"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

interface MagicSpotlightProps {
  /** Radius of the spotlight in px. */
  size?: number
  /** Spotlight color — defaults to the brand scarlet token. */
  color?: string
  /** Peak opacity of the glow (0-1). */
  intensity?: number
  className?: string
}

/**
 * A pointer-following spotlight overlay (Magic UI "Magic Card" style), adapted
 * as a self-contained, pointer-events-none layer. It attaches mouse listeners
 * to its PARENT element, so it can be dropped inside an existing interactive
 * container (e.g. a card that is itself an <a>/Link) without intercepting
 * clicks. Place inside a `position: relative; overflow: hidden` parent.
 *
 * Respects prefers-reduced-motion (renders nothing).
 */
export function MagicSpotlight({
  size = 240,
  color = "var(--brand-scarlet)",
  intensity = 0.12,
  className,
}: MagicSpotlightProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  // Mount gate keeps the server render and first client render identical
  // (both render the inert overlay), avoiding hydration mismatch. The
  // reduced-motion decision is only applied after mount.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- post-mount flag to keep SSR/first-client render identical (hydration safety)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || prefersReducedMotion) return
    const parent = ref.current?.parentElement
    if (!parent) return

    const handleMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    const handleLeave = () => setPos(null)

    parent.addEventListener("mousemove", handleMove)
    parent.addEventListener("mouseleave", handleLeave)
    return () => {
      parent.removeEventListener("mousemove", handleMove)
      parent.removeEventListener("mouseleave", handleLeave)
    }
  }, [mounted, prefersReducedMotion])

  // After mount, drop the overlay entirely when reduced motion is preferred.
  if (mounted && prefersReducedMotion) return null

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 rounded-[inherit] transition-opacity duration-300",
        className,
      )}
      style={
        pos
          ? {
              opacity: intensity,
              background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 70%)`,
            }
          : { opacity: 0 }
      }
    />
  )
}
