import { and, count, desc, eq, gte, lte } from "drizzle-orm"
import { NextResponse } from "next/server"

import { db, isDatabaseConfigured } from "@/db"
import { auditLogs } from "@/db/schema"
import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"

export async function GET(request: Request) {
  const authResult = await requirePlatformApiPermission(request, "audit:read")
  if (!isPlatformApiUser(authResult)) return authResult

  if (!isDatabaseConfigured() || !db) {
    return NextResponse.json({ data: [], total: 0, page: 1, limit: 20 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")))
  const offset = (page - 1) * limit
  const action = searchParams.get("action")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const conditions = []
  if (action) conditions.push(eq(auditLogs.action, action))
  if (from) conditions.push(gte(auditLogs.createdAt, new Date(from)))
  if (to) {
    const end = new Date(to)
    end.setHours(23, 59, 59, 999)
    conditions.push(lte(auditLogs.createdAt, end))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const rows = await db
    .select()
    .from(auditLogs)
    .where(whereClause)
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit)
    .offset(offset)

  const [totalRow] = await db
    .select({ total: count() })
    .from(auditLogs)
    .where(whereClause)

  return NextResponse.json({
    data: rows.map((row) => ({
      id: row.id,
      actorUserId: row.actorUserId,
      action: row.action,
      targetType: row.targetType,
      targetId: row.targetId,
      reason: row.reason,
      metadata: row.metadata,
      createdAt: row.createdAt.toISOString(),
    })),
    total: Number(totalRow?.total ?? 0),
    page,
    limit,
  })
}
