import { createHash } from "crypto"

export const PLAN_CATALOG: Record<
  string,
  { amount: number; months: number }
> = {
  "1month": { amount: 149_000, months: 1 },
  "3months": { amount: 399_000, months: 3 },
  "6months": { amount: 749_000, months: 6 },
  "12months": { amount: 1_299_000, months: 12 },
}

export type DuitkuNotificationPayload = {
  merchantCode?: string
  amount?: string | number
  merchantOrderId?: string
  productDetail?: string
  additionalParam?: string
  paymentCode?: string
  resultCode?: string
  reference?: string
  signature?: string
}

export function isDuitkuConfigured(): boolean {
  const merchantCode = process.env.DUITKU_MERCHANT_CODE?.replace(/^["']|["']$/g, "")
  const apiKey = process.env.DUITKU_API_KEY?.replace(/^["']|["']$/g, "")
  return Boolean(merchantCode && apiKey)
}

export function isDuitkuProduction(): boolean {
  return process.env.DUITKU_IS_PRODUCTION === "true"
}

function getDuitkuCredentials() {
  const merchantCode = process.env.DUITKU_MERCHANT_CODE?.replace(/^["']|["']$/g, "")
  const apiKey = process.env.DUITKU_API_KEY?.replace(/^["']|["']$/g, "")

  if (!merchantCode || !apiKey) {
    throw new Error("Duitku credentials are not configured")
  }

  return { merchantCode, apiKey }
}

const SANDBOX_BASE_URL = "https://sandbox.duitku.com/webapi/api/merchant"
const PRODUCTION_BASE_URL = "https://passport.duitku.com/webapi/api/merchant"

function getBaseUrl() {
  return isDuitkuProduction() ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL
}

export type CreateInvoiceInput = {
  paymentAmount: number
  merchantOrderId: string
  productDetails: string
  email: string
  additionalParam?: string
}

export type CreateInvoiceResponse = {
  paymentUrl?: string
  reference?: string
  statusCode?: string
  statusMessage?: string
}

export async function createDuitkuInvoice(input: CreateInvoiceInput): Promise<CreateInvoiceResponse> {
  const { merchantCode, apiKey } = getDuitkuCredentials()
  const baseUrl = getBaseUrl()

  const signatureSource = `${merchantCode}${input.merchantOrderId}${input.paymentAmount}${apiKey}`
  const signature = createHash("md5").update(signatureSource).digest("hex")

  const callbackUrl = process.env.DUITKU_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/billing/webhook`
  const returnUrl = process.env.DUITKU_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success`

  const payload = {
    merchantCode,
    paymentAmount: input.paymentAmount,
    merchantOrderId: input.merchantOrderId,
    productDetails: input.productDetails,
    email: input.email,
    callbackUrl,
    returnUrl,
    signature,
    additionalParam: input.additionalParam,
  }

  const response = await fetch(`${baseUrl}/v2/inquiry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Duitku Inquiry failed with status ${response.status}`)
  }

  return response.json() as Promise<CreateInvoiceResponse>
}

export type DuitkuTransactionStatus = {
  merchantOrderId?: string
  statusCode?: string
  amount?: string
  reference?: string
  statusMessage?: string
}

export async function fetchTransactionStatus(
  orderId: string,
): Promise<DuitkuTransactionStatus> {
  const { merchantCode, apiKey } = getDuitkuCredentials()
  const baseUrl = getBaseUrl()

  const signatureSource = `${merchantCode}${orderId}${apiKey}`
  const signature = createHash("md5").update(signatureSource).digest("hex")

  const payload = {
    merchantCode,
    merchantOrderId: orderId,
    signature,
  }

  const response = await fetch(`${baseUrl}/transactionStatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Duitku transaction status failed with status ${response.status}`)
  }

  return response.json() as Promise<DuitkuTransactionStatus>
}

export type PaymentOrderMetadata = {
  studioId: string
  planType: string
}

export function parsePaymentMetadata(
  additionalParam: string | undefined,
): PaymentOrderMetadata | null {
  if (!additionalParam) return null

  try {
    const parsed = JSON.parse(additionalParam) as {
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
  payload: DuitkuNotificationPayload
): boolean {
  const { apiKey } = getDuitkuCredentials()
  const { merchantCode, amount, merchantOrderId, signature } = payload

  if (!merchantCode || amount === undefined || !merchantOrderId || !signature) {
    return false
  }

  const amountStr = String(amount)
  const expectedSource = `${merchantCode}${amountStr}${merchantOrderId}${apiKey}`
  const expected = createHash("md5")
    .update(expectedSource)
    .digest("hex")

  return expected.toLowerCase() === signature.toLowerCase()
}

export function isSuccessfulPayment(payload: DuitkuNotificationPayload | DuitkuTransactionStatus): boolean {
  const code = ("resultCode" in payload 
    ? (payload as DuitkuNotificationPayload).resultCode 
    : (payload as DuitkuTransactionStatus).statusCode) ?? ""
  return code === "00"
}

export function getPlanAmount(planType: string): number | null {
  return PLAN_CATALOG[planType]?.amount ?? null
}
