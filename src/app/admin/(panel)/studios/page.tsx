import { StudiosPanel } from "@/components/admin/studios-panel"
import { requirePlatformSession } from "@/lib/admin/admin-auth"

export const dynamic = "force-dynamic"

export default async function AdminStudiosPage() {
  const platformUser = await requirePlatformSession([
    "super_admin",
    "admin",
    "support",
  ])

  const isSuperAdmin = platformUser.platformRole === "super_admin"

  return (
    <StudiosPanel
      canSuspend={isSuperAdmin}
      isSuperAdmin={isSuperAdmin}
    />
  )
}
