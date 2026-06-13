import { describe, expect, it, vi, beforeEach } from "vitest"

import {
  activatePaidOrder,
  BillingActivationError,
  validatePaidOrder,
} from "./billing-activation"
import {
  activateSubscription,
  recordInvoice,
  setStudioActiveIfNotSuspended,
} from "../studio/studio-service"
import { recordPaymentEvent } from "./payment-service"

// Mock the persistence layers so we never hit the database.
vi.mock("../studio/studio-service", () => ({
  recordInvoice: vi.fn(),
  activateSubscription: vi.fn(),
  setStudioActiveIfNotSuspended: vi.fn(),
  getSubscriptionForStudio: vi.fn(),
  isActivePaidSubscription: vi.fn(),
}))

vi.mock("./payment-service", () => ({
  recordPaymentEvent: vi.fn(),
}))

// getDb().transaction(cb) should just invoke the callback with a stub tx.
const txStub = {}
vi.mock("@/db", () => ({
  getDb: () => ({
    transaction: (cb: (tx: unknown) => unknown) => cb(txStub),
  }),
}))

const validInput = {
  orderId: "ORDER-123",
  grossAmount: "99000",
  customField1: JSON.stringify({ studioId: "studio-1", planType: "1month" }),
  paymentStatus: { transaction_status: "settlement" as const },
}

describe("validatePaidOrder", () => {
  it("rejects payments that are not completed", () => {
    expect(() =>
      validatePaidOrder({ ...validInput, paymentStatus: { transaction_status: "pending" } }),
    ).toThrowError(new BillingActivationError("Payment not completed", 400))
  })

  it("rejects a capture that has not passed fraud review", () => {
    expect(() =>
      validatePaidOrder({
        ...validInput,
        paymentStatus: { transaction_status: "capture", fraud_status: "challenge" },
      }),
    ).toThrowError(new BillingActivationError("Payment not completed", 400))
  })

  it("accepts a capture that passed fraud review", () => {
    const result = validatePaidOrder({
      ...validInput,
      paymentStatus: { transaction_status: "capture", fraud_status: "accept" },
    })
    expect(result).toEqual({ studioId: "studio-1", planType: "1month", months: 1, amount: 99000 })
  })

  it("rejects invalid metadata", () => {
    expect(() =>
      validatePaidOrder({ ...validInput, customField1: "invalid-json" }),
    ).toThrowError(new BillingActivationError("Invalid payment metadata", 400))
  })

  it("rejects when studioId does not match expectedStudioId", () => {
    expect(() =>
      validatePaidOrder({ ...validInput, expectedStudioId: "studio-2" }),
    ).toThrowError(
      new BillingActivationError("Order does not belong to this studio", 403),
    )
  })

  it("rejects when gross amount does not match the plan", () => {
    expect(() =>
      validatePaidOrder({ ...validInput, grossAmount: "1000" }),
    ).toThrowError(new BillingActivationError("Amount mismatch", 400))
  })
})

describe("activatePaidOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("records payment, invoice, subscription and studio status atomically", async () => {
    const result = await activatePaidOrder(validInput)

    expect(result).toEqual({ studioId: "studio-1", planType: "1month" })

    expect(recordPaymentEvent).toHaveBeenCalledTimes(1)
    expect(recordPaymentEvent).toHaveBeenCalledWith(validInput.paymentStatus, txStub)

    expect(recordInvoice).toHaveBeenCalledTimes(1)
    expect(recordInvoice).toHaveBeenCalledWith(
      expect.objectContaining({
        studioId: "studio-1",
        midtransOrderId: "ORDER-123",
        planType: "1month",
        amount: 99000,
        status: "paid",
      }),
      txStub,
    )

    expect(activateSubscription).toHaveBeenCalledTimes(1)
    expect(activateSubscription).toHaveBeenCalledWith(
      {
        studioId: "studio-1",
        planType: "1month",
        midtransOrderId: "ORDER-123",
        months: 1,
      },
      txStub,
    )

    expect(setStudioActiveIfNotSuspended).toHaveBeenCalledWith("studio-1", txStub)
  })

  it("does not persist anything when validation fails", async () => {
    await expect(
      activatePaidOrder({ ...validInput, grossAmount: "1000" }),
    ).rejects.toThrowError(new BillingActivationError("Amount mismatch", 400))

    expect(recordPaymentEvent).not.toHaveBeenCalled()
    expect(recordInvoice).not.toHaveBeenCalled()
    expect(activateSubscription).not.toHaveBeenCalled()
    expect(setStudioActiveIfNotSuspended).not.toHaveBeenCalled()
  })
})
