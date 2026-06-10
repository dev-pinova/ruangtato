"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

function useNumberTicker(
  value: number,
  { startValue = 0, direction = "up", delay = 0, decimalPlaces = 0 } = {},
) {
  const [count, setCount] = useState(direction === "down" ? value : startValue)

  useEffect(() => {
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
  }, [value, startValue, direction, delay])

  return count.toFixed(decimalPlaces)
}

interface NumberTickerProps {
  value: number
  startValue?: number
  direction?: "up" | "down"
  className?: string
  delay?: number
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const displayValue = useNumberTicker(value, {
    startValue,
    direction,
    delay,
    decimalPlaces,
  })

  return (
    <span
      className={cn(
        "inline-block tabular-nums tracking-tight text-foreground",
        className,
      )}
    >
      {displayValue}
    </span>
  )
}
