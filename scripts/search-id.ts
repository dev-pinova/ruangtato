import { db } from "../src/db"
import { user } from "../src/db/auth-schema"
import { studios, subscriptions, invoices, payments } from "../src/db/schema"
import { eq, or, sql } from "drizzle-orm"

async function search() {
  if (!db) {
    console.error("Database not configured")
    process.exit(1)
  }

  const queryStr = "RT-d154015b-1780822121042"

  console.log(`Searching for "${queryStr}"...`)

  // 1. Check user
  try {
    const users = await db.select().from(user).where(
      or(
        eq(user.id, queryStr),
        eq(user.email, queryStr)
      )
    )
    if (users.length > 0) console.log("Found in user:", users)
  } catch (e) {
    console.error("Error searching user:", e)
  }

  // 2. Check studios
  try {
    const matchedStudios = await db.select().from(studios).where(
      or(
        eq(studios.id, queryStr),
        eq(studios.slug, queryStr)
      )
    )
    if (matchedStudios.length > 0) console.log("Found in studios:", matchedStudios)
  } catch {
    // Ignore cast error if UUID doesn't match string format
  }

  // 3. Check subscriptions
  try {
    const subs = await db.select().from(subscriptions).where(
      or(
        eq(subscriptions.id, queryStr),
        eq(subscriptions.midtransOrderId, queryStr)
      )
    )
    if (subs.length > 0) console.log("Found in subscriptions:", subs)
  } catch {
  }

  // 4. Check invoices
  try {
    const invs = await db.select().from(invoices).where(
      or(
        eq(invoices.id, queryStr),
        eq(invoices.midtransOrderId, queryStr)
      )
    )
    if (invs.length > 0) console.log("Found in invoices:", invs)
  } catch {
  }

  // 5. Check payments
  try {
    const pmts = await db.select().from(payments).where(
      or(
        eq(payments.id, queryStr),
        eq(payments.orderId, queryStr),
        eq(payments.transactionId, queryStr)
      )
    )
    if (pmts.length > 0) console.log("Found in payments:", pmts)
  } catch {
  }

  // 6. Generic check in all tables / columns via SQL search
  try {
    // Search the public tables using system catalogs or just run a simple select on each table
    const tables = [
      "user", "session", "account", "verification", "studios", 
      "studio_memberships", "subscriptions", "invoices", "payments", 
      "audit_logs", "suspension_logs", "leads"
    ]
    for (const table of tables) {
      // Get all columns of the table
      const res = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = ${table} AND data_type IN ('character varying', 'text', 'uuid')
      `)
      const columns = res.rows.map((row: Record<string, unknown>) => row.column_name as string)
      if (columns.length > 0) {
        const conditions = columns.map((col: string) => `CAST("${col}" AS text) = '${queryStr}'`).join(" OR ")
        const query = sql.raw(`SELECT * FROM "${table}" WHERE ${conditions}`)
        const matches = await db.execute(query)
        if (matches.rows.length > 0) {
          console.log(`Found in table "${table}":`, matches.rows)
        }
      }
    }
  } catch (e) {
    console.error("SQL search failed:", e)
  }

  console.log("Search complete.")
}

search().then(() => process.exit(0)).catch(err => {
  console.error(err)
  process.exit(1)
})
