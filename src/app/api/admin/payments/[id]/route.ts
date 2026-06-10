import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { getPaymentById } from "@/lib/billing/payment-service"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requirePlatformApiPermission(request, "payments:read")
  if (!isPlatformApiUser(authResult)) return authResult

  const { id } = await params
  const payment = await getPaymentById(id)

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 })
  }

  return NextResponse.json({ data: payment })
}
