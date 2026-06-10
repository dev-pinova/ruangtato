import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { listUsers } from "@/lib/admin/admin-service"

export async function GET(request: Request) {
  const authResult = await requirePlatformApiPermission(
    request,
    "settings:read",
    ["super_admin"],
  )
  if (!isPlatformApiUser(authResult)) return authResult

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page") ?? "1")
  const limit = Number(searchParams.get("limit") ?? "20")
  const q = searchParams.get("q") ?? undefined
  const status = searchParams.get("status") ?? undefined
  const platformRole = searchParams.get("platformRole") ?? undefined

  try {
    const result = await listUsers({
      page,
      limit,
      q,
      status,
      platformRole,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch users" },
      { status: 500 },
    )
  }
}
