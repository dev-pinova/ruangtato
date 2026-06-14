"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

function useNumberTicker(
  value: number,
  {
    startValue = 0,
    direction = "up",
    delay = 0,
    decimalPlaces = 0,
    enabled = true,
    instant = false,
  } = {},
) {
  // Initial value must NOT depend on `instant` (which derives from
  // prefers-reduced-motion). On the server `instant` is always false, so the
  // initializer must match that to keep SSR and first client render identical.
  const [count, setCount] = useState(direction === "down" ? value : startValue)

  useEffect(() => {
    if (!enabled) return

    // Reduced motion / instant: jump straight to the final value (post-mount,
    // so this never causes a hydration mismatch).
    if (instant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- post-mount jump to final value for reduced-motion; not derived render state
      setCount(value)
      return
    }

    const timeout = setTimeout(() => {
      const target = value
      const start = direction === "down" ? value : startValue
      const duration = 1000
      const startTime = performance.now()

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutCubic(progress)

        if (direction === "down") {
          setCount(start - easedProgress * (start - target))
        } else {
          setCount(start + easedProgress * (target - start))
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(target)
        }
      }

      requestAnimationFrame(animate)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [value, startValue, direction, delay, enabled, instant])

  return count.toFixed(decimalPlaces)
}

interface NumberTickerProps {
  value: number
  startValue?: number
  direction?: "up" | "down"
  className?: string
  delay?: number
  decimalPlaces?: number
  /** When true (default), the count-up only starts once scrolled into view. */
  startOnView?: boolean
  /** Group integer part with locale separators (e.g. 2,500). */
  grouping?: boolean
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  startOnView = true,
  grouping = false,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })

  const enabled = startOnView ? inView : true

  const displayValue = useNumberTicker(value, {
    startValue,
    direction,
    delay,
    decimalPlaces,
    enabled,
    instant: Boolean(prefersReducedMotion),
  })

  const formatted = grouping
    ? Number(displayValue).toLocaleString("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })
    : displayValue

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tabular-nums tracking-tight text-foreground",
        className,
      )}
    >
      {formatted}
    </span>
  )
}
