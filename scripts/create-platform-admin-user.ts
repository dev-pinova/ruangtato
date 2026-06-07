import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { eq } from "drizzle-orm"

import { db, isDatabaseConfigured } from "../src/db"
import * as authSchema from "../src/db/auth-schema"
import { user } from "../src/db/auth-schema"

async function main() {
  if (!isDatabaseConfigured() || !db) {
    console.error("DATABASE_URL belum dikonfigurasi.")
    process.exit(1)
  }

  if (!process.env.BETTER_AUTH_SECRET) {
    console.error("BETTER_AUTH_SECRET belum diset di .env.")
    process.exit(1)
  }

  const email = (process.env.PLATFORM_ADMIN_EMAIL ?? "admin@ruangtato.com")
    .trim()
    .toLowerCase()
  const password = process.env.PLATFORM_ADMIN_PASSWORD ?? "admin123"
  const name = process.env.PLATFORM_ADMIN_NAME ?? "Admin Ruang Tato"

  const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: authSchema,
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    user: {
      additionalFields: {
        platformRole: {
          type: "string",
          required: false,
          fieldName: "platform_role",
          input: false,
        },
        status: {
          type: "string",
          required: false,
          defaultValue: "active",
          fieldName: "status",
          input: false,
        },
      },
    },
  })

  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (!existing) {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    })
    console.log(`Akun dibuat: ${email}`)
  } else {
    console.log(`Akun sudah ada: ${email}`)
  }

  await db
    .update(user)
    .set({
      platformRole: "super_admin",
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(user.email, email))

  console.log(`Platform role super_admin di-assign ke ${email}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
