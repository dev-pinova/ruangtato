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

    const studioPayments = await db.query.payments.findMany({
      where: eq(payments.studioId, studio.id),
    })

    const isPaid = studioPayments.some(p => 
      p.transactionStatus === "settlement" ||
      p.transactionStatus === "capture" ||
      p.transactionStatus === "success" ||
      (p.rawPayload && typeof p.rawPayload === "object" &&
        ((p.rawPayload as Record<string, any>).transaction_status === "settlement" ||
         (p.rawPayload as Record<string, any>).transaction_status === "capture")
      )
    )

    if (!isPaid) {
      redirect("/checkout?status=unpaid")
    }
  }

  return <AppLayoutClient>{children}</AppLayoutClient>
}
