import { createHash } from "crypto"
import midtransClient from "midtrans-client"

export const PLAN_CATALOG: Record<
  string,
  { amount: number; months: number }
> = {
  "1month": { amount: 149_000, months: 1 },
  "3months": { amount: 399_000, months: 3 },
  "6months": { amount: 749_000, months: 6 },
  "12months": { amount: 1_299_000, months: 12 },
}

export type MidtransNotificationPayload = {
  order_id?: string
  status_code?: string
  gross_amount?: string
  signature_key?: string
  transaction_status?: string
  fraud_status?: string
  custom_field1?: string
}

export function isMidtransConfigured(): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.replace(/^["']|["']$/g, "")
  const clientKey = process.env.MIDTRANS_CLIENT_KEY?.replace(/^["']|["']$/g, "")
  return Boolean(serverKey && clientKey)
}

export function getMidtransClientKey(): string | undefined {
  const key =
    process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ??
    process.env.MIDTRANS_CLIENT_KEY
  return key?.replace(/^["']|["']$/g, "")
}

export function isMidtransProduction(): boolean {
  return process.env.MIDTRANS_IS_PRODUCTION === "true"
}

function getMidtransCredentials() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.replace(/^["']|["']$/g, "")
  const clientKey = process.env.MIDTRANS_CLIENT_KEY?.replace(/^["']|["']$/g, "")

  if (!serverKey || !clientKey) {
    throw new Error("Midtrans credentials are not configured")
  }

  return { serverKey, clientKey }
}

export function getSnapClient() {
  const { serverKey, clientKey } = getMidtransCredentials()

  return new midtransClient.Snap({
    isProduction: isMidtransProduction(),
    serverKey,
    clientKey,
  })
}

export function getCoreApiClient() {
  const { serverKey, clientKey } = getMidtransCredentials()

  return new midtransClient.CoreApi({
    isProduction: isMidtransProduction(),
    serverKey,
    clientKey,
  })
}

export type MidtransTransactionStatus = MidtransNotificationPayload & {
  custom_field1?: string
}

export async function fetchTransactionStatus(
  orderId: string,
): Promise<MidtransTransactionStatus> {
  const core = getCoreApiClient()
  const response = await core.transaction.status(orderId)
  return response as MidtransTransactionStatus
}

export type PaymentOrderMetadata = {
  studioId: string
  planType: string
}

export function parsePaymentMetadata(
  customField1: string | undefined,
): PaymentOrderMetadata | null {
  if (!customField1) return null

  try {
    const parsed = JSON.parse(customField1) as {
      studioId?: string
      planType?: string
    }
    if (!parsed.studioId || !parsed.planType) return null
    return { studioId: parsed.studioId, planType: parsed.planType }
  } catch {
    return null
  }
}

export function amountsMatchPlan(
  planType: string,
  grossAmount: string | number | undefined,
): boolean {
  const expectedAmount = getPlanAmount(planType)
  if (expectedAmount === null) return false

  const amount = Number(grossAmount)
  if (!Number.isFinite(amount)) return false

  return Math.round(amount) === expectedAmount
}

export function verifyNotificationSignature(
  payload: MidtransNotificationPayload
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.replace(/^["']|["']$/g, "")
  const { order_id, status_code, gross_amount, signature_key } = payload

  if (!serverKey || !order_id || !status_code || !gross_amount || !signature_key) {
    return false
  }

  const expected = createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest("hex")

  return expected === signature_key
}

export function isSuccessfulPayment(payload: MidtransNotificationPayload): boolean {
  const status = payload.transaction_status

  if (status === "settlement") {
    return true
  }

  if (status === "capture") {
    return payload.fraud_status === "accept"
  }

  return false
}

export function getPlanAmount(planType: string): number | null {
  return PLAN_CATALOG[planType]?.amount ?? null
}
