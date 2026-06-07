import { LayoutDashboard } from "lucide-react"

import { PageHeading, MetricCard } from "@/components/design"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminOverviewPage() {
  const platformUser = await requirePlatformSession()

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeading
        title="Overview"
        description={`Selamat datang, ${platformUser.name}. Panel operasional internal Ruang Tato.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Status Panel" value="Aktif" icon={LayoutDashboard} />
        <MetricCard
          label="Role Anda"
          value={platformUser.platformRole.replace("_", " ")}
          icon={LayoutDashboard}
        />
        <MetricCard label="Tenants" value="—" icon={LayoutDashboard} />
        <MetricCard label="Payments" value="—" icon={LayoutDashboard} />
      </div>

      <p className="text-sm text-muted-foreground">
        Fondasi admin siap. Modul tenant (Fase 2) dan payment monitoring (Fase 3) akan
        menyusul di PR terpisah.
      </p>
    </div>
  )
}
