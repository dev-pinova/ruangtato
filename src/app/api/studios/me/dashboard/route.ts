import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import {
  getLeadsForStudio,
  getStudioDashboardStats,
  getStudioForUser,
  getStudioSuspendedFlagForUser,
  getSubscriptionForStudio,
} from "@/lib/studio/studio-service"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (await getStudioSuspendedFlagForUser(session.user.id)) {
    return NextResponse.json({ error: "Account suspended", suspended: true }, { status: 403 })
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  const [subscription, stats, leadRows] = await Promise.all([
    getSubscriptionForStudio(studio.id),
    getStudioDashboardStats(studio.id),
    getLeadsForStudio(studio.id),
  ])

  return NextResponse.json({
    studio: {
      id: studio.id,
      name: studio.name,
      slug: studio.slug,
    },
    subscription: subscription
      ? {
          planType: subscription.planType,
          status: subscription.status,
          expiresAt: subscription.expiresAt?.toISOString() ?? null,
        }
      : null,
    stats,
    leads: leadRows.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      message: lead.message,
      status: lead.status,
      createdAt: lead.createdAt.toISOString(),
    })),
  })
}
