import { NextResponse } from "next/server"

import { listSuspendedStudios, listSuspensionLogs } from "@/lib/admin-suspend-service"
import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin-auth"

export async function GET(request: Request) {
  const authResult = await requirePlatformApiPermission(
    request,
    "suspensions:read",
    ["super_admin"],
  )
  if (!isPlatformApiUser(authResult)) return authResult

  const { searchParams } = new URL(request.url)
  const logs = await listSuspensionLogs({
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "20"),
  })
  const suspended = await listSuspendedStudios()

  return NextResponse.json({
    data: {
      suspended: suspended.map((studio) => ({
        ...studio,
        updatedAt: studio.updatedAt.toISOString(),
      })),
      logs: logs.data,
    },
    page: logs.page,
    limit: logs.limit,
  })
}
