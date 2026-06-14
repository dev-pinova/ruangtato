import { NextResponse } from "next/server"

import type { PlatformRole } from "@/lib/admin/admin-auth"
import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import {
  assignPlatformRole,
  listPlatformStaff,
  revokePlatformRole,
} from "@/lib/admin/admin-staff-service"
import { parseJsonBody, z } from "@/lib/validation"

const PLATFORM_ROLES = ["super_admin", "admin", "support", "finance"] as const

// platformRole === null revokes the role; a valid role assigns it.
const StaffSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi.").max(254),
  platformRole: z.union([z.enum(PLATFORM_ROLES), z.null()]).optional(),
})

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

  const parsed = await parseJsonBody(request, StaffSchema)
  if (!parsed.ok) return parsed.response
  const { email, platformRole } = parsed.data

  try {
    if (platformRole === null || platformRole === undefined) {
      await revokePlatformRole({
        email,
        actorUserId: authResult.id,
      })
      return NextResponse.json({ data: { revoked: true } })
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
