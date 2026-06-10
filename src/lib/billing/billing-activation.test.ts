import { describe, expect, it, vi, beforeEach } from "vitest"
import { activatePaidOrder, BillingActivationError } from "./billing-activation"
import { recordInvoice, activateSubscription } from "../studio/studio-service"

// Mock the studio service so we don't hit the database
vi.mock("../studio/studio-service", () => ({
  recordInvoice: vi.fn(),
  activateSubscription: vi.fn(),
}))

describe("activatePaidOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should throw error if payment is not successful", async () => {
    const input = {
      orderId: "ORDER-123",
      grossAmount: "99000",
      customField1: JSON.stringify({ studioId: "studio-1", planType: "1month" }),
      paymentStatus: { transaction_status: "pending" },
    }

    await expect(activatePaidOrder(input)).rejects.toThrowError(
      new BillingActivationError("Payment not completed", 400)
    )
  })

  it("should throw error if customField1 is invalid metadata", async () => {
    const input = {
      orderId: "ORDER-123",
      grossAmount: "99000",
      customField1: "invalid-json",
      paymentStatus: { transaction_status: "settlement" },
    }

    await expect(activatePaidOrder(input)).rejects.toThrowError(
      new BillingActivationError("Invalid payment metadata", 400)
    )
  })

  it("should throw error if studioId does not match expectedStudioId", async () => {
    const input = {
      orderId: "ORDER-123",
      grossAmount: "99000",
      customField1: JSON.stringify({ studioId: "studio-1", planType: "1month" }),
      paymentStatus: { transaction_status: "settlement" },
      expectedStudioId: "studio-2",
    }

    await expect(activatePaidOrder(input)).rejects.toThrowError(
      new BillingActivationError("Order does not belong to this studio", 403)
    )
  })

  it("should throw error if grossAmount does not match plan amount", async () => {
    const input = {
      orderId: "ORDER-123",
      grossAmount: "1000", // Plan is 99000
      customField1: JSON.stringify({ studioId: "studio-1", planType: "1month" }),
      paymentStatus: { transaction_status: "settlement" },
    }

    await expect(activatePaidOrder(input)).rejects.toThrowError(
      new BillingActivationError("Amount mismatch", 400)
    )
  })

  it("should successfully activate subscription and record invoice", async () => {
    const input = {
      orderId: "ORDER-123",
      grossAmount: "99000",
      customField1: JSON.stringify({ studioId: "studio-1", planType: "1month" }),
      paymentStatus: { transaction_status: "settlement" },
    }

    const result = await activatePaidOrder(input)

    expect(result).toEqual({ studioId: "studio-1", planType: "1month" })

    // Verify side effects
    expect(recordInvoice).toHaveBeenCalledTimes(1)
    expect(recordInvoice).toHaveBeenCalledWith(
      expect.objectContaining({
        studioId: "studio-1",
        midtransOrderId: "ORDER-123",
        planType: "1month",
        amount: 99000,
        status: "paid",
      })
    )

    expect(activateSubscription).toHaveBeenCalledTimes(1)
    expect(activateSubscription).toHaveBeenCalledWith({
      studioId: "studio-1",
      planType: "1month",
      midtransOrderId: "ORDER-123",
      months: 1,
    })
  })
})
