"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY)
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  )
}

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  offset?: number
  direction?: "up" | "down" | "left" | "right"
  inView?: boolean
  inViewMargin?: string
  blur?: string
}

export function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "down",
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(!inView)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!inView || reducedMotion) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: inViewMargin },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [inView, inViewMargin, reducedMotion])

  const getTranslate = () => {
    if (direction === "up") return `0, ${offset}px`
    if (direction === "down") return `0, -${offset}px`
    if (direction === "left") return `${offset}px, 0`
    if (direction === "right") return `-${offset}px, 0`
    return `0, ${offset}px`
  }

  const styles: React.CSSProperties = reducedMotion
    ? { opacity: 1 }
    : {
        transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s, filter ${duration}s ease ${delay}s`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0, 0)" : `translate(${getTranslate()})`,
        filter: isVisible ? "blur(0px)" : `blur(${blur})`,
      }

  return (
    <div ref={ref} className={cn(className)} style={styles}>
      {children}
    </div>
  )
}
