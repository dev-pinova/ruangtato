import { UsersPanel } from "@/components/admin/users-panel"
import { requirePlatformSession } from "@/lib/admin/admin-auth"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const platformUser = await requirePlatformSession(["super_admin"])

  return <UsersPanel currentUserId={platformUser.id} />
}
