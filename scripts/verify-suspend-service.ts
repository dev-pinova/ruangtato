import { eq } from "drizzle-orm"

import { db, isDatabaseConfigured } from "../src/db"
import { user } from "../src/db/auth-schema"
import { studios } from "../src/db/schema"
import {
  getPrimaryOwnerForStudio,
  listSuspendedStudios,
  listSuspensionLogs,
} from "../src/lib/admin/admin-suspend-service"
import { isSuspensionReasonCategory } from "../src/lib/admin/suspension-types"

async function main() {
  if (!isDatabaseConfigured() || !db) {
    console.error("DATABASE_URL not configured")
    process.exit(1)
  }

  const categories = [
    "policy_violation",
    "refund_dispute",
    "payment_fraud",
    "abuse",
    "manual_hold",
    "other",
  ]

  for (const category of categories) {
    if (!isSuspensionReasonCategory(category)) {
      throw new Error(`Invalid category: ${category}`)
    }
  }

  const activeStudios = await db
    .select({ id: studios.id, status: studios.status })
    .from(studios)
    .where(eq(studios.status, "active"))
    .limit(1)

  if (activeStudios[0]) {
    const owner = await getPrimaryOwnerForStudio(activeStudios[0].id)
    console.log(
      `Primary owner lookup OK: studio=${activeStudios[0].id} owner=${owner?.email ?? "none"}`,
    )
  } else {
    console.log("No active studio found for owner lookup smoke test.")
  }

  const suspended = await listSuspendedStudios()
  const logs = await listSuspensionLogs({ limit: 5 })
  console.log(`Suspended studios: ${suspended.length}`)
  console.log(`Recent suspension logs: ${logs.data.length}`)

  const staff = await db
    .select({ email: user.email, platformRole: user.platformRole })
    .from(user)
    .where(eq(user.email, "admin@ruangtato.com"))
    .limit(1)

  if (staff[0]?.platformRole) {
    console.log(`Platform staff guard target exists: ${staff[0].email}`)
  }

  console.log("Suspend service verification passed.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
