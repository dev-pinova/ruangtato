import { NextResponse } from "next/server"

import type { PlatformRole } from "@/lib/admin/admin-auth"
import {
  isPlatformApiUser,
  isPlatformRole,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import {
  assignPlatformRole,
  listPlatformStaff,
  revokePlatformRole,
} from "@/lib/admin/admin-staff-service"

export async function GET(request: Request) {
  const authResult = await requirePlatformApiPermission(
    request,
    "settings:read",
    ["super_admin"],
  )
  if (!isPlatformApiUser(authResult)) return authResult

  const data = await listPlatformStaff()
  return NextResponse.json({ data })
}

export async function PATCH(request: Request) {
  const authResult = await requirePlatformApiPermission(
    request,
    "settings:write",
    ["super_admin"],
  )
  if (!isPlatformApiUser(authResult)) return authResult

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const email = (body as { email?: unknown }).email
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 })
  }

  const platformRole = (body as { platformRole?: unknown }).platformRole

  try {
    if (platformRole === null) {
      await revokePlatformRole({
        email,
        actorUserId: authResult.id,
      })
      return NextResponse.json({ data: { revoked: true } })
    }

    if (typeof platformRole !== "string" || !isPlatformRole(platformRole)) {
      return NextResponse.json(
        { error: "Role tidak valid. Gunakan super_admin, admin, support, atau finance." },
        { status: 400 },
      )
    }

    const data = await assignPlatformRole({
      email,
      platformRole: platformRole as PlatformRole,
      actorUserId: authResult.id,
    })
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 },
    )
  }
}
