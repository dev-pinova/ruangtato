import { and, desc, eq } from "drizzle-orm"

import { db, isDatabaseConfigured } from "@/db"
import { session, user } from "@/db/auth-schema"
import { studioMemberships, studios, suspensionLogs } from "@/db/schema"
import { writeAuditLog } from "@/lib/audit-log"
import type { SuspensionReasonCategory } from "@/lib/suspension-types"

export async function getPrimaryOwnerForStudio(studioId: string) {
  if (!db) return null

  const [row] = await db
    .select({
      userId: studioMemberships.userId,
      email: user.email,
      name: user.name,
      status: user.status,
      platformRole: user.platformRole,
    })
    .from(studioMemberships)
    .innerJoin(user, eq(user.id, studioMemberships.userId))
    .where(
      and(
        eq(studioMemberships.studioId, studioId),
        eq(studioMemberships.isPrimaryOwner, true),
      ),
    )
    .limit(1)

  return row ?? null
}

async function revokeUserSessions(userId: string) {
  if (!db) return
  await db.delete(session).where(eq(session.userId, userId))
}

export async function suspendStudio(input: {
  studioId: string
  actorUserId: string
  reason: string
  reasonCategory: SuspensionReasonCategory
}) {
  if (!db) throw new Error("Database not configured")

  const [studio] = await db
    .select()
    .from(studios)
    .where(eq(studios.id, input.studioId))
    .limit(1)

  if (!studio) throw new Error("Studio not found")
  if (studio.status === "suspended") throw new Error("Studio already suspended")

  const owner = await getPrimaryOwnerForStudio(input.studioId)
  if (!owner) throw new Error("Primary owner tidak ditemukan untuk studio ini.")
  if (owner.platformRole) {
    throw new Error("Tidak dapat men-suspend akun staff platform.")
  }

  const statusBefore = studio.status

  await db
    .update(studios)
    .set({ status: "suspended", updatedAt: new Date() })
    .where(eq(studios.id, input.studioId))

  await db
    .update(user)
    .set({ status: "suspended", updatedAt: new Date() })
    .where(eq(user.id, owner.userId))

  await revokeUserSessions(owner.userId)

  await db.insert(suspensionLogs).values({
    actorUserId: input.actorUserId,
    studioId: input.studioId,
    statusBefore,
    statusAfter: "suspended",
    reasonCategory: input.reasonCategory,
    reason: input.reason,
  })

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: "studio.suspend",
    targetType: "studio",
    targetId: input.studioId,
    reason: input.reason,
    metadata: {
      slug: studio.slug,
      name: studio.name,
      reasonCategory: input.reasonCategory,
      ownerUserId: owner.userId,
      ownerEmail: owner.email,
    },
  })

  return {
    studioId: input.studioId,
    status: "suspended" as const,
    ownerUserId: owner.userId,
    ownerEmail: owner.email,
  }
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

  const owner = await getPrimaryOwnerForStudio(input.studioId)
  if (!owner) throw new Error("Primary owner tidak ditemukan untuk studio ini.")

  const statusBefore = studio.status

  await db
    .update(studios)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(studios.id, input.studioId))

  await db
    .update(user)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(user.id, owner.userId))

  await db.insert(suspensionLogs).values({
    actorUserId: input.actorUserId,
    studioId: input.studioId,
    statusBefore,
    statusAfter: "active",
    reasonCategory: null,
    reason: input.reason,
  })

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: "studio.reactivate",
    targetType: "studio",
    targetId: input.studioId,
    reason: input.reason,
    metadata: {
      slug: studio.slug,
      name: studio.name,
      ownerUserId: owner.userId,
      ownerEmail: owner.email,
    },
  })

  return {
    studioId: input.studioId,
    status: "active" as const,
    ownerUserId: owner.userId,
    ownerEmail: owner.email,
  }
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
      reasonCategory: row.log.reasonCategory,
      reason: row.log.reason,
      createdAt: row.log.createdAt.toISOString(),
    })),
    page,
    limit,
  }
}

export async function listSuspendedStudios() {
  if (!isDatabaseConfigured() || !db) return []

  const rows = await db
    .select({
      id: studios.id,
      name: studios.name,
      slug: studios.slug,
      city: studios.city,
      status: studios.status,
      updatedAt: studios.updatedAt,
      ownerEmail: user.email,
      ownerName: user.name,
    })
    .from(studios)
    .leftJoin(
      studioMemberships,
      and(
        eq(studioMemberships.studioId, studios.id),
        eq(studioMemberships.isPrimaryOwner, true),
      ),
    )
    .leftJoin(user, eq(user.id, studioMemberships.userId))
    .where(eq(studios.status, "suspended"))
    .orderBy(desc(studios.updatedAt))

  return rows
}
