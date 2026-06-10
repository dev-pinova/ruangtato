"use client"

import { useEffect } from "react"

export function StudioTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const sessionKey = `viewed-studio-${slug}`
    if (typeof window !== "undefined" && !sessionStorage.getItem(sessionKey)) {
      fetch(`/api/studios/${slug}/track/view`, { method: "POST" })
        .then((res) => {
          if (res.ok) {
            sessionStorage.setItem(sessionKey, "true")
          }
        })
        .catch(() => {})
    }
  }, [slug])

  return null
}

export function trackStudioClick(slug: string) {
  fetch(`/api/studios/${slug}/track/click`, { method: "POST" }).catch(() => {})
}
