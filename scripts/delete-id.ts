import { db } from "../src/db"
import { subscriptions, invoices, payments } from "../src/db/schema"
import { eq } from "drizzle-orm"

async function deleteRecords() {
  if (!db) {
    console.error("Database not configured")
    process.exit(1)
  }

  const queryStr = "RT-d154015b-1780822121042"
  console.log(`Deleting records matching "${queryStr}"...`)

  try {
    const deletedSubs = await db.delete(subscriptions).where(eq(subscriptions.midtransOrderId, queryStr)).returning()
    console.log(`Deleted from subscriptions:`, deletedSubs.length, "rows")
  } catch (e) {
    console.error("Error deleting from subscriptions:", e)
  }

  try {
    const deletedInvs = await db.delete(invoices).where(eq(invoices.midtransOrderId, queryStr)).returning()
    console.log(`Deleted from invoices:`, deletedInvs.length, "rows")
  } catch (e) {
    console.error("Error deleting from invoices:", e)
  }

  try {
    const deletedPmts = await db.delete(payments).where(eq(payments.orderId, queryStr)).returning()
    console.log(`Deleted from payments:`, deletedPmts.length, "rows")
  } catch (e) {
    console.error("Error deleting from payments:", e)
  }

  console.log("Deletion completed.")
}

deleteRecords().then(() => process.exit(0)).catch(err => {
  console.error(err)
  process.exit(1)
})
