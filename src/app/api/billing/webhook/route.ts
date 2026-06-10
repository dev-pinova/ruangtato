import { NextResponse } from "next/server"

import {
  activateFromWebhookNotification,
  BillingActivationError,
} from "@/lib/billing/billing-activation"
import {
  isMidtransConfigured,
  isSuccessfulPayment,
  verifyNotificationSignature,
  type MidtransNotificationPayload,
} from "@/lib/billing/midtrans"
import { recordPaymentEvent } from "@/lib/billing/payment-service"

export async function POST(request: Request) {
  console.log("[WEBHOOK: MIDTRANS] Received new webhook notification")

  if (!isMidtransConfigured()) {
    console.warn("[WEBHOOK: MIDTRANS] Midtrans is not configured")
    return NextResponse.json(
      { error: "Midtrans not configured" },
      { status: 503 }
    )
  }

  const body = (await request.json().catch(() => null)) as MidtransNotificationPayload | null
  if (!body) {
    console.error("[WEBHOOK: MIDTRANS] Invalid payload received")
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  console.log(`[WEBHOOK: MIDTRANS] Processing Order ID: ${body.order_id}, Status: ${body.transaction_status}`)

  if (!verifyNotificationSignature(body)) {
    console.error(`[WEBHOOK: MIDTRANS] Invalid signature for Order ID: ${body.order_id}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  try {
    const row = await recordPaymentEvent(body)
    console.log(`[WEBHOOK: MIDTRANS] Successfully recorded payment event for Order ID: ${body.order_id}. Updated DB Status to: ${row?.transactionStatus || 'unknown'}`)
  } catch (error) {
    console.error("[WEBHOOK: MIDTRANS] Payment event recording failed:", error)
    return NextResponse.json({ error: "Failed to record payment event" }, { status: 500 })
  }

  if (!isSuccessfulPayment(body)) {
    console.log(`[WEBHOOK: MIDTRANS] Payment is not successful (yet). Current status: ${body.transaction_status}`)
    return NextResponse.json({ message: "Payment event recorded" })
  }

  try {
    console.log(`[WEBHOOK: MIDTRANS] Payment is successful. Activating subscription for Order ID: ${body.order_id}`)
    await activateFromWebhookNotification(body)
    console.log(`[WEBHOOK: MIDTRANS] Subscription successfully activated for Order ID: ${body.order_id}`)
    return NextResponse.json({ message: "Subscription activated" })
  } catch (error) {
    if (error instanceof BillingActivationError) {
      console.warn(`[WEBHOOK: MIDTRANS] Billing activation warning/error: ${error.message}`)
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[WEBHOOK: MIDTRANS] Webhook activation failed:", error)
    return NextResponse.json({ error: "Activation failed" }, { status: 500 })
  }
}
