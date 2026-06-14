import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"

/**
 * Applies pending Drizzle SQL migrations from ./drizzle to the database in
 * DATABASE_URL. Safe to run repeatedly — Drizzle tracks applied migrations in
 * the `drizzle.__drizzle_migrations` table and skips ones already run.
 *
 * Run with: npm run db:migrate
 *
 * NOTE for databases that were originally created with `drizzle-kit push`
 * (i.e. tables already exist but no migration history): see the "Baseline
 * adoption" section in README before the first run, otherwise the 0000
 * baseline will try to CREATE existing tables and fail.
 */
async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("DATABASE_URL is not set. Add it to .env before migrating.")
    process.exit(1)
  }

  const pool = new Pool({ connectionString: url, connectionTimeoutMillis: 15_000 })
  const db = drizzle(pool)

  try {
    console.log("Applying migrations from ./drizzle ...")
    await migrate(db, { migrationsFolder: "./drizzle" })
    console.log("Migrations applied successfully.")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

main()
