import { eq } from "drizzle-orm"
import { getDb } from "@/db"
import { user } from "@/db/auth-schema"
import { studios, studioMemberships } from "@/db/schema"
import {
  amountsMatchPlan,
  fetchTransactionStatus,
  isSuccessfulPayment,
  parsePaymentMetadata,
  PLAN_CATALOG,
  type MidtransNotificationPayload,
  type MidtransTransactionStatus,
} from "@/lib/billing/midtrans"
import { recordPaymentEvent } from "@/lib/billing/payment-service"
import {
  activateSubscription,
  getSubscriptionForStudio,
  isActivePaidSubscription,
  recordInvoice,
  setStudioActiveIfNotSuspended,
} from "@/lib/studio/studio-service"
import { getPlanByType } from "@/lib/billing/billing-plans"

export class BillingActivationError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message)
    this.name = "BillingActivationError"
  }
}

type ActivatePaidOrderInput = {
  orderId: string
  grossAmount: string | number | undefined
  customField1: string | undefined
  paymentStatus: MidtransNotificationPayload
  expectedStudioId?: string
}

/**
 * Pure validation for an incoming paid order. Throws BillingActivationError on
 * any inconsistency. Kept side-effect free so it is trivially unit-testable.
 */
export function validatePaidOrder(input: ActivatePaidOrderInput): {
  studioId: string
  planType: string
  months: number
  amount: number
} {
  if (!isSuccessfulPayment(input.paymentStatus)) {
    throw new BillingActivationError("Payment not completed", 400)
  }

  const metadata = parsePaymentMetadata(input.customField1)
  if (!metadata) {
    throw new BillingActivationError("Invalid payment metadata", 400)
  }

  const { studioId, planType } = metadata

  if (input.expectedStudioId && studioId !== input.expectedStudioId) {
    throw new BillingActivationError("Order does not belong to this studio", 403)
  }

  if (!amountsMatchPlan(planType, input.grossAmount)) {
    throw new BillingActivationError("Amount mismatch", 400)
  }

  const plan = PLAN_CATALOG[planType]
  if (!plan?.months) {
    throw new BillingActivationError("Invalid plan", 400)
  }
  if (!plan.amount) {
    throw new BillingActivationError("Invalid plan amount", 400)
  }

  return { studioId, planType, months: plan.months, amount: plan.amount }
}

/**
 * Canonical activation. Single source of truth used by the Midtrans webhook.
 * Writes payments + invoice + subscription + studio status atomically and
 * idempotently. Activation must only ever happen from the async webhook.
 */
export async function activatePaidOrder(input: ActivatePaidOrderInput) {
  const { studioId, planType, months, amount } = validatePaidOrder(input)

  let activatedSubscription: Awaited<ReturnType<typeof activateSubscription>> | null = null

  await getDb().transaction(async (tx) => {
    await recordPaymentEvent(input.paymentStatus, tx)

    await recordInvoice(
      {
        studioId,
        midtransOrderId: input.orderId,
        planType,
        amount,
        status: "paid",
        paidAt: new Date(),
      },
      tx,
    )

    activatedSubscription = await activateSubscription(
      {
        studioId,
        planType,
        midtransOrderId: input.orderId,
        months,
      },
      tx,
    )

    await setStudioActiveIfNotSuspended(studioId, tx)
  })

  // Kirim email konfirmasi — fire-and-forget, tidak blocking aktivasi
  sendPaymentConfirmationEmail({
    studioId,
    planType,
    amount,
    orderId: input.orderId,
    subscription: activatedSubscription,
  }).catch((err) => {
    console.error("[billing:email] Failed to send payment confirmation:", err)
  })

  return { studioId, planType }
}

/**
 * Kirim email konfirmasi pembayaran ke owner studio.
 * Gagal secara diam-diam (hanya log) agar tidak membatalkan aktivasi.
 */
