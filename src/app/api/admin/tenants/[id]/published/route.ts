import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { getDb } from "@/db"
import { studios } from "@/db/schema"
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
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const isPublished = (body as { isPublished?: unknown }).isPublished
  if (typeof isPublished !== "boolean") {
    return NextResponse.json(
      { error: "isPublished harus boolean." },
      { status: 400 },
    )
  }

  const db = getDb()

  try {
    const [studio] = await db
      .select({
        id: studios.id,
        slug: studios.slug,
        name: studios.name,
        isPublished: studios.isPublished,
      })
      .from(studios)
      .where(eq(studios.id, id))
      .limit(1)

    if (!studio) {
      return NextResponse.json({ error: "Studio tidak ditemukan." }, { status: 404 })
    }

    await db
      .update(studios)
      .set({
        isPublished,
        updatedAt: new Date(),
      })
      .where(eq(studios.id, id))

    await writeAuditLog({
      actorUserId: authResult.id,
      action: isPublished ? "studio.publish_on" : "studio.publish_off",
      targetType: "studio",
      targetId: studio.id,
      metadata: {
        slug: studio.slug,
        previous: studio.isPublished,
        isPublished,
      },
    })

    return NextResponse.json({ data: { id: studio.id, name: studio.name, isPublished } })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 },
    )
  }
}
