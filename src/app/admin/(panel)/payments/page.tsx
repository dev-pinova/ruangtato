import { AdminPlaceholder } from "@/components/admin/admin-placeholder"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminPaymentsPage() {
  await requirePlatformSession(["super_admin", "admin", "support", "finance"])

  return (
    <AdminPlaceholder
      title="Payments"
      description="Monitoring transaksi Midtrans — diimplementasikan di Fase 3."
    />
  )
}
