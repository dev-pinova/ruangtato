import { eq } from "drizzle-orm"

import { db, isDatabaseConfigured } from "../src/db"
import { user } from "../src/db/auth-schema"

async function main() {
  if (!isDatabaseConfigured() || !db) {
    console.error("DATABASE_URL belum dikonfigurasi.")
    process.exit(1)
  }

  const email = process.env.PLATFORM_ADMIN_EMAIL?.trim().toLowerCase()
  if (!email) {
    console.error(
      "Set PLATFORM_ADMIN_EMAIL di environment, contoh:\n" +
        "  PLATFORM_ADMIN_EMAIL=admin@ruangtato.com npm run admin:seed",
    )
    process.exit(1)
  }

  const [existing] = await db
    .select({ id: user.id, platformRole: user.platformRole })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (!existing) {
    console.error(`User dengan email ${email} tidak ditemukan. Buat akun dulu via register/login.`)
    process.exit(1)
  }

  await db
    .update(user)
    .set({
      platformRole: "super_admin",
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(user.id, existing.id))

  console.log(`Platform role super_admin di-assign ke ${email}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
