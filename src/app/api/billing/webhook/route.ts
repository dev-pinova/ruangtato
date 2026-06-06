import { NextResponse } from "next/server"

import {
  getPlanAmount,
  isMidtransConfigured,
  isSuccessfulPayment,
  PLAN_CATALOG,
  verifyNotificationSignature,
  type MidtransNotificationPayload,
} from "@/lib/midtrans"
import { activateSubscription } from "@/lib/studio-service"

export async function POST(request: Request) {
  if (!isMidtransConfigured()) {
    return NextResponse.json(
      { error: "Midtrans not configured" },
      { status: 503 }
    )
  }

  const body = (await request.json().catch(() => null)) as MidtransNotificationPayload | null
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (!verifyNotificationSignature(body)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  if (!isSuccessfulPayment(body)) {
    return NextResponse.json({ message: "Ignored" })
  }

  const orderId = body.order_id
  const customData = body.custom_field1

  if (!orderId || !customData) {
    return NextResponse.json({ error: "Missing order metadata" }, { status: 400 })
  }

  let metadata: { studioId?: string; planType?: string }
  try {
    metadata = JSON.parse(customData)
  } catch {
    return NextResponse.json({ error: "Invalid custom_field1" }, { status: 400 })
  }

  const { studioId, planType } = metadata
  if (!studioId || !planType) {
    return NextResponse.json({ error: "studioId and planType required" }, { status: 400 })
  }

  const expectedAmount = getPlanAmount(planType)
  if (expectedAmount === null) {
    return NextResponse.json({ error: "Invalid planType" }, { status: 400 })
  }

  const grossAmount = Number(body.gross_amount)
  if (!Number.isFinite(grossAmount) || grossAmount !== expectedAmount) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
  }

  const months = PLAN_CATALOG[planType]?.months ?? 1

  try {
    await activateSubscription({
      studioId,
      planType,
      midtransOrderId: orderId,
      months,
    })
    return NextResponse.json({ message: "Subscription activated" })
  } catch (error) {
    console.error("Webhook activation failed:", error)
    return NextResponse.json({ error: "Activation failed" }, { status: 500 })
  }
}
