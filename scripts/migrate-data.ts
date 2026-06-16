import pg from "pg"

const oldDbUrl = process.argv[2] || ""
if (!oldDbUrl) {
  console.error("Error: Please provide the old database URL.")
  console.error("Usage: npx tsx scripts/migrate-data.ts <OLD_DATABASE_URL>")
  process.exit(1)
}

const newDbUrl = process.env.DATABASE_URL || ""
if (!newDbUrl) {
  console.error("Error: DATABASE_URL is not set in environment.")
  process.exit(1)
}

const TABLES = [
  '"user"',
  "roles",
  "studios",
  "studio_memberships",
  "subscriptions",
  "invoices",
  "payments",
  "leads",
  "account",
  "session",
  "verification"
]

async function migrateTable(oldClient: pg.Client, newClient: pg.Client, tableName: string) {
  console.log(`Migrating table: ${tableName}...`)
  
  // 1. Fetch all rows from old database
  const { rows } = await oldClient.query(`SELECT * FROM public.${tableName}`)
  if (rows.length === 0) {
    console.log(`Table ${tableName} is empty in the old database. Skipped.`)
    return
  }
  
  console.log(`Found ${rows.length} rows in ${tableName}. Inserting into new database...`)
  
  let successCount = 0
  let skipCount = 0
  
  for (const row of rows) {
    const columns = Object.keys(row)
    const values = Object.values(row)
    
    // Generate parameterized insert query:
    // INSERT INTO table (col1, col2) VALUES ($1, $2) ON CONFLICT DO NOTHING
    const colNames = columns.map(c => `"${c}"`).join(", ")
    const valuePlaceholders = columns.map((_, idx) => `$${idx + 1}`).join(", ")
    
    const query = `
      INSERT INTO public.${tableName} (${colNames}) 
      VALUES (${valuePlaceholders}) 
      ON CONFLICT DO NOTHING
    `
    
    try {
      const res = await newClient.query(query, values)
      if (res.rowCount && res.rowCount > 0) {
        successCount++
      } else {
        skipCount++
      }
    } catch (err: any) {
      console.error(`Failed to insert row in ${tableName}:`, err.message || err)
    }
  }
  
  console.log(`Finished ${tableName}: ${successCount} inserted, ${skipCount} skipped (already existed).`)
}

async function main() {
  console.log("Starting data migration...")
  console.log(`Old DB: ${oldDbUrl.replace(/:[^:@\n]+@/, ":****@")}`) // Hide password in logs
  console.log(`New DB: ${newDbUrl.replace(/:[^:@\n]+@/, ":****@")}`)
  
  const oldClient = new pg.Client({
    connectionString: oldDbUrl,
    ssl: { rejectUnauthorized: false }
  })
  const newClient = new pg.Client({
    connectionString: newDbUrl,
    ssl: !newDbUrl.includes("localhost") && !newDbUrl.includes("127.0.0.1") && !newDbUrl.includes("l609nx6j7iy0xp1zbrj1c9t9")
      ? { rejectUnauthorized: false }
      : undefined
  })
  
  try {
    await oldClient.connect()
    console.log("Connected to old database successfully.")
  } catch (err: any) {
    console.error("Failed to connect to old database:", err.message || err)
    process.exit(1)
  }

  try {
    await newClient.connect()
    console.log("Connected to new database successfully.")
  } catch (err: any) {
    console.error("Failed to connect to new database:", err.message || err)
    await oldClient.end()
    process.exit(1)
  }
  
  try {
    // Disable triggers temporarily if needed, but since we are inserting in order
    // and using ON CONFLICT DO NOTHING, standard constraints should pass.
    for (const table of TABLES) {
      await migrateTable(oldClient, newClient, table)
    }
    console.log("\nMigration completed successfully!")
  } catch (err: any) {
    console.error("\nMigration failed during execution:", err.message || err)
  } finally {
    await oldClient.end()
    await newClient.end()
  }
}

main().catch(console.error)
