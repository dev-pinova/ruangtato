import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin-auth"
import { listPayments, type PaymentListSort } from "@/lib/payment-service"

const SORT_VALUES: PaymentListSort[] = [
  "newest",
  "oldest",
  "amount_desc",
  "amount_asc",
]

export async function GET(request: Request) {
  const authResult = await requirePlatformApiPermission(request, "payments:read")
  if (!isPlatformApiUser(authResult)) return authResult

  const { searchParams } = new URL(request.url)
  const sortParam = searchParams.get("sort")
  const sort = SORT_VALUES.includes(sortParam as PaymentListSort)
    ? (sortParam as PaymentListSort)
    : "newest"

  const result = await listPayments({
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "20"),
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    studioId: searchParams.get("studioId") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    sort,
  })

  return NextResponse.json({
    data: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  })
}
