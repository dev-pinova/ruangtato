import { createHash } from "crypto"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { activateMock, recordMock, BillingActivationError } = vi.hoisted(() => {
  class BillingActivationError extends Error {
    status: number
    constructor(message: string, status = 400) {
      super(message)
      this.name = "BillingActivationError"
      this.status = status
    }
  }
  return {
    activateMock: vi.fn(),
    recordMock: vi.fn(),
    BillingActivationError,
  }
})

vi.mock("@/lib/billing/billing-activation", () => ({
  activateFromWebhookNotification: activateMock,
  BillingActivationError,
}))

vi.mock("@/lib/billing/payment-service", () => ({
  recordPaymentEvent: recordMock,
}))

const MERCHANT_CODE = "DS0001"
const API_KEY = "test-api-key"
process.env.DUITKU_MERCHANT_CODE = MERCHANT_CODE
process.env.DUITKU_API_KEY = API_KEY

function sign(merchantCode: string, amount: string, orderId: string): string {
  return createHash("md5")
    .update(`${merchantCode}${amount}${orderId}${API_KEY}`)
    .digest("hex")
}

function buildPayload(input: {
  orderId?: string
  amount: string
  resultCode?: string
  additionalParam?: string
  signatureOverride?: string
}): Record<string, unknown> {
  const orderId = input.orderId ?? "RT-test-001"
  const resultCode = input.resultCode ?? "00"
  const payload: Record<string, unknown> = {
    merchantCode: MERCHANT_CODE,
    amount: input.amount,
    merchantOrderId: orderId,
    productDetail: "Paket Langganan 6months",
    additionalParam: input.additionalParam,
    paymentCode: "VC",
    resultCode,
    reference: "DuitkuRef123",
    signature:
      input.signatureOverride ?? sign(MERCHANT_CODE, input.amount, orderId),
  }
  return payload
}

function makeRequest(payload: Record<string, unknown> | string): Request {
  return new Request("http://localhost/api/billing/webhook", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  })
}

const META_6M = JSON.stringify({ studioId: "studio-1", planType: "6months" })

// Import after mocks/env are configured.
import { POST } from "./route"

describe("POST /api/billing/webhook", () => {
  beforeEach(() => {
    activateMock.mockReset()
    recordMock.mockReset()
    activateMock.mockResolvedValue({ studioId: "studio-1", planType: "6months" })
    recordMock.mockResolvedValue(undefined)
    vi.spyOn(console, "log").mockImplementation(() => {})
    vi.spyOn(console, "warn").mockImplementation(() => {})
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it("rejects an invalid signature with 401", async () => {
    const payload = buildPayload({
      amount: "749000",
      resultCode: "00",
      additionalParam: META_6M,
      signatureOverride: "deadbeef",
    })
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(401)
    expect(await res.text()).toBe("Invalid signature")
    expect(activateMock).not.toHaveBeenCalled()
    expect(recordMock).not.toHaveBeenCalled()
  })

  it("returns 503 when Duitku is not configured", async () => {
    vi.stubEnv("DUITKU_MERCHANT_CODE", "")
    vi.stubEnv("DUITKU_API_KEY", "")
    const payload = buildPayload({
      amount: "749000",
      resultCode: "00",
      additionalParam: META_6M,
    })
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(503)
    expect(await res.text()).toBe("Duitku not configured")
  })

  it("returns 400 for an unparseable payload", async () => {
    const res = await POST(makeRequest("{not-valid-json"))
    expect(res.status).toBe(400)
    expect(await res.text()).toBe("Invalid payload")
  })

  it("activates via billing-activation on a valid resultCode=00", async () => {
    const payload = buildPayload({
      amount: "749000",
      resultCode: "00",
      additionalParam: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const text = await res.text()

    expect(res.status).toBe(200)
    expect(text).toBe("OK")
    expect(activateMock).toHaveBeenCalledTimes(1)
    expect(recordMock).not.toHaveBeenCalled()
  })

  it("acknowledges (200) with OK but does not crash when activation is rejected", async () => {
    activateMock.mockRejectedValueOnce(
      new BillingActivationError("Amount mismatch", 400),
    )
    const payload = buildPayload({
      amount: "99000",
      resultCode: "00",
      additionalParam: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const text = await res.text()

    // 200 OK so Duitku stops retrying a permanently-invalid notification.
    expect(res.status).toBe(200)
    expect(text).toBe("OK")
  })

  it("returns 500 on an unexpected activation failure (so Duitku retries)", async () => {
    activateMock.mockRejectedValueOnce(new Error("db down"))
    const payload = buildPayload({
      amount: "749000",
      resultCode: "00",
      additionalParam: META_6M,
    })
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(500)
    expect(await res.text()).toBe("Failed to process webhook")
  })

  it("records a non-success (01 pending) notification without activating, returning OK", async () => {
    const payload = buildPayload({
      amount: "749000",
      resultCode: "01",
      additionalParam: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const text = await res.text()

    expect(res.status).toBe(200)
    expect(text).toBe("OK")
    expect(activateMock).not.toHaveBeenCalled()
    expect(recordMock).toHaveBeenCalledTimes(1)
  })
})
