import { NextResponse } from "next/server"

import {
  activateFromWebhookNotification,
  BillingActivationError,
} from "@/lib/billing/billing-activation"
import {
  isDuitkuConfigured,
  isSuccessfulPayment,
  verifyNotificationSignature,
  type DuitkuNotificationPayload,
} from "@/lib/billing/duitku"
import { recordPaymentEvent } from "@/lib/billing/payment-service"

export async function POST(request: Request) {
  if (!isDuitkuConfigured()) {
    console.warn("[webhook:duitku] Duitku is not configured")
    return new Response("Duitku not configured", { status: 503 })
  }

  // Duitku callback can be application/x-www-form-urlencoded or application/json
  const contentType = request.headers.get("content-type") || ""
  let body: DuitkuNotificationPayload = {}

  try {
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData()
      body = {
        merchantCode: formData.get("merchantCode")?.toString(),
        amount: formData.get("amount")?.toString(),
        merchantOrderId: formData.get("merchantOrderId")?.toString(),
        productDetail: formData.get("productDetail")?.toString(),
        additionalParam: formData.get("additionalParam")?.toString(),
        paymentCode: formData.get("paymentCode")?.toString(),
        resultCode: formData.get("resultCode")?.toString(),
        reference: formData.get("reference")?.toString(),
        signature: formData.get("signature")?.toString(),
      }
    } else {
      const parsedJson = await request.json().catch(() => null)
      if (parsedJson === null) {
        return new Response("Invalid payload", { status: 400 })
      }
      body = parsedJson as DuitkuNotificationPayload
    }
  } catch (error) {
    console.error("[webhook:duitku] Failed to parse payload:", error)
    return new Response("Invalid payload", { status: 400 })
  }

  // The signature is the sole authentication for this public endpoint.
  if (!verifyNotificationSignature(body)) {
    console.error(
      `[webhook:duitku] Invalid signature for order ${body.merchantOrderId ?? "?"}`,
    )
    return new Response("Invalid signature", { status: 401 })
  }

  if (!body.merchantOrderId) {
    return new Response("Missing merchantOrderId", { status: 400 })
  }

  try {
    if (isSuccessfulPayment(body)) {
      // Canonical, idempotent activation (payments + invoice + subscription +
      // studio status) inside a single transaction.
      await activateFromWebhookNotification(body)
      return new Response("OK", { status: 200 })
    }

    // Non-success states: persist the latest payment status without touching the subscription.
    try {
      await recordPaymentEvent(body)
    } catch (error) {
      console.error(
        `[webhook:duitku] Failed to record non-success event for order ${body.merchantOrderId}:`,
        error,
      )
    }

    return new Response("OK", { status: 200 })
  } catch (error) {
    if (error instanceof BillingActivationError) {
      // Permanent data/validation issue (bad amount, metadata, etc.).
      // Acknowledge (200) with OK so Duitku stops retrying, but log loudly.
      console.error(
        `[webhook:duitku] Activation rejected for order ${body.merchantOrderId}: ${error.message}`,
      )
      return new Response("OK", { status: 200 })
    }

    // Unexpected/transient failure (e.g. DB) — return 500 so Duitku retries.
    console.error(
      `[webhook:duitku] Unexpected failure for order ${body.merchantOrderId}:`,
      error,
    )
    return new Response("Failed to process webhook", { status: 500 })
  }
}
