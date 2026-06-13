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

// Midtrans usually sends `custom_field1`; some flows historically used
// `custom_field_1`. Accept both on the wire and normalize to `custom_field1`.
interface MidtransWebhookPayload extends MidtransNotificationPayload {
  custom_field_1?: string
  payment_type?: string
  transaction_id?: string
}

export async function POST(request: Request) {
  if (!isMidtransConfigured()) {
    console.warn("[webhook:midtrans] Midtrans is not configured")
    return NextResponse.json({ error: "Midtrans not configured" }, { status: 503 })
  }

  const body = (await request
    .json()
    .catch(() => null)) as MidtransWebhookPayload | null
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  // Normalize custom field naming before signature/metadata handling.
  if (body.custom_field1 == null && body.custom_field_1 != null) {
    body.custom_field1 = body.custom_field_1
  }

  // The signature is the sole authentication for this public endpoint.
  if (!verifyNotificationSignature(body)) {
    console.error(
      `[webhook:midtrans] Invalid signature for order ${body.order_id ?? "?"}`,
    )
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  if (!body.order_id) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 })
  }

  try {
    if (isSuccessfulPayment(body)) {
      // Canonical, idempotent activation (payments + invoice + subscription +
      // studio status) inside a single transaction.
      await activateFromWebhookNotification(body)
      return NextResponse.json(
        { message: "Transaction processed successfully" },
        { status: 200 },
      )
    }

    // Non-success states (pending/expire/deny/cancel/failure): persist the
    // latest payment status without touching the subscription.
    try {
      await recordPaymentEvent(body)
    } catch (error) {
      console.error(
        `[webhook:midtrans] Failed to record non-success event for order ${body.order_id}:`,
        error,
      )
    }

    return NextResponse.json(
      { message: `Status '${body.transaction_status ?? "unknown"}' logged` },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof BillingActivationError) {
      // Permanent data/validation issue (bad amount, metadata, etc.).
      // Acknowledge (200) so Midtrans stops retrying, but log loudly.
      console.error(
        `[webhook:midtrans] Activation rejected for order ${body.order_id}: ${error.message}`,
      )
      return NextResponse.json({ error: error.message }, { status: 200 })
    }

    // Unexpected/transient failure (e.g. DB) — return 500 so Midtrans retries.
    console.error(
      `[webhook:midtrans] Unexpected failure for order ${body.order_id}:`,
      error,
    )
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 },
    )
  }
}
