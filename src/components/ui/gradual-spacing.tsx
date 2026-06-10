"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface GradualSpacingProps {
  text: string
  className?: string
  duration?: number
  delayMultiple?: number
  framerProps?: Variants
}

export function GradualSpacing({
  text,
  className,
  duration = 0.5,
  delayMultiple = 0.04,
  framerProps = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  },
}: GradualSpacingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className="inline-flex justify-center">
      <AnimatePresence>
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={framerProps}
            transition={{ duration, delay: i * delayMultiple }}
            className={cn("tracking-normal", className)}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}

