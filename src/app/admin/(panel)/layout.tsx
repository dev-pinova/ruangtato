import { requirePlatformSession } from "@/lib/admin-auth"
import { AdminShell } from "@/components/admin/admin-shell"
import "@/app/admin/admin-ops.css"

export const dynamic = "force-dynamic"

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const platformUser = await requirePlatformSession()

  return (
    <div className="dark admin-ops min-h-dvh">
      <AdminShell
        user={{
          name: platformUser.name,
          email: platformUser.email,
          platformRole: platformUser.platformRole,
        }}
      >
        {children}
      </AdminShell>
    </div>
  )
}
