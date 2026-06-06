import { headers } from "next/headers"

import { auth } from "@/lib/auth"

export async function getServerSession() {
  if (!process.env.DATABASE_URL) return null

  try {
    return await auth.api.getSession({
      headers: await headers(),
    })
  } catch (error) {
    // Stale / malformed auth cookies from a previous secret or strategy can
    // make Better Auth throw while decoding (e.g. "Invalid Base64 character: .").
    // Treat as no session — the page will redirect to /login and a fresh
    // sign-in will overwrite the bad cookies. Cookies cannot be deleted from a
    // Server Component, so the user may need to clear them manually if the
    // issue persists after re-login.
    console.warn(
      "[auth] Failed to read session — treating as signed out. " +
        "If this keeps happening, clear better-auth.* cookies for this origin.",
      error instanceof Error ? error.message : error,
    )
    return null
  }
}
