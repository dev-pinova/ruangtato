import { NextResponse } from "next/server"

import { isPlatformApiUser, requirePlatformApiPermission } from "@/lib/admin/admin-auth"
import { getDb } from "@/db"
import { sql } from "drizzle-orm"

/**
 * ONE-TIME migration endpoint: rename Midtrans column names to generic names.
 *
 * DELETE THIS FILE after running it once successfully.
 *
 * Usage:
 *   curl -X POST https://ruangtato.com/api/admin/run-migration \
 *     -H "Cookie: <your-admin-session-cookie>"
 *
 * Or open in browser DevTools console (if logged in as admin):
 *   fetch('/api/admin/run-migration', { method: 'POST' }).then(r => r.json()).then(console.log)
 */
export async function POST(request: Request) {
  // Require admin session — only admins can trigger this
  const authResult = await requirePlatformApiPermission(request, "payments:read")
  if (!isPlatformApiUser(authResult)) return authResult

  const db = getDb()
  const results: string[] = []
  const errors: string[] = []

  const steps = [
    {
      name: "subscriptions: midtrans_order_id → last_order_id",
      query: sql.raw(`
        DO $$ BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='subscriptions' AND column_name='midtrans_order_id'
          ) THEN
            ALTER TABLE subscriptions RENAME COLUMN midtrans_order_id TO last_order_id;
          END IF;
        END $$
      `),
    },
    {
      name: "subscriptions: midtrans_transaction_id → last_transaction_id",
      query: sql.raw(`
        DO $$ BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='subscriptions' AND column_name='midtrans_transaction_id'
          ) THEN
            ALTER TABLE subscriptions RENAME COLUMN midtrans_transaction_id TO last_transaction_id;
          END IF;
        END $$
      `),
    },
    {
      name: "invoices: midtrans_order_id → order_id",
      query: sql.raw(`
        DO $$ BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='invoices' AND column_name='midtrans_order_id'
          ) THEN
            ALTER TABLE invoices RENAME COLUMN midtrans_order_id TO order_id;
          END IF;
        END $$
      `),
    },
  ]

  for (const step of steps) {
    try {
      await db.execute(step.query)
      results.push(`✅ ${step.name}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`❌ ${step.name}: ${msg}`)
    }
  }

  return NextResponse.json({
    ok: errors.length === 0,
    results,
    errors,
    note: "DELETE /src/app/api/admin/run-migration/route.ts after verifying success.",
  })
}
