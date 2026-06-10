import { NextResponse } from "next/server"

import {
  BillingActivationError,
  confirmOrderPayment,
} from "@/lib/billing/billing-activation"
import { isMidtransConfigured } from "@/lib/billing/midtrans"
import { auth } from "@/lib/auth/auth"
import { getStudioForUser, getStudioSuspendedFlagForUser } from "@/lib/studio/studio-service"

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

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : ""
  const planType = typeof body.planType === "string" ? body.planType.trim() : ""

  if (!orderId || !planType) {
    return NextResponse.json(
      { error: "orderId and planType are required" },
      { status: 400 },
    )
  }

  try {
    const result = await confirmOrderPayment({
      orderId,
      planType,
      studioId: studio.id,
    })

    return NextResponse.json({
      message: "Subscription activated",
      subscription: result,
    })
  } catch (error) {
    if (error instanceof BillingActivationError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("Payment confirmation failed:", error)
    return NextResponse.json({ error: "Activation failed" }, { status: 500 })
  }
}
