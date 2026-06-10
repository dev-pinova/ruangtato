import { NextResponse } from "next/server"

import {
  activateFromWebhookNotification,
  BillingActivationError,
} from "@/lib/billing/billing-activation"
import {
  isMidtransConfigured,
  verifyNotificationSignature,
  type MidtransNotificationPayload,
} from "@/lib/billing/midtrans"
import { recordPaymentEvent } from "@/lib/billing/payment-service"
import { db } from "@/db"
import { payments, studios } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

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

  const txStatus = body.transaction_status?.toLowerCase();
  console.log(`[WEBHOOK: MIDTRANS] Processing Order ID: ${body.order_id}, Status: ${txStatus}`)

  if (!verifyNotificationSignature(body)) {
    console.error(`[WEBHOOK: MIDTRANS] Invalid signature for Order ID: ${body.order_id}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  try {
    const row = await recordPaymentEvent(body)
    console.log(`[WEBHOOK: MIDTRANS] Successfully recorded payment event for Order ID: ${body.order_id}. Updated DB Status to: ${row?.transactionStatus || 'unknown'}`)
  } catch (error) {
    console.error("[WEBHOOK: MIDTRANS] Payment event recording failed:", error)
  }

  // 1. TAMBAHKAN STATUS 'CAPTURE' & 4. STRING MISMATCH LOWERCASE
  const isSuccess = txStatus === 'settlement' || txStatus === 'capture';

  if (!isSuccess) {
    console.log(`[WEBHOOK: MIDTRANS] Payment is not successful (yet). Current status: ${txStatus}`)
    return NextResponse.json({ message: "Payment event recorded" })
  }

  // 2. AMBIL DATA DARI CUSTOM FIELD SEBAGAI FALLBACK
  let studioIdFromCustom: string | null = null;
  if (body.custom_field1) {
    try {
      const customData = JSON.parse(body.custom_field1);
      studioIdFromCustom = customData?.studioId || null;
    } catch (e) {
      console.warn("[WEBHOOK: MIDTRANS] Failed to parse custom_field1", e);
    }
  }

  // 3. LOGIKA UPDATE DATABASE BERLAPIS (FAIL-SAFE)
  try {
    if (db) {
      const paidAt = new Date();
      let updatedPayment = false;

      if (body.order_id) {
        const result = await db.update(payments)
          .set({ transactionStatus: 'settlement', paidAt })
          .where(eq(payments.orderId, body.order_id))
          .returning();
        
        if (result && result.length > 0) {
          updatedPayment = true;
          console.log(`[WEBHOOK: FAIL-SAFE] Successfully updated payment by order_id: ${body.order_id}`);
        }
      }

      if (!updatedPayment && studioIdFromCustom) {
        console.log(`[WEBHOOK: FAIL-SAFE] Order ID ${body.order_id} update failed/not found. Fallback to custom_field1 Studio ID: ${studioIdFromCustom}`);
        const latestPayment = await db.query.payments.findFirst({
          where: eq(payments.studioId, studioIdFromCustom),
          orderBy: [desc(payments.createdAt)],
        });

        if (latestPayment) {
          await db.update(payments)
            .set({ transactionStatus: 'settlement', paidAt })
            .where(eq(payments.id, latestPayment.id));
          console.log(`[WEBHOOK: FAIL-SAFE] Successfully updated latest payment using fallback for Studio ID: ${studioIdFromCustom}`);
        } else {
          console.warn(`[WEBHOOK: FAIL-SAFE] No existing payment found for Studio ID: ${studioIdFromCustom}`);
        }
      }

      // Update studio status to active
      if (studioIdFromCustom) {
        await db.update(studios)
          .set({ status: 'active' })
          .where(eq(studios.id, studioIdFromCustom));
        console.log(`[WEBHOOK: FAIL-SAFE] Studio ${studioIdFromCustom} status set to active`);
      }
    }
  } catch (error) {
    console.error("[WEBHOOK: FAIL-SAFE] Error during fail-safe DB update", error);
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
