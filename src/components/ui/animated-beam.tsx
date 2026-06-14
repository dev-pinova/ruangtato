"use client"

import { useEffect, useId, useState, type RefObject } from "react"
import { useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

interface AnimatedBeamProps {
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  className?: string
  curvature?: number
  reverse?: boolean
  duration?: number
  delay?: number
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

/**
 * Draws an animated gradient beam along an SVG path between two elements.
 * Adapted from Magic UI; respects prefers-reduced-motion by rendering a
 * static path with no moving gradient.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  className,
  curvature = 0,
  reverse = false,
  duration = 4,
  delay = 0,
  pathColor = "var(--border)",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "var(--brand-scarlet)",
  gradientStopColor = "oklch(0.7 0.15 30 / 60%)",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = useId()
  const prefersReducedMotion = useReducedMotion()
  const [pathD, setPathD] = useState("")
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })
  // Gate motion behind a mount flag so the server render and the first client
  // render are byte-identical (avoids hydration mismatch). The animated path
  // is only added after mount, when prefers-reduced-motion is also reliable.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- post-mount flag to keep SSR/first-client render identical (hydration safety)
    setMounted(true)
  }, [])

  const animate = mounted && !prefersReducedMotion

  useEffect(() => {
    const updatePath = () => {
      const container = containerRef.current
      const from = fromRef.current
      const to = toRef.current
      if (!container || !from || !to) return

      const containerRect = container.getBoundingClientRect()
      const rectA = from.getBoundingClientRect()
      const rectB = to.getBoundingClientRect()

      const svgWidth = containerRect.width
      const svgHeight = containerRect.height
      setSvgDimensions({ width: svgWidth, height: svgHeight })

      const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset
      const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset
      const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset
      const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset

      const controlY = startY - curvature
      const d = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`
      setPathD(d)
    }

    const resizeObserver = new ResizeObserver(() => updatePath())
    if (containerRef.current) resizeObserver.observe(containerRef.current)

    updatePath()
    window.addEventListener("resize", updatePath)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updatePath)
    }
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ])

  const gradientId = `beam-gradient-${id}`

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      className={cn(
        "pointer-events-none absolute left-0 top-0 z-0 transform-gpu stroke-2",
        className,
      )}
      aria-hidden
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      {animate && (
        <path
          d={pathD}
          strokeWidth={pathWidth}
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
        />
      )}
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0%"
          x2="0%"
          y1="0%"
          y2="0%"
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop
            offset="100%"
            stopColor={gradientStopColor}
            stopOpacity="0"
          />
          {animate && (
            <animate
              attributeName="x1"
              values={reverse ? "90%;-10%" : "10%;110%"}
              dur={`${duration}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          )}
          {animate && (
            <animate
              attributeName="x2"
              values={reverse ? "100%;0%" : "0%;100%"}
              dur={`${duration}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>
    </svg>
  )
}
