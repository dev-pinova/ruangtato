import { NextResponse } from "next/server"

import {
  BillingActivationError,
  confirmOrderPayment,
} from "@/lib/billing/billing-activation"
import { isMidtransConfigured } from "@/lib/billing/midtrans"
import { auth } from "@/lib/auth/auth"
import {
  getStudioForUser,
  getStudioSuspendedFlagForUser,
  getSubscriptionForStudio,
} from "@/lib/studio/studio-service"
import { parseJsonBody, z } from "@/lib/validation"

const ConfirmSchema = z.object({
  orderId: z.string().trim().min(1, "orderId is required").max(100),
  planType: z.string().trim().min(1, "planType is required").max(40),
})

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isMidtransConfigured()) {
    return NextResponse.json(
      { error: "Midtrans not configured" },
      { status: 503 },
    )
  }

  if (await getStudioSuspendedFlagForUser(session.user.id)) {
    return NextResponse.json({ error: "Account suspended", suspended: true }, { status: 403 })
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 })
  }

  const parsed = await parseJsonBody(request, ConfirmSchema)
  if (!parsed.ok) return parsed.response
  const { orderId, planType } = parsed.data

  try {
    // Verification only. Activation happens exclusively via the Midtrans
    // webhook; this endpoint just reports the current verified status.
    const result = await confirmOrderPayment({
      orderId,
      planType,
      studioId: studio.id,
    })

    // Fetch current subscription to include expiresAt in the response
    const subscription = await getSubscriptionForStudio(studio.id)

    return NextResponse.json({
      message: result.activated
        ? "Langganan aktif."
        : "Pembayaran sedang diverifikasi. Status akan diperbarui otomatis.",
      status: {
        ...result,
        subscriptionExpiresAt: subscription?.expiresAt?.toISOString() ?? null,
      },
    })
  } catch (error) {
    if (error instanceof BillingActivationError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("Payment confirmation failed:", error)
    return NextResponse.json({ error: "Activation failed" }, { status: 500 })
  }
}
