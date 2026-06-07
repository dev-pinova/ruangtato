import { desc, eq } from "drizzle-orm"

import { db, isDatabaseConfigured } from "@/db"
import { studios, suspensionLogs } from "@/db/schema"
import { writeAuditLog } from "@/lib/audit-log"

export async function suspendStudio(input: {
  studioId: string
  actorUserId: string
  reason: string
}) {
  if (!db) throw new Error("Database not configured")

  const [studio] = await db
    .select()
    .from(studios)
    .where(eq(studios.id, input.studioId))
    .limit(1)

  if (!studio) throw new Error("Studio not found")
  if (studio.status === "suspended") throw new Error("Studio already suspended")

  const statusBefore = studio.status

  await db
    .update(studios)
    .set({ status: "suspended", updatedAt: new Date() })
    .where(eq(studios.id, input.studioId))

  await db.insert(suspensionLogs).values({
    actorUserId: input.actorUserId,
    studioId: input.studioId,
    statusBefore,
    statusAfter: "suspended",
    reason: input.reason,
  })

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: "studio.suspend",
    targetType: "studio",
    targetId: input.studioId,
    reason: input.reason,
    metadata: { slug: studio.slug, name: studio.name },
  })

  return { studioId: input.studioId, status: "suspended" as const }
}

export async function reactivateStudio(input: {
  studioId: string
  actorUserId: string
  reason: string
}) {
  if (!db) throw new Error("Database not configured")

  const [studio] = await db
    .select()
    .from(studios)
    .where(eq(studios.id, input.studioId))
    .limit(1)

  if (!studio) throw new Error("Studio not found")
  if (studio.status !== "suspended") throw new Error("Studio is not suspended")

  const statusBefore = studio.status

  await db
    .update(studios)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(studios.id, input.studioId))

  await db.insert(suspensionLogs).values({
    actorUserId: input.actorUserId,
    studioId: input.studioId,
    statusBefore,
    statusAfter: "active",
    reason: input.reason,
  })

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: "studio.reactivate",
    targetType: "studio",
    targetId: input.studioId,
    reason: input.reason,
    metadata: { slug: studio.slug, name: studio.name },
  })

  return { studioId: input.studioId, status: "active" as const }
}

export async function listSuspensionLogs(input: { page?: number; limit?: number }) {
  if (!isDatabaseConfigured() || !db) {
    return { data: [], total: 0, page: 1, limit: 20 }
  }

  const page = Math.max(1, input.page ?? 1)
  const limit = Math.min(100, Math.max(1, input.limit ?? 20))
  const offset = (page - 1) * limit

  const rows = await db
    .select({
      log: suspensionLogs,
      studioName: studios.name,
      studioSlug: studios.slug,
    })
    .from(suspensionLogs)
    .innerJoin(studios, eq(studios.id, suspensionLogs.studioId))
    .orderBy(desc(suspensionLogs.createdAt))
    .limit(limit)
    .offset(offset)

  return {
    data: rows.map((row) => ({
      id: row.log.id,
      studioId: row.log.studioId,
      studioName: row.studioName,
      studioSlug: row.studioSlug,
      actorUserId: row.log.actorUserId,
      statusBefore: row.log.statusBefore,
      statusAfter: row.log.statusAfter,
      reason: row.log.reason,
      createdAt: row.log.createdAt.toISOString(),
    })),
    page,
    limit,
  }
}

export async function listSuspendedStudios() {
  if (!isDatabaseConfigured() || !db) return []

  return db
    .select({
      id: studios.id,
      name: studios.name,
      slug: studios.slug,
      city: studios.city,
      status: studios.status,
      updatedAt: studios.updatedAt,
    })
    .from(studios)
    .where(eq(studios.status, "suspended"))
    .orderBy(desc(studios.updatedAt))
}
