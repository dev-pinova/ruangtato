import { getDb } from "@/db"
import { auditLogs } from "@/db/schema"

export async function writeAuditLog(input: {
  actorUserId: string
  action: string
  targetType: string
  targetId: string
  reason?: string | null
  metadata?: Record<string, unknown>
}) {
  const d = getDb()

  await d.insert(auditLogs).values({
    actorUserId: input.actorUserId,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    reason: input.reason ?? null,
    metadata: input.metadata ?? null,
  })
}

