import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { getDb } from "@/db"
import { studios } from "@/db/schema"
import { eq } from "drizzle-orm"
import { writeAuditLog } from "@/lib/admin/audit-log"
import { parseJsonBody, z } from "@/lib/validation"

const PublishedSchema = z.object({
  isPublished: z.boolean({ message: "isPublished harus boolean." }),
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
  const parsed = await parseJsonBody(request, PublishedSchema)
  if (!parsed.ok) return parsed.response
  const { isPublished } = parsed.data

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

    // Visibility changed — refresh the statically cached homepage + studio page.
    revalidatePath("/")
    if (studio.slug) {
      revalidatePath(`/app/studio/${studio.slug}`)
    }

    return NextResponse.json({ data: { id: studio.id, name: studio.name, isPublished } })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 },
    )
  }
}
