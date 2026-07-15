import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import {
  isDuitkuConfigured,
  createDuitkuInvoice,
  PLAN_CATALOG,
} from "@/lib/billing/duitku"
import { recordPendingPayment } from "@/lib/billing/payment-service"
import { getStudioForUser, getStudioSuspendedFlagForUser } from "@/lib/studio/studio-service"
import { parseJsonBody, z } from "@/lib/validation"

const CreateOrderSchema = z.object({
  planType: z.enum(["1month", "3months", "6months", "12months"]).default("1month"),
})

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isDuitkuConfigured()) {
    return NextResponse.json(
      { error: "Duitku belum dikonfigurasi. Set DUITKU_MERCHANT_CODE dan DUITKU_API_KEY." },
      { status: 503 }
    )
  }

  if (await getStudioSuspendedFlagForUser(session.user.id)) {
    return NextResponse.json({ error: "Account suspended", suspended: true }, { status: 403 })
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  const parsed = await parseJsonBody(request, CreateOrderSchema)
  if (!parsed.ok) return parsed.response
  const planType = parsed.data.planType
  const plan = PLAN_CATALOG[planType]

  if (!plan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  const orderId = `RT-${studio.id.slice(0, 8)}-${Date.now()}`

  try {
    const transaction = await createDuitkuInvoice({
      paymentAmount: plan.amount,
      merchantOrderId: orderId,
      productDetails: `Paket Langganan ${planType}`,
      email: session.user.email ?? "",
      additionalParam: JSON.stringify({ studioId: studio.id, planType }),
    })

    const paymentUrl = transaction.paymentUrl

    if (!paymentUrl) {
      return NextResponse.json(
        { error: "Gagal membuat invoice dari Duitku. Status: " + (transaction.statusMessage ?? "Unknown") },
        { status: 502 }
      )
    }

    try {
      await recordPendingPayment({
        studioId: studio.id,
        orderId,
        planType,
        amount: plan.amount,
      })
    } catch (error) {
      console.error("Failed to record pending payment:", error)
    }

    return NextResponse.json({
      paymentUrl,
      orderId,
      amount: plan.amount,
      planType,
      studioId: studio.id,
    })
  } catch (error) {
    console.error("Duitku createInvoice failed:", error)
    return NextResponse.json(
      { error: "Gagal membuat order pembayaran. Coba lagi." },
      { status: 502 }
    )
  }
}
