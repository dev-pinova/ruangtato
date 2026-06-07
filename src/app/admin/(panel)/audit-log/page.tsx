import { AuditLogPanel } from "@/components/admin/audit-log-panel"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminAuditLogPage() {
  await requirePlatformSession(["super_admin", "admin"])

  return <AuditLogPanel />
}
