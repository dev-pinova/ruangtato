"use client"

import React, { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type Circle = {
  x: number
  y: number
  translateX: number
  translateY: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnet: number
}

interface ParticlesProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  color?: string
  vx?: number
  vy?: number
}

export const Particles = ({
  className,
  quantity = 30,
  size = 0.6,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const circle = useRef<Circle[]>([])
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1

  const initCanvas = () => {
    resizeCanvas()
    drawParticles()
  }

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circle.current = []
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight
      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)
    }
  }

  const drawParticles = () => {
    for (let i = 0; i < quantity; i++) {
      const circleArgs = circleParams()
      circle.current.push(circleArgs)
    }
  }

  const circleParams = () => {
    const x = Math.floor(Math.random() * canvasSize.current.w)
    const y = Math.floor(Math.random() * canvasSize.current.h)
    const translateX = 0
    const translateY = 0
    const alpha = 0.1 + Math.random() * 0.4
    const targetAlpha = alpha
    const dx = (Math.random() - 0.5) * 0.08
    const dy = (Math.random() - 0.5) * 0.08
    const magnet = 1 + Math.random() * 1.5
    return {
      x,
      y,
      translateX,
      translateY,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnet,
    }
  }

  const drawCircle = (circleArgs: Circle) => {
    if (context.current) {
      const { x, y, translateX, translateY, alpha } = circleArgs
      context.current.save()
      context.current.translate(translateX, translateY)
      context.current.beginPath()
      context.current.arc(x, y, size, 0, 2 * Math.PI)
      context.current.fillStyle = hexToRgb(color)
        ? `rgba(${hexToRgb(color)!.join(",")}, ${alpha})`
        : `rgba(255, 255, 255, ${alpha})`
      context.current.fill()
      context.current.restore()
    }
  }

  const hexToRgb = (hex: string): number[] | null => {
    const cleanHex = hex.replace("#", "")
    if (cleanHex.length === 3) {
      return cleanHex
        .split("")
        .map((char) => parseInt(char + char, 16))
    }
    if (cleanHex.length === 6) {
      return [
        parseInt(cleanHex.substring(0, 2), 16),
        parseInt(cleanHex.substring(2, 4), 16),
        parseInt(cleanHex.substring(4, 6), 16),
      ]
    }
    return null
  }

  const animate = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h)
      circle.current.forEach((circleArgs: Circle) => {
        // Handle border overlap
        if (circleArgs.x < 0 || circleArgs.x > canvasSize.current.w) {
          circleArgs.dx = -circleArgs.dx
        }
        if (circleArgs.y < 0 || circleArgs.y > canvasSize.current.h) {
          circleArgs.dy = -circleArgs.dy
        }
        circleArgs.x += circleArgs.dx + vx
        circleArgs.y += circleArgs.dy + vy
        drawCircle(circleArgs)
      })
      requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
    }
    initCanvas()
    animate()
    window.addEventListener("resize", initCanvas)

    return () => {
      window.removeEventListener("resize", initCanvas)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-init only on color change to preserve original animation lifecycle
  }, [color])

  return (
    <div
      className={cn("pointer-events-none select-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
