import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  isPlatformRole,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { getDb } from "@/db"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { writeAuditLog } from "@/lib/admin/audit-log"

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

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const platformRole = (body as { platformRole?: unknown }).platformRole
  
  // Validate platformRole
  let finalRole: string | null = null
  if (platformRole !== null && platformRole !== "") {
    if (typeof platformRole !== "string" || !isPlatformRole(platformRole)) {
      return NextResponse.json(
        { error: "Role tidak valid. Gunakan super_admin, admin, support, atau finance." },
        { status: 400 },
      )
    }
    finalRole = platformRole
  }

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
