import { AdminPlaceholder } from "@/components/admin/admin-placeholder"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminSuspensionsPage() {
  await requirePlatformSession(["super_admin"])

  return (
    <AdminPlaceholder
      title="Suspensions"
      description="Suspend dan reactivate tenant — diimplementasikan di Fase 4."
    />
  )
}
