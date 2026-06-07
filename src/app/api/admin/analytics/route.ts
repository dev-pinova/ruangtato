import { NextResponse } from "next/server"

import { getPlatformAnalytics } from "@/lib/admin-analytics-service"
import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin-auth"

export async function GET(request: Request) {
  const authResult = await requirePlatformApiPermission(request, "analytics:read")
  if (!isPlatformApiUser(authResult)) return authResult

  const data = await getPlatformAnalytics()
  return NextResponse.json({ data })
}
