import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  getMidtransClientKey,
  getSnapClient,
  isMidtransConfigured,
  PLAN_CATALOG,
} from "@/lib/midtrans"
import { recordPendingPayment } from "@/lib/payment-service"
import { getStudioForUser, getStudioSuspendedFlagForUser } from "@/lib/studio-service"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isMidtransConfigured()) {
    return NextResponse.json(
      { error: "Midtrans belum dikonfigurasi. Set MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY." },
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

  const body = await request.json().catch(() => ({}))
  const planType = typeof body.planType === "string" ? body.planType : "1month"
  const plan = PLAN_CATALOG[planType]

  if (!plan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  const orderId = `RT-${studio.id.slice(0, 8)}-${Date.now()}`

  try {
    const snap = getSnapClient()
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: plan.amount,
      },
      custom_field1: JSON.stringify({ studioId: studio.id, planType }),
      customer_details: {
        first_name: session.user.name ?? studio.name,
        email: session.user.email,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/app/billing?payment=finish`,
      },
    })

    const snapToken =
      typeof transaction === "object" && transaction !== null && "token" in transaction
        ? String((transaction as { token: string }).token)
        : null

    if (!snapToken) {
      return NextResponse.json(
        { error: "Gagal membuat Snap token dari Midtrans." },
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
      snapToken,
      orderId,
      clientKey: getMidtransClientKey(),
      amount: plan.amount,
      planType,
      studioId: studio.id,
    })
  } catch (error) {
    console.error("Midtrans createTransaction failed:", error)
    return NextResponse.json(
      { error: "Gagal membuat order pembayaran. Coba lagi." },
      { status: 502 }
    )
  }
}
