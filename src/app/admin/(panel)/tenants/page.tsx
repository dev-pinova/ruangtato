import { TenantsPanel } from "@/components/admin/tenants-panel"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminTenantsPage() {
  await requirePlatformSession(["super_admin", "admin", "support"])

  return <TenantsPanel />
}