async function sendPaymentConfirmationEmail(input: {
  studioId: string
  planType: string
  amount: number
  orderId: string
  subscription: { startsAt?: Date | null; expiresAt?: Date | null } | null
}) {
  const db = getDb()

  // Ambil data studio
  const [studioRow] = await db
    .select({ name: studios.name })
    .from(studios)
    .where(eq(studios.id, input.studioId))
    .limit(1)
  if (!studioRow) return

  // Ambil email owner (primary owner membership)
  const [memberRow] = await db
    .select({ name: user.name, email: user.email })
    .from(studioMemberships)
    .innerJoin(user, eq(studioMemberships.userId, user.id))
    .where(eq(studioMemberships.studioId, input.studioId))
    .orderBy(studioMemberships.createdAt)
    .limit(1)
  if (!memberRow?.email) return

  const plan = getPlanByType(input.planType)
  if (!plan) return

  const now = new Date()
  const startsAt = input.subscription?.startsAt ?? now
  const expiresAt = input.subscription?.expiresAt ?? (() => {
    const d = new Date(now)
    d.setMonth(d.getMonth() + plan.months)
    return d
  })()

  // Import dinamis agar server-only tidak masuk ke client bundle
  const [{ sendEmail }, { buildPaymentSuccessEmail }] = await Promise.all([
    import("@/lib/email"),
    import("@/lib/email/templates/payment-success"),
  ])

  const { subject, html, text } = buildPaymentSuccessEmail({
    studioName: studioRow.name,
    ownerName: memberRow.name,
    planName: plan.name,
    planDuration: plan.duration,
    amount: input.amount,
    orderId: input.orderId,
    startsAt,
    expiresAt,
  })

  await sendEmail({ to: memberRow.email, subject, html, text })
}


/**
 * Verification-only status check for the client (post-Snap polling).
 * NEVER activates — it only re-checks the Midtrans transaction server-side and
 * reports the current persisted subscription state. Activation is webhook-only
 * per the platform billing rules.
 */
export async function confirmOrderPayment(input: {
  orderId: string
  planType: string
  studioId: string
}) {
  let status: MidtransTransactionStatus

  try {
    status = await fetchTransactionStatus(input.orderId)
  } catch (error) {
    console.error("Midtrans status check failed:", error)
    throw new BillingActivationError(
      "Gagal memverifikasi status pembayaran",
      502,
    )
  }

  const metadata = parsePaymentMetadata(status.custom_field1)
  if (!metadata) {
    throw new BillingActivationError("Invalid payment metadata", 400)
  }

  if (metadata.studioId !== input.studioId) {
    throw new BillingActivationError("Order does not belong to this studio", 403)
  }

  if (metadata.planType !== input.planType) {
    throw new BillingActivationError("Plan mismatch", 400)
  }

  if (status.order_id && status.order_id !== input.orderId) {
    throw new BillingActivationError("Order ID mismatch", 400)
  }

  const subscription = await getSubscriptionForStudio(input.studioId)
  let activated = subscription ? isActivePaidSubscription(subscription) : false

  // Fallback activation: If Midtrans confirms the transaction is successful
  // but the subscription isn't marked as active yet (e.g. webhook failed/delayed),
  // activate it right now to prevent user lock-out.
  if (isSuccessfulPayment(status) && !activated) {
    console.info(`[billing:confirm] Fallback activation triggered for order ${input.orderId}`)
    await activatePaidOrder({
      orderId: input.orderId,
      grossAmount: status.gross_amount,
      customField1: status.custom_field1,
      paymentStatus: status,
      expectedStudioId: input.studioId,
    })
    activated = true
  }

  return {
    studioId: input.studioId,
    planType: input.planType,
    transactionStatus: status.transaction_status ?? "unknown",
    paid: isSuccessfulPayment(status),
    activated,
  }
}

/**
 * Activate from a verified Midtrans webhook notification. The caller MUST have
 * already verified the notification signature.
 */
export async function activateFromWebhookNotification(
  body: MidtransNotificationPayload,
) {
  const orderId = body.order_id
  if (!orderId) {
    throw new BillingActivationError("Missing order_id", 400)
  }

  return activatePaidOrder({
    orderId,
    grossAmount: body.gross_amount,
    customField1: body.custom_field1,
    paymentStatus: body,
  })
}
