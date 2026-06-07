import { AdminPlaceholder } from "@/components/admin/admin-placeholder"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminAnalyticsPage() {
  await requirePlatformSession(["super_admin", "admin", "finance"])

  return (
    <AdminPlaceholder
      title="Analytics"
      description="KPI dan grafik platform — diimplementasikan di Fase 5."
    />
  )
}
