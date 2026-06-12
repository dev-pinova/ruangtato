import { db, isDatabaseConfigured } from "../src/db"
import { payments, subscriptions, invoices, studios } from "../src/db/schema"
import { user } from "../src/db/auth-schema"

async function main() {
  if (!isDatabaseConfigured() || !db) {
    console.error("DATABASE_URL is not configured.")
    process.exit(1)
  }

  console.log("Starting database cleanup for testing reset...")

  // 1. Wipe Transaction History
  console.log("Wiping payments, invoices, and subscriptions...")
  await db.delete(payments)
  await db.delete(invoices)
  await db.delete(subscriptions)

  // 2. Reset Studios Stats and Status
  console.log("Resetting studios status and stats...")
  await db.update(studios).set({
    status: "active", // Reset to 'active' due to check constraint IN ('active', 'suspended')
    isTrusted: false,
    isPublished: false,
    viewCount: 0,
    clickCount: 0,
  })

  // 3. Preserve User Accounts (Ensure they are active)
  console.log("Ensuring all user accounts are active...")
  await db.update(user).set({
    status: "active",
  })

  console.log("Database successfully cleaned up for clean testing!")
}

main().catch((error) => {
  console.error("Cleanup failed:", error)
  process.exit(1)
})
