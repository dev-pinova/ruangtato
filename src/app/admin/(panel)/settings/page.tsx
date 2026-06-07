import { AdminPlaceholder } from "@/components/admin/admin-placeholder"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminSettingsPage() {
  await requirePlatformSession(["super_admin"])

  return (
    <AdminPlaceholder
      title="Settings"
      description="Pengaturan panel admin — diimplementasikan di Fase 6."
    />
  )
}
