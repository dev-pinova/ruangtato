import { AnalyticsPanel } from "@/components/admin/analytics-panel"
import { requirePlatformSession } from "@/lib/admin/admin-auth"

export default async function AdminAnalyticsPage() {
  await requirePlatformSession(["super_admin", "admin", "finance"])

  return (
    <div className="mx-auto max-w-7xl">
      <AnalyticsPanel />
    </div>
  )
}
