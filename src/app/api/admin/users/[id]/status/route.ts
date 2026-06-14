import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { getDb } from "@/db"
import { user, session } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { writeAuditLog } from "@/lib/admin/audit-log"
import { parseJsonBody, z } from "@/lib/validation"

const StatusSchema = z.object({
  status: z.enum(["active", "suspended"], {
    message: "Status harus 'active' atau 'suspended'.",
  }),
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
  
  // Prevent self-suspension
  if (id === authResult.id) {
    return NextResponse.json(
      { error: "Anda tidak dapat menonaktifkan akun Anda sendiri." },
      { status: 400 },
    )
  }

  const parsed = await parseJsonBody(request, StatusSchema)
  if (!parsed.ok) return parsed.response
  const statusVal = parsed.data.status

  const db = getDb()

  try {
    const [existing] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        platformRole: user.platformRole,
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1)

    if (!existing) {
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 })
    }

    // Update status in user table
    await db
      .update(user)
      .set({
        status: statusVal,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))

    // Revoke sessions immediately if suspended
    if (statusVal === "suspended") {
      await db.delete(session).where(eq(session.userId, id))
    }

    await writeAuditLog({
      actorUserId: authResult.id,
      action: statusVal === "suspended" ? "user.suspend" : "user.reactivate",
      targetType: "user",
      targetId: existing.id,
      metadata: {
        email: existing.email,
        previousStatus: existing.status,
        newStatus: statusVal,
      },
    })

    return NextResponse.json({
      data: {
        id: existing.id,
        name: existing.name,
        status: statusVal,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user status" },
      { status: 400 },
    )
  }
}
