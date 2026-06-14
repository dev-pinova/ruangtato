import { createHash } from "crypto"
import { readFileSync } from "fs"
import { join } from "path"

import pg from "pg"

/**
 * Marks all current migrations in ./drizzle as ALREADY APPLIED, without running
 * their SQL. Use this exactly once on a database that was originally created
 * with `drizzle-kit push` (tables already exist, but there is no migration
 * history). After running this, `npm run db:migrate` will skip the baseline and
 * only apply genuinely new migrations (0001+).
 *
 * Drizzle identifies an applied migration by the SHA256 hash of the migration
 * file's full text (see drizzle-orm/migrator). This script computes the same
 * hash from drizzle/meta/_journal.json so it stays correct if the SQL changes.
 *
 * Run with: npm run db:baseline
 */
type JournalEntry = { idx: number; when: number; tag: string }
type Journal = { entries: JournalEntry[] }

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("DATABASE_URL is not set.")
    process.exit(1)
  }

  const folder = "./drizzle"
  const journal = JSON.parse(
    readFileSync(join(folder, "meta", "_journal.json"), "utf8"),
  ) as Journal

  if (journal.entries.length === 0) {
    console.log("No migrations in journal — nothing to baseline.")
    return
  }

  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 15_000 })
  await client.connect()

  try {
    await client.query("CREATE SCHEMA IF NOT EXISTS drizzle")
    await client.query(`
      CREATE TABLE IF NOT EXISTS drizzle."__drizzle_migrations" (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `)

    for (const entry of journal.entries) {
      const sql = readFileSync(join(folder, `${entry.tag}.sql`), "utf8")
      const hash = createHash("sha256").update(sql).digest("hex")

      const { rows } = await client.query(
        `SELECT 1 FROM drizzle."__drizzle_migrations" WHERE hash = $1 LIMIT 1`,
        [hash],
      )
      if (rows.length > 0) {
        console.log(`Already recorded: ${entry.tag}`)
        continue
      }

      await client.query(
        `INSERT INTO drizzle."__drizzle_migrations" (hash, created_at) VALUES ($1, $2)`,
        [hash, entry.when],
      )
      console.log(`Marked as applied: ${entry.tag}`)
    }

    console.log(
      "\nDone. Existing tables were left untouched. Future `npm run db:migrate` " +
        "runs will only apply new migrations.",
    )
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
