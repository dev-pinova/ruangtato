import { requirePlatformSession } from "@/lib/admin-auth"
import { AdminShell } from "@/components/admin/admin-shell"

export const dynamic = "force-dynamic"

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const platformUser = await requirePlatformSession()

  return (
    <AdminShell
      user={{
        name: platformUser.name,
        email: platformUser.email,
        platformRole: platformUser.platformRole,
      }}
    >
      {children}
    </AdminShell>
  )
}
