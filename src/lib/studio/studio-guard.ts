import { eq } from "drizzle-orm"

import { db, isDatabaseConfigured } from "@/db"
import { user } from "@/db/auth-schema"
import { studios } from "@/db/schema"

export class StudioSuspendedError extends Error {
  constructor(message = "Studio account is suspended") {
    super(message)
    this.name = "StudioSuspendedError"
  }
}

export class UserSuspendedError extends Error {
  constructor(message = "User account is suspended") {
    super(message)
    this.name = "UserSuspendedError"
  }
}

export async function getStudioStatus(studioId: string): Promise<string | null> {
  if (!isDatabaseConfigured() || !db) return null
  const [row] = await db
    .select({ status: studios.status })
    .from(studios)
    .where(eq(studios.id, studioId))
    .limit(1)
  return row?.status ?? null
}

export async function getUserStatus(userId: string): Promise<string | null> {
  if (!isDatabaseConfigured() || !db) return null
  const [row] = await db
    .select({ status: user.status })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)
  return row?.status ?? null
}

export async function assertUserNotSuspended(userId: string) {
  const status = await getUserStatus(userId)
  if (status === "suspended") {
    throw new UserSuspendedError()
  }
}

export async function assertStudioNotSuspended(studioId: string) {
  const status = await getStudioStatus(studioId)
  if (status === "suspended") {
    throw new StudioSuspendedError()
  }
}

export async function assertStudioNotSuspendedBySlug(slug: string) {
  if (!isDatabaseConfigured() || !db) return
  const [row] = await db
    .select({ status: studios.status })
    .from(studios)
    .where(eq(studios.slug, slug))
    .limit(1)
  if (row?.status === "suspended") {
    throw new StudioSuspendedError()
  }
}

export function studioGuardErrorResponse(error: unknown) {
  if (error instanceof StudioSuspendedError || error instanceof UserSuspendedError) {
    return Response.json({ error: error.message, suspended: true }, { status: 403 })
  }
  return null
}
