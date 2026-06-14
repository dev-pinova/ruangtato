/**
 * FULL database reset for a clean test restart.
 *
 * ⚠️ DESTRUCTIVE: deletes ALL rows from application + Better Auth tables.
 * Intended to wipe test data so members can re-register from zero.
 *
 * Preserves ONLY the `roles` seed table (e.g. the "owner" role), because that
 * is reference data, not test data. Pass --include-roles to wipe it too.
 *
 * Deletion order respects foreign keys (children first). Runs inside a single
 * transaction: either everything is wiped or nothing changes.
 *
 * SAFETY: requires explicit confirmation via env flag CONFIRM_RESET=YES,
 * and prints the target DB host before doing anything.
 *
 * Run:  CONFIRM_RESET=YES npm run db:reset
 */
import { sql } from "drizzle-orm"

import { getDb, isDatabaseConfigured } from "../src/db"
import {
  auditLogs,
  invoices,
  leads,
  payments,
  roles,
  studioMemberships,
  studios,
  subscriptions,
  suspensionLogs,
} from "../src/db/schema"
import { account, session, user, verification } from "../src/db/auth-schema"

function maskedHost(): string {
  const url = process.env.DATABASE_URL
  if (!url) return "(unknown)"
  try {
    const u = new URL(url.replace(/^postgres(ql)?:\/\//, "https://"))
    return `${u.host}${u.pathname}`
  } catch {
    return "(unparseable)"
  }
}

async function main() {
  if (!isDatabaseConfigured()) {
    console.error("DATABASE_URL is not configured.")
    process.exit(1)
  }

  const includeRoles = process.argv.includes("--include-roles")

  console.log("====================================================")
  console.log(" FULL DATABASE RESET")
  console.log(` Target : ${maskedHost()}`)
  console.log(` Roles  : ${includeRoles ? "WILL be wiped" : "preserved"}`)
  console.log("====================================================")

  if (process.env.CONFIRM_RESET !== "YES") {
    console.error(
      "\nAborted. This is destructive and irreversible.\n" +
        "Re-run with CONFIRM_RESET=YES to proceed (and make sure you have a backup).",
    )
    process.exit(1)
  }

  const db = getDb()

  await db.transaction(async (tx) => {
    // Children first, then parents (FK-safe).
    console.log("Deleting payments...")
    await tx.delete(payments)
    console.log("Deleting invoices...")
    await tx.delete(invoices)
    console.log("Deleting subscriptions...")
    await tx.delete(subscriptions)
    console.log("Deleting leads...")
    await tx.delete(leads)
    console.log("Deleting suspension_logs...")
    await tx.delete(suspensionLogs)
    console.log("Deleting audit_logs...")
    await tx.delete(auditLogs)
    console.log("Deleting studio_memberships...")
    await tx.delete(studioMemberships)
    console.log("Deleting studios...")
    await tx.delete(studios)

    // Better Auth tables (sessions/accounts/verifications reference user).
    console.log("Deleting sessions...")
    await tx.delete(session)
    console.log("Deleting accounts...")
    await tx.delete(account)
    console.log("Deleting verifications...")
    await tx.delete(verification)
    console.log("Deleting users...")
    await tx.delete(user)

    if (includeRoles) {
      console.log("Deleting roles...")
      await tx.delete(roles)
    }
  })

  // Report row counts so we can confirm everything is empty.
  const tables = [
    "payments",
    "invoices",
    "subscriptions",
    "leads",
    "suspension_logs",
    "audit_logs",
    "studio_memberships",
    "studios",
    "session",
    "account",
    "verification",
    '"user"',
    "roles",
  ]

  console.log("\nPost-reset row counts:")
  for (const t of tables) {
    const res = await db.execute(sql.raw(`SELECT COUNT(*)::int AS c FROM ${t}`))
    const count = (res.rows?.[0] as { c?: number } | undefined)?.c ?? "?"
    console.log(`  ${t.padEnd(22)} ${count}`)
  }

  console.log("\nDatabase reset complete. You can now register fresh members.")
}

main().catch((error) => {
  console.error("Reset failed (transaction rolled back):", error)
  process.exit(1)
})
