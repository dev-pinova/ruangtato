import {
  amountsMatchPlan,
  fetchTransactionStatus,
  isSuccessfulPayment,
  parsePaymentMetadata,
  PLAN_CATALOG,
  type MidtransNotificationPayload,
  type MidtransTransactionStatus,
} from "@/lib/midtrans"
import { activateSubscription, recordInvoice } from "@/lib/studio-service"

export class BillingActivationError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message)
    this.name = "BillingActivationError"
  }
}

function assertSuccessfulPayment(payload: MidtransNotificationPayload) {
  if (!isSuccessfulPayment(payload)) {
    throw new BillingActivationError("Payment not completed", 400)
  }
}

export async function activatePaidOrder(input: {
  orderId: string
  grossAmount: string | number | undefined
  customField1: string | undefined
  paymentStatus: MidtransNotificationPayload
  expectedStudioId?: string
}) {
  const { orderId, grossAmount, customField1, paymentStatus, expectedStudioId } =
    input

  assertSuccessfulPayment(paymentStatus)

  const metadata = parsePaymentMetadata(customField1)
  if (!metadata) {
    throw new BillingActivationError("Invalid payment metadata", 400)
  }

  const { studioId, planType } = metadata

  if (expectedStudioId && studioId !== expectedStudioId) {
    throw new BillingActivationError("Order does not belong to this studio", 403)
  }

  if (!amountsMatchPlan(planType, grossAmount)) {
    throw new BillingActivationError("Amount mismatch", 400)
  }

  const months = PLAN_CATALOG[planType]?.months
  if (!months) {
    throw new BillingActivationError("Invalid plan", 400)
  }

  const amount = PLAN_CATALOG[planType]?.amount
  if (!amount) {
    throw new BillingActivationError("Invalid plan amount", 400)
  }

  await recordInvoice({
    studioId,
    midtransOrderId: orderId,
    planType,
    amount,
    status: "paid",
    paidAt: new Date(),
  })

  await activateSubscription({
    studioId,
    planType,
    midtransOrderId: orderId,
    months,
  })

  return { studioId, planType }
}

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

  return activatePaidOrder({
    orderId: input.orderId,
    grossAmount: status.gross_amount,
    customField1: status.custom_field1,
    paymentStatus: status,
    expectedStudioId: input.studioId,
  })
}

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
