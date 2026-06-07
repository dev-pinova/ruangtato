import { AdminPlaceholder } from "@/components/admin/admin-placeholder"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminAuditLogPage() {
  await requirePlatformSession(["super_admin", "admin"])

  return (
    <AdminPlaceholder
      title="Audit Log"
      description="Riwayat aksi admin — diimplementasikan di Fase 4."
    />
  )
}
