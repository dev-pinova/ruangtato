import { createHash } from "crypto"
import midtransClient from "midtrans-client"

export const PLAN_CATALOG: Record<
  string,
  { amount: number; months: number }
> = {
  "1month": { amount: 99_000, months: 1 },
  "3months": { amount: 249_000, months: 3 },
  "6months": { amount: 449_000, months: 6 },
  "12months": { amount: 799_000, months: 12 },
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
  return Boolean(
    process.env.MIDTRANS_SERVER_KEY && process.env.MIDTRANS_CLIENT_KEY
  )
}

export function getMidtransClientKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ??
    process.env.MIDTRANS_CLIENT_KEY
  )
}

export function isMidtransProduction(): boolean {
  return process.env.MIDTRANS_IS_PRODUCTION === "true"
}

export function getSnapClient() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
  const clientKey = process.env.MIDTRANS_CLIENT_KEY

  if (!serverKey || !clientKey) {
    throw new Error("Midtrans credentials are not configured")
  }

  return new midtransClient.Snap({
    isProduction: isMidtransProduction(),
    serverKey,
    clientKey,
  })
}

export function verifyNotificationSignature(
  payload: MidtransNotificationPayload
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
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
