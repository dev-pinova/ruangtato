import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

import { db, isDatabaseConfigured } from "@/db"
import { user } from "@/db/auth-schema"
import { getServerSession } from "@/lib/auth/session"

export type PlatformRole = "super_admin" | "admin" | "support" | "finance"

export type PlatformPermission =
  | "tenants:read"
  | "payments:read"
  | "analytics:read"
  | "suspensions:read"
  | "suspensions:write"
  | "audit:read"
  | "settings:read"
  | "settings:write"

const ROLE_PERMISSIONS: Record<PlatformRole, PlatformPermission[] | ["*"]> = {
  super_admin: ["*"],
  admin: ["tenants:read", "payments:read", "analytics:read", "audit:read"],
  support: ["tenants:read", "payments:read"],
  finance: ["payments:read", "analytics:read"],
}

export type PlatformUser = {
  id: string
  name: string
  email: string
  platformRole: PlatformRole
  status: string
}

export function isPlatformRole(value: string | null | undefined): value is PlatformRole {
  return (
    value === "super_admin" ||
    value === "admin" ||
    value === "support" ||
    value === "finance"
  )
}

export function roleHasPermission(
  role: PlatformRole,
  permission: PlatformPermission,
): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  if (permissions[0] === "*") return true
  return (permissions as PlatformPermission[]).includes(permission)
}

export async function getPlatformUserById(userId: string): Promise<PlatformUser | null> {
  if (!isDatabaseConfigured() || !db) return null

  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      platformRole: user.platformRole,
      status: user.status,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  if (!row?.platformRole || !isPlatformRole(row.platformRole)) return null
  if (row.status === "suspended") return null

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    platformRole: row.platformRole,
    status: row.status,
  }
}

export async function getPlatformUserFromSession(): Promise<PlatformUser | null> {
  const session = await getServerSession()
  if (!session?.user?.id) return null
  return getPlatformUserById(session.user.id)
}

export async function requirePlatformSession(
  allowedRoles?: PlatformRole[],
): Promise<PlatformUser> {
  const platformUser = await getPlatformUserFromSession()
  if (!platformUser) {
    redirect("/unauthorized")
  }

  if (allowedRoles && !allowedRoles.includes(platformUser.platformRole)) {
    redirect("/unauthorized")
  }

  return platformUser
}

export async function requirePlatformApiPermission(
  request: Request,
  permission: PlatformPermission,
  allowedRoles?: PlatformRole[],
): Promise<PlatformUser | Response> {
  const { auth } = await import("@/lib/auth/auth")
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const platformUser = await getPlatformUserById(session.user.id)
  if (!platformUser) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  if (allowedRoles && !allowedRoles.includes(platformUser.platformRole)) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  if (!roleHasPermission(platformUser.platformRole, permission)) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  return platformUser
}

export function isPlatformApiUser(
  value: PlatformUser | Response,
): value is PlatformUser {
  return !(value instanceof Response)
}
