import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin-auth"
import { listTenantCities, listTenants, type TenantListSort } from "@/lib/admin-service"

const SORT_VALUES: TenantListSort[] = [
  "newest",
  "oldest",
  "expiry_asc",
  "expiry_desc",
  "status",
]

export async function GET(request: Request) {
  const authResult = await requirePlatformApiPermission(request, "tenants:read")
  if (!isPlatformApiUser(authResult)) return authResult

  const { searchParams } = new URL(request.url)
  const sortParam = searchParams.get("sort")
  const sort = SORT_VALUES.includes(sortParam as TenantListSort)
    ? (sortParam as TenantListSort)
    : "newest"

  const result = await listTenants({
    page: Number(searchParams.get("page") ?? "1"),
    limit: Number(searchParams.get("limit") ?? "20"),
    q: searchParams.get("q") ?? undefined,
    studioStatus: searchParams.get("studioStatus") ?? undefined,
    subscriptionStatus: searchParams.get("subscriptionStatus") ?? undefined,
    planType: searchParams.get("planType") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    registeredFrom: searchParams.get("registeredFrom") ?? undefined,
    registeredTo: searchParams.get("registeredTo") ?? undefined,
    sort,
  })

  const cities = searchParams.get("includeCities") === "1"
    ? await listTenantCities()
    : undefined

  return NextResponse.json({
    data: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
    cities,
  })
}
