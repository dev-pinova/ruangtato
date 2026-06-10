import { SuspensionsPanel } from "@/components/admin/suspensions-panel"
import { requirePlatformSession } from "@/lib/admin/admin-auth"

export default async function AdminSuspensionsPage() {
  await requirePlatformSession(["super_admin"])

  return <SuspensionsPanel />
}
