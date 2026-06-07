import { backfillPaymentsFromInvoices } from "../src/lib/payment-service"

async function main() {
  const result = await backfillPaymentsFromInvoices()
  console.log(`Backfill selesai: ${result.processed} invoice diproses.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
