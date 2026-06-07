import { PageHeading } from "@/components/design"
import { AnalyticsPanel } from "@/components/admin/analytics-panel"
import { requirePlatformSession } from "@/lib/admin-auth"

export default async function AdminOverviewPage() {
  const platformUser = await requirePlatformSession()

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeading
        title="Overview"
        description={`Selamat datang, ${platformUser.name} (${platformUser.platformRole.replace("_", " ")}).`}
      />
      <AnalyticsPanel compact />
    </div>
  )
}
