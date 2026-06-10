"use client"

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  // Same-origin avoids stale NEXT_PUBLIC_APP_URL baked in at build time.
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
})
