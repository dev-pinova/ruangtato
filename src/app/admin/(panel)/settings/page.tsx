import { SettingsPanel } from "@/components/admin/settings-panel"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminSettingsPage() {
  await requirePlatformSession(["super_admin"])

  return <SettingsPanel />
}
