import { desc, eq, ilike, isNotNull, or } from "drizzle-orm"

import { db, isDatabaseConfigured } from "@/db"
import { user } from "@/db/auth-schema"
import { studios } from "@/db/schema"
import type { PlatformRole } from "@/lib/admin-auth"
import { isPlatformRole } from "@/lib/admin-auth"
import { writeAuditLog } from "@/lib/audit-log"

export type AdminStaffRow = {
  id: string
  name: string
  email: string
  platformRole: PlatformRole
  status: string
  createdAt: string
}

export async function listPlatformStaff(): Promise<AdminStaffRow[]> {
  if (!isDatabaseConfigured() || !db) return []

  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      platformRole: user.platformRole,
      status: user.status,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(isNotNull(user.platformRole))
    .orderBy(desc(user.createdAt))

  return rows
    .filter((row) => row.platformRole && isPlatformRole(row.platformRole))
    .map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      platformRole: row.platformRole as PlatformRole,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    }))
}

export async function assignPlatformRole(input: {
  email: string
  platformRole: PlatformRole
  actorUserId: string
}): Promise<AdminStaffRow> {
  if (!isDatabaseConfigured() || !db) {
    throw new Error("Database not configured")
  }

  const email = input.email.trim().toLowerCase()
  const [existing] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      platformRole: user.platformRole,
      status: user.status,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (!existing) {
    throw new Error("User tidak ditemukan. Pastikan akun sudah terdaftar.")
  }

  const previousRole = existing.platformRole

  await db
    .update(user)
    .set({
      platformRole: input.platformRole,
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(user.id, existing.id))

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: "staff.role_assign",
    targetType: "user",
    targetId: existing.id,
    metadata: {
      email,
      previousRole,
      newRole: input.platformRole,
    },
  })

  return {
    id: existing.id,
    name: existing.name,
    email: existing.email,
    platformRole: input.platformRole,
    status: "active",
    createdAt: existing.createdAt.toISOString(),
  }
}

export async function revokePlatformRole(input: {
  email: string
  actorUserId: string
}): Promise<void> {
  if (!isDatabaseConfigured() || !db) {
    throw new Error("Database not configured")
  }

  const email = input.email.trim().toLowerCase()
  const [existing] = await db
    .select({
      id: user.id,
      platformRole: user.platformRole,
    })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (!existing?.platformRole) {
    throw new Error("User tidak memiliki platform role.")
  }

  if (existing.id === input.actorUserId) {
    throw new Error("Tidak dapat mencabut role sendiri.")
  }

  await db
    .update(user)
    .set({
      platformRole: null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, existing.id))

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: "staff.role_revoke",
    targetType: "user",
    targetId: existing.id,
    metadata: {
      email,
      previousRole: existing.platformRole,
    },
  })
}

export async function setStudioTrusted(input: {
  studioId: string
  isTrusted: boolean
  actorUserId: string
}): Promise<{ id: string; slug: string; name: string; isTrusted: boolean }> {
  if (!isDatabaseConfigured() || !db) {
    throw new Error("Database not configured")
  }

  const [studio] = await db
    .select({
      id: studios.id,
      slug: studios.slug,
      name: studios.name,
      isTrusted: studios.isTrusted,
    })
    .from(studios)
    .where(eq(studios.id, input.studioId))
    .limit(1)

  if (!studio) {
    throw new Error("Studio tidak ditemukan.")
  }

  await db
    .update(studios)
    .set({
      isTrusted: input.isTrusted,
      updatedAt: new Date(),
    })
    .where(eq(studios.id, input.studioId))

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: input.isTrusted ? "studio.trusted_on" : "studio.trusted_off",
    targetType: "studio",
    targetId: studio.id,
    metadata: {
      slug: studio.slug,
      previous: studio.isTrusted,
      isTrusted: input.isTrusted,
    },
  })

  return {
    id: studio.id,
    slug: studio.slug,
    name: studio.name,
    isTrusted: input.isTrusted,
  }
}

export async function searchStudiosForTrusted(q: string) {
  if (!isDatabaseConfigured() || !db || !q.trim()) return []

  const pattern = `%${q.trim()}%`
  return db
    .select({
      id: studios.id,
      slug: studios.slug,
      name: studios.name,
      isTrusted: studios.isTrusted,
    })
    .from(studios)
    .where(or(ilike(studios.name, pattern), ilike(studios.slug, pattern)))
    .orderBy(desc(studios.updatedAt))
    .limit(20)
}
