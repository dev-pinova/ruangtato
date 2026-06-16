import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { db } from "@/db"
import { payments, subscriptions, invoices } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getStudioForUser } from "@/lib/studio/studio-service"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  if (!db) {
    return NextResponse.json({ error: "Database not connected" }, { status: 500 })
  }

  const studioPayments = await db.select().from(payments).where(eq(payments.studioId, studio.id))
  const studioSubs = await db.select().from(subscriptions).where(eq(subscriptions.studioId, studio.id))
  const studioInvoices = await db.select().from(invoices).where(eq(invoices.studioId, studio.id))

  return NextResponse.json({
    studio,
    payments: studioPayments,
    subscriptions: studioSubs,
    invoices: studioInvoices,
    env: {
      hasServerKey: !!process.env.MIDTRANS_SERVER_KEY,
      hasClientKey: !!process.env.MIDTRANS_CLIENT_KEY,
      isProduction: process.env.MIDTRANS_IS_PRODUCTION,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    }
  })
}
