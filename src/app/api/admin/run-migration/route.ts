import { NextResponse } from "next/server"

import { isPlatformApiUser, requirePlatformApiPermission } from "@/lib/admin/admin-auth"
import { getDb } from "@/db"
import { sql } from "drizzle-orm"

/**
 * ONE-TIME migration endpoint: add 'artist_image' column to 'studios' table.
 *
 * DELETE THIS FILE after running it once successfully.
 *
 * Usage:
 *   fetch('/api/admin/run-migration', { method: 'POST' }).then(r => r.json()).then(console.log)
 */
export async function POST(request: Request) {
  const authResult = await requirePlatformApiPermission(request, "payments:read")
  if (!isPlatformApiUser(authResult)) return authResult

  const db = getDb()
  const results: string[] = []
  const errors: string[] = []

  const query = sql.raw(`
    ALTER TABLE studios ADD COLUMN IF NOT EXISTS artist_image text;
  `)

  try {
    await db.execute(query)
    results.push("✅ Added column artist_image to table studios")
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(`❌ Failed to add column: ${msg}`)
  }

  return NextResponse.json({
    ok: errors.length === 0,
    results,
    errors,
    note: "DELETE /src/app/api/admin/run-migration/route.ts after verifying success.",
  })
}
