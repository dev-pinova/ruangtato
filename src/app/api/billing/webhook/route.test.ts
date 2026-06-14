import { createHash } from "crypto"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// The webhook delegates activation to billing-activation and non-success
// persistence to payment-service. We mock those boundaries and assert the
// route's HTTP contract + which helper it calls for each Midtrans status.
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

const SERVER_KEY = "test-server-key"
process.env.MIDTRANS_SERVER_KEY = SERVER_KEY
process.env.MIDTRANS_CLIENT_KEY = "test-client-key"

function sign(orderId: string, statusCode: string, grossAmount: string): string {
  return createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${SERVER_KEY}`)
    .digest("hex")
}

function buildPayload(input: {
  orderId?: string
  statusCode?: string
  grossAmount: string
  transactionStatus: string
  fraudStatus?: string
  customField1?: string
  signatureOverride?: string
}): Record<string, unknown> {
  const orderId = input.orderId ?? "RT-test-001"
  const statusCode = input.statusCode ?? "200"
  const payload: Record<string, unknown> = {
    order_id: orderId,
    status_code: statusCode,
    gross_amount: input.grossAmount,
    transaction_status: input.transactionStatus,
    fraud_status: input.fraudStatus,
    custom_field1: input.customField1,
    transaction_id: "txn-001",
    payment_type: "qris",
    signature_key:
      input.signatureOverride ?? sign(orderId, statusCode, input.grossAmount),
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
      grossAmount: "449000",
      transactionStatus: "settlement",
      customField1: META_6M,
      signatureOverride: "deadbeef",
    })
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(401)
    expect(activateMock).not.toHaveBeenCalled()
    expect(recordMock).not.toHaveBeenCalled()
  })

  it("returns 503 when Midtrans is not configured", async () => {
    vi.stubEnv("MIDTRANS_SERVER_KEY", "")
    vi.stubEnv("MIDTRANS_CLIENT_KEY", "")
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "settlement",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(503)
  })

  it("returns 400 for an unparseable payload", async () => {
    const res = await POST(makeRequest("{not-valid-json"))
    expect(res.status).toBe(400)
  })

  it("activates via billing-activation on a valid settlement", async () => {
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "settlement",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.message).toBe("Transaction processed successfully")
    expect(activateMock).toHaveBeenCalledTimes(1)
    expect(recordMock).not.toHaveBeenCalled()
  })

  it("activates on capture with fraud_status=accept", async () => {
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "capture",
      fraudStatus: "accept",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(200)
    expect(activateMock).toHaveBeenCalledTimes(1)
  })

  it("does NOT activate on capture with fraud_status=challenge", async () => {
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "capture",
      fraudStatus: "challenge",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.message).toBe("Status 'capture' logged")
    expect(activateMock).not.toHaveBeenCalled()
    // Non-success path persists the latest status without activating.
    expect(recordMock).toHaveBeenCalledTimes(1)
  })

  it("acknowledges (200) but does not crash when activation is rejected", async () => {
    activateMock.mockRejectedValueOnce(
      new BillingActivationError("Amount mismatch", 400),
    )
    const payload = buildPayload({
      grossAmount: "99000",
      transactionStatus: "settlement",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const json = await res.json()

    // 200 so Midtrans stops retrying a permanently-invalid notification.
    expect(res.status).toBe(200)
    expect(json.error).toBe("Amount mismatch")
  })

  it("returns 500 on an unexpected activation failure (so Midtrans retries)", async () => {
    activateMock.mockRejectedValueOnce(new Error("db down"))
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "settlement",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(500)
  })

  it("records a non-success (deny) notification without activating", async () => {
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "deny",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.message).toBe("Status 'deny' logged")
    expect(activateMock).not.toHaveBeenCalled()
    expect(recordMock).toHaveBeenCalledTimes(1)
  })
})
