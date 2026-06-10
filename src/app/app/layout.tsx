import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { desc, eq } from "drizzle-orm"

import { db } from "@/db"
import { payments } from "@/db/schema"
import { getServerSession } from "@/lib/auth/session"
import { getStudioForUser } from "@/lib/studio/studio-service"
import AppLayoutClient from "./app-layout-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  if (!session) {
    redirect("/login")
  }

  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  const isPublicPath = pathname.startsWith("/app/studio/")

  if (!isPublicPath && db) {
    const studio = await getStudioForUser(session.user.id)
    if (!studio) {
      redirect("/register")
    }

    const latestPayment = await db.query.payments.findFirst({
      where: eq(payments.studioId, studio.id),
      orderBy: [desc(payments.createdAt)],
    })
    const isPaid = latestPayment && (
      latestPayment.transactionStatus === "settlement" ||
      latestPayment.transactionStatus === "capture" ||
      latestPayment.transactionStatus === "success" ||
      (latestPayment.rawPayload && typeof latestPayment.rawPayload === "object" &&
        ((latestPayment.rawPayload as Record<string, any>).transaction_status === "settlement" ||
         (latestPayment.rawPayload as Record<string, any>).transaction_status === "capture")
      )
    )

    if (!isPaid) {
      redirect("/checkout?status=unpaid")
    }
  }

  return <AppLayoutClient>{children}</AppLayoutClient>
}
