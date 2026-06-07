import { NextResponse } from "next/server"

import {
  activateFromWebhookNotification,
  BillingActivationError,
} from "@/lib/billing-activation"
import {
  isMidtransConfigured,
  isSuccessfulPayment,
  verifyNotificationSignature,
  type MidtransNotificationPayload,
} from "@/lib/midtrans"

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

  try {
    await activateFromWebhookNotification(body)
    return NextResponse.json({ message: "Subscription activated" })
  } catch (error) {
    if (error instanceof BillingActivationError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("Webhook activation failed:", error)
    return NextResponse.json({ error: "Activation failed" }, { status: 500 })
  }
}
