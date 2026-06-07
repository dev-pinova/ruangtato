import { TenantsPanel } from "@/components/admin/tenants-panel"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminTenantsPage() {
  const platformUser = await requirePlatformSession([
    "super_admin",
    "admin",
    "support",
  ])

  return <TenantsPanel canSuspend={platformUser.platformRole === "super_admin"} />
}
