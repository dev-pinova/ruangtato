import { checkDatabaseConnection } from "../src/db"

async function main() {
  const result = await checkDatabaseConnection()

  if (!result.ok) {
    console.error("Database check failed:", result.error)
    if (result.code) {
      console.error("Error code:", result.code)
    }
    process.exit(1)
  }

  console.log("Database connection OK")
}

main()
