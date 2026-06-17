import { NextResponse } from "next/server"

import { db, isDatabaseConfigured } from "@/db"
import { payments } from "@/db/schema"
import { auth } from "@/lib/auth/auth"
import { getStudioForUser } from "@/lib/studio/studio-service"
import { and, desc, eq } from "drizzle-orm"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isDatabaseConfigured() || !db) {
    return NextResponse.json({ hasPending: false })
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio) {
    return NextResponse.json({ hasPending: false })
  }

  // Ambil payment pending terbaru untuk studio ini
  const [pending] = await db
    .select({
      orderId: payments.orderId,
      transactionStatus: payments.transactionStatus,
      createdAt: payments.createdAt,
      rawPayload: payments.rawPayload,
    })
    .from(payments)
    .where(
      and(
        eq(payments.studioId, studio.id),
        eq(payments.transactionStatus, "pending"),
      ),
    )
    .orderBy(desc(payments.createdAt))
    .limit(1)

  if (!pending) {
    return NextResponse.json({ hasPending: false })
  }

  // Ekstrak planType dari rawPayload
  const raw = pending.rawPayload as { planType?: string } | null
  const planType = raw?.planType ?? null

  return NextResponse.json({
    hasPending: true,
    orderId: pending.orderId,
    planType,
    createdAt: pending.createdAt.toISOString(),
  })
}
