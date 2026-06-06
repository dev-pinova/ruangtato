"use client"

import { useEffect } from "react"

export function StudioTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/studios/${slug}/track/view`, { method: "POST" }).catch(() => {})
  }, [slug])

  return null
}

export function trackStudioClick(slug: string) {
  fetch(`/api/studios/${slug}/track/click`, { method: "POST" }).catch(() => {})
}
