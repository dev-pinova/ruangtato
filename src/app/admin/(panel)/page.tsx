import { AdminOverviewPanel } from "@/components/admin/admin-overview-panel"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminOverviewPage() {
  const platformUser = await requirePlatformSession()

  return (
    <AdminOverviewPanel
      userName={platformUser.name}
      platformRole={platformUser.platformRole}
    />
  )
}
