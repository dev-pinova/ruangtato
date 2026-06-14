import { NextResponse } from "next/server"
import { getDb } from "@/db"
import { payments, studios, subscriptions } from "@/db/schema"
import { eq } from "drizzle-orm"
import {
  isMidtransConfigured,
  verifyNotificationSignature,
  isSuccessfulPayment,
  amountsMatchPlan,
  type MidtransNotificationPayload,
  PLAN_CATALOG,
} from "@/lib/billing/midtrans"

// Type-safe interface for Midtrans Webhook Payload extending the library type
interface MidtransWebhookPayload extends MidtransNotificationPayload {
  custom_field_1?: string
  payment_type?: string
  transaction_id?: string
}

export async function POST(request: Request) {
  console.log("[WEBHOOK: MIDTRANS] Received new webhook notification")

  if (!isMidtransConfigured()) {
    console.warn("[WEBHOOK: MIDTRANS] Midtrans is not configured")
    return NextResponse.json(
      { error: "Midtrans not configured" },
      { status: 503 }
    )
  }

  const body = (await request.json().catch(() => null)) as MidtransWebhookPayload | null
  if (!body) {
    console.error("[WEBHOOK: MIDTRANS] Invalid payload received")
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const transaction_status = body.transaction_status?.toLowerCase() || ""
  const orderId = body.order_id
  const transactionId = body.transaction_id
  const paymentMethod = body.payment_type
  const grossAmountStr = body.gross_amount

  console.log(`[WEBHOOK: MIDTRANS] Processing Order ID: ${orderId}, Status: ${transaction_status}`)

  if (!verifyNotificationSignature(body)) {
    console.error(`[WEBHOOK: MIDTRANS] Invalid signature for Order ID: ${orderId}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  // 1. DETEKSI STATUS SUKSES (HANDLING CREDIT CARD & QRIS) & STATUS GAGAL
  const isSuccess = isSuccessfulPayment(body)
  const isFailed = ['deny', 'expire', 'cancel'].includes(transaction_status)

  console.log(`[WEBHOOK: MIDTRANS] Detection - isSuccess: ${isSuccess}, isFailed: ${isFailed}`)

  // 2. PARSE METADATA (CUSTOM FIELD)
  let studioIdFromCustom: string | null = null
  let planTypeFromCustom: string | null = null

  const rawCustomField = body.custom_field_1 || body.custom_field1
  if (rawCustomField) {
    try {
      const customData = JSON.parse(rawCustomField) as { studioId?: string; planType?: string }
      studioIdFromCustom = customData?.studioId || null
      planTypeFromCustom = customData?.planType || null
      console.log(`[WEBHOOK: MIDTRANS] Parsed metadata - Studio ID: ${studioIdFromCustom}, Plan Type: ${planTypeFromCustom}`)
    } catch (e) {
      console.warn("[WEBHOOK: MIDTRANS] Failed to parse custom field JSON:", e)
    }
  }

  const dbInstance = getDb()
  const grossAmount = grossAmountStr ? Math.round(Number(grossAmountStr)) : 0

  // 3. OPERASI UPDATE DATABASE (TRANSACTION / MULTI-WRITE)
  if (isSuccess) {
    if (!orderId) {
      console.error("[WEBHOOK: MIDTRANS] Missing order_id in payload")
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 })
    }

    try {
      let alreadyProcessed = false
      let amountMismatch = false
      await dbInstance.transaction(async (tx) => {
        console.log(`[WEBHOOK: MIDTRANS] Transaction started for Order ID: ${orderId}`)

        // A. TABEL PAYMENTS:
        // - Cari baris berdasarkan order_id.
        // - Ubah transaction_status menjadi 'settlement'.
        // - Isi paid_at = new Date().
        // - Ambil studio_id dari baris pembayaran ini jika di custom_field_1 kosong.
        // FOR UPDATE locks the existing payment row so two concurrent duplicate
        // notifications serialize here: the first flips status to 'success' and
        // commits, the second then sees 'success' and hits the idempotency guard.
        // (A brand-new order has no row to lock, but payments.orderId is UNIQUE,
        // so a racing second insert fails and Midtrans retries into the guard.)
        const [existingPayment] = await tx
          .select({
            studioId: payments.studioId,
            subscriptionId: payments.subscriptionId,
            transactionStatus: payments.transactionStatus,
          })
          .from(payments)
          .where(eq(payments.orderId, orderId))
          .limit(1)
          .for("update")

        // IDEMPOTENCY GUARD: a replayed success notification must not re-run
        // activation or re-extend subscription expiry. If this order is already
        // marked successful, acknowledge and stop without mutating anything.
        if (existingPayment && existingPayment.transactionStatus === 'success') {
          console.log(`[WEBHOOK: MIDTRANS] Duplicate success notification ignored for Order ID: ${orderId} (already processed)`)
          alreadyProcessed = true
          return
        }

        const finalStudioId = studioIdFromCustom || existingPayment?.studioId
        if (!finalStudioId) {
          throw new Error(`Studio ID could not be resolved from metadata or existing payments for Order ID: ${orderId}`)
        }

        // AMOUNT VERIFICATION: when the buyer declared a plan in metadata, the
        // paid gross amount MUST equal that plan's catalog price. A mismatch is
        // a tampering signal — record nothing, do not grant access. We still
        // return 200 (handled below) so Midtrans stops retrying.
        if (planTypeFromCustom && !amountsMatchPlan(planTypeFromCustom, grossAmountStr)) {
          console.warn(
            `[WEBHOOK: MIDTRANS] SECURITY: amount mismatch for Order ID: ${orderId}. ` +
              `Plan=${planTypeFromCustom}, expected=${PLAN_CATALOG[planTypeFromCustom]?.amount}, received=${grossAmountStr}. Activation refused.`
          )
          amountMismatch = true
          return
        }

        console.log(`[WEBHOOK: MIDTRANS] Updating payment for Order ID: ${orderId}. Studio ID: ${finalStudioId}`)
        if (existingPayment) {
          await tx
            .update(payments)
            .set({
              transactionStatus: 'success',
              paidAt: new Date(),
              transactionId: transactionId || null,
              paymentMethod: paymentMethod || null,
              rawPayload: body as unknown as Record<string, unknown>,
            })
            .where(eq(payments.orderId, orderId))
        } else {
          await tx
            .insert(payments)
            .values({
              studioId: finalStudioId,
              orderId,
              amount: grossAmount,
              transactionId: transactionId || null,
              paymentMethod: paymentMethod || null,
              transactionStatus: 'success',
              fraudStatus: body.fraud_status || null,
              rawPayload: body as unknown as Record<string, unknown>,
              paidAt: new Date(),
            })
        }

        // B. TABEL STUDIOS:
        // - Cari studio berdasarkan id (studio_id).
        // - Ubah status menjadi 'active'.
        console.log(`[WEBHOOK: MIDTRANS] Setting studio status to 'active' for Studio ID: ${finalStudioId}`)
        await tx
          .update(studios)
          .set({ status: 'active' })
          .where(eq(studios.id, finalStudioId))

        // C. TABEL SUBSCRIPTIONS (LANGGANAN):
        // - Jika pembayaran ini terhubung dengan paket langganan, buat atau perbarui data di tabel subscriptions.
        // - Setel status menjadi 'active'.
        // - Setel tanggal mulai (starts_at = new Date()).
        // - Hitung tanggal berakhir (expires_at) dari PLAN_CATALOG[planType].months.
        const startsAt = new Date()
        const expiresAt = new Date(startsAt)

        // Resolve plan: prefer the metadata planType (already amount-verified
        // above when present). Fall back to a catalog lookup by gross amount so
        // legacy/no-metadata orders still resolve a known plan.
        let resolvedPlanType = planTypeFromCustom
        if (!resolvedPlanType || !PLAN_CATALOG[resolvedPlanType]) {
          const matchedPlan = Object.keys(PLAN_CATALOG).find(
            (plan) => PLAN_CATALOG[plan].amount === grossAmount
          )
          resolvedPlanType = matchedPlan ?? resolvedPlanType ?? '1month'
        }

        // Duration is derived solely from the catalog, never from raw amounts.
        const months = PLAN_CATALOG[resolvedPlanType]?.months ?? 1
        expiresAt.setMonth(expiresAt.getMonth() + months)

        console.log(`[WEBHOOK: MIDTRANS] Duration calculation: Plan=${resolvedPlanType}, Months=${months}, Starts=${startsAt.toISOString()}, Expires=${expiresAt.toISOString()}`)

        const [existingSub] = await tx
          .select({ id: subscriptions.id })
          .from(subscriptions)
          .where(eq(subscriptions.studioId, finalStudioId))
          .limit(1)

        let subId: string
        if (existingSub) {
          console.log(`[WEBHOOK: MIDTRANS] Updating existing subscription ID: ${existingSub.id}`)
          const [updatedSub] = await tx
            .update(subscriptions)
            .set({
              planType: resolvedPlanType,
              status: 'active',
              startsAt,
              expiresAt,
              midtransOrderId: orderId,
              midtransTransactionId: transactionId || null,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, existingSub.id))
            .returning({ id: subscriptions.id })
          subId = updatedSub.id
        } else {
          console.log(`[WEBHOOK: MIDTRANS] Inserting new subscription for Studio ID: ${finalStudioId}`)
          const [createdSub] = await tx
            .insert(subscriptions)
            .values({
              studioId: finalStudioId,
              planType: resolvedPlanType,
              status: 'active',
              startsAt,
              expiresAt,
              midtransOrderId: orderId,
              midtransTransactionId: transactionId || null,
            })
            .returning({ id: subscriptions.id })
          subId = createdSub.id
        }

        // Keep payments linked to the correct subscription record
        await tx
          .update(payments)
          .set({ subscriptionId: subId })
          .where(eq(payments.orderId, orderId))
      })

      if (alreadyProcessed) {
        return NextResponse.json({ message: "Already processed" }, { status: 200 })
      }

      if (amountMismatch) {
        return NextResponse.json({ message: "Amount mismatch logged" }, { status: 200 })
      }

      console.log(`[WEBHOOK: MIDTRANS] DB transaction successfully committed for Order ID: ${orderId}`)
      return NextResponse.json({ message: "Transaction processed successfully" }, { status: 200 })
    } catch (dbError) {
      console.error(`[WEBHOOK: MIDTRANS] DB transaction failed for Order ID: ${orderId}:`, dbError)
      return NextResponse.json({ error: "Failed to process database updates" }, { status: 500 })
    }
  }

  // 4. HANDLING JIKA TRANSAKSI GAGAL
  if (isFailed) {
    if (!orderId) {
      console.error("[WEBHOOK: MIDTRANS] Missing order_id in failed payload")
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 })
    }

    try {
      console.log(`[WEBHOOK: MIDTRANS] Processing failed payment event for Order ID: ${orderId}`)
      await dbInstance.transaction(async (tx) => {
        const [existingPayment] = await tx
          .select()
          .from(payments)
          .where(eq(payments.orderId, orderId))
          .limit(1)

        if (existingPayment) {
          await tx
            .update(payments)
            .set({
              transactionStatus: 'failed',
              transactionId: transactionId || null,
              paymentMethod: paymentMethod || null,
              rawPayload: body as unknown as Record<string, unknown>,
            })
            .where(eq(payments.orderId, orderId))
        } else {
          const finalStudioId = studioIdFromCustom
          if (finalStudioId) {
            await tx
              .insert(payments)
              .values({
                studioId: finalStudioId,
                orderId,
                amount: grossAmount,
                transactionId: transactionId || null,
                paymentMethod: paymentMethod || null,
                transactionStatus: 'failed',
                fraudStatus: body.fraud_status || null,
                rawPayload: body as unknown as Record<string, unknown>,
              })
          } else {
            console.warn(`[WEBHOOK: MIDTRANS] studioId unknown, failed payment recorded partially for Order ID: ${orderId}`)
          }
        }
      })

      console.log(`[WEBHOOK: MIDTRANS] Successfully updated payment status to failed for Order ID: ${orderId}`)
      return NextResponse.json({ message: "Failed payment recorded" }, { status: 200 })
    } catch (dbError) {
      console.error(`[WEBHOOK: MIDTRANS] Failed to update failed payment status for Order ID: ${orderId}:`, dbError)
      return NextResponse.json({ error: "Database update failed" }, { status: 500 })
    }
  }

  // 5. SECURE RESPONSE (Return HTTP 200 OK for unhandled/pending states)
  console.log(`[WEBHOOK: MIDTRANS] Received unhandled status: '${transaction_status}' for Order ID: ${orderId}.`)
  return NextResponse.json({ message: `Status '${transaction_status}' logged` }, { status: 200 })
}
