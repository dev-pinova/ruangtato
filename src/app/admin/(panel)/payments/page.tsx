import { PaymentsPanel } from "@/components/admin/payments-panel"
import { requirePlatformSession } from "@/lib/admin/admin-auth"

export default async function AdminPaymentsPage() {
  await requirePlatformSession(["super_admin", "admin", "support", "finance"])

  return <PaymentsPanel />
}
