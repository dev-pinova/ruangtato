import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { getDb } from "@/db"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { writeAuditLog } from "@/lib/admin/audit-log"
import { parseJsonBody, z } from "@/lib/validation"

const PLATFORM_ROLES = ["super_admin", "admin", "support", "finance"] as const

// platformRole may be a valid role, or null / "" to revoke the role.
const RoleSchema = z.object({
  platformRole: z
    .union([z.enum(PLATFORM_ROLES), z.null(), z.literal("")])
    .optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requirePlatformApiPermission(
    request,
    "settings:write",
    ["super_admin"],
  )
  if (!isPlatformApiUser(authResult)) return authResult

  const { id } = await params
  
  // Prevent changing own role (to prevent accidental lockout)
  if (id === authResult.id) {
    return NextResponse.json(
      { error: "Anda tidak dapat mengubah hak akses Anda sendiri." },
      { status: 400 },
    )
  }

  const parsed = await parseJsonBody(request, RoleSchema)
  if (!parsed.ok) return parsed.response

  const platformRole = parsed.data.platformRole
  const finalRole: string | null =
    platformRole === null || platformRole === undefined || platformRole === ""
      ? null
      : platformRole

  const db = getDb()

  try {
    const [existing] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        platformRole: user.platformRole,
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1)

    if (!existing) {
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 })
    }

    // Update role
    await db
      .update(user)
      .set({
        platformRole: finalRole,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))

    await writeAuditLog({
      actorUserId: authResult.id,
      action: finalRole ? "staff.role_assign" : "staff.role_revoke",
      targetType: "user",
      targetId: existing.id,
      metadata: {
        email: existing.email,
        previousRole: existing.platformRole,
        newRole: finalRole,
      },
    })

    return NextResponse.json({
      data: {
        id: existing.id,
        name: existing.name,
        platformRole: finalRole,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user role" },
      { status: 400 },
    )
  }
}
