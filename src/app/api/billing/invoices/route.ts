import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { getStudioForUser, listInvoicesForStudio } from "@/lib/studio/studio-service"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  const rows = await listInvoicesForStudio(studio.id)

  return NextResponse.json({
    invoices: rows.map((row) => ({
      id: row.id,
      studioId: row.studioId,
      midtransOrderId: row.midtransOrderId,
      planType: row.planType,
      amount: row.amount,
      status: row.status,
      paidAt: row.paidAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    })),
  })
}
