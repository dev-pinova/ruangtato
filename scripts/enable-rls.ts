import pg from "pg"

/**
 * Enable RLS on all public app tables for Supabase security linter.
 * The Next.js app uses Drizzle via DATABASE_URL (postgres role) which bypasses RLS.
 * PostgREST (anon/authenticated) is denied by default when no permissive policies exist.
 */
const TABLES = [
  "roles",
  "studios",
  "studio_memberships",
  "subscriptions",
  "invoices",
  "payments",
  "audit_logs",
  "suspension_logs",
  "leads",
  '"user"',
  "session",
  "account",
  "verification",
] as const

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("DATABASE_URL is not set")
    process.exit(1)
  }

  const client = new pg.Client({ connectionString: url })
  await client.connect()

  try {
    for (const table of TABLES) {
      const sql = `ALTER TABLE IF EXISTS public.${table} ENABLE ROW LEVEL SECURITY`
      await client.query(sql)
      console.log(`RLS enabled: ${table}`)
    }

    console.log("\nDone. Supabase security warnings for public tables should clear.")
    console.log(
      "App server access via DATABASE_URL (postgres) is unaffected — it bypasses RLS.",
    )
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
