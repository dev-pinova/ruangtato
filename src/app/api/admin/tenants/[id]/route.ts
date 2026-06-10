import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { getTenantById } from "@/lib/admin/admin-service"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requirePlatformApiPermission(request, "tenants:read")
  if (!isPlatformApiUser(authResult)) return authResult

  const { id } = await params
  const tenant = await getTenantById(id)

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
  }

  return NextResponse.json({ data: tenant })
}
