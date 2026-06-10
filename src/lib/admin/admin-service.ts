import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  lte,
  or,
  sql,
} from "drizzle-orm"

import { db, isDatabaseConfigured } from "@/db"
import { user } from "@/db/auth-schema"
import {
  invoices,
  studioMemberships,
  studios,
  subscriptions,
} from "@/db/schema"
import { getSubscriptionPlanLabel } from "@/lib/billing/billing-plans"

export type TenantListSort =
  | "newest"
  | "oldest"
  | "expiry_asc"
  | "expiry_desc"
  | "status"

export type ListTenantsInput = {
  page?: number
  limit?: number
  q?: string
  studioStatus?: string
  subscriptionStatus?: string
  planType?: string
  city?: string
  registeredFrom?: string
  registeredTo?: string
  sort?: TenantListSort
}

export type AdminTenantRow = {
  id: string
  slug: string
  name: string
  city: string | null
  waNumber: string | null
  status: string
  isPublished: boolean
  isTrusted: boolean
  createdAt: string
  ownerName: string | null
  ownerEmail: string | null
  subscriptionStatus: string | null
  planType: string | null
  planLabel: string | null
  expiresAt: string | null
}

export type AdminTenantDetail = AdminTenantRow & {
  description: string | null
  viewCount: number
  clickCount: number
  lastPayment: {
    orderId: string
    amount: number
    status: string
    paidAt: string | null
    createdAt: string
  } | null
}

function mapTenantRow(row: {
  studio: typeof studios.$inferSelect
  ownerName: string | null
  ownerEmail: string | null
  subscriptionStatus: string | null
  planType: string | null
  expiresAt: Date | null
}): AdminTenantRow {
  const planLabel = row.planType
    ? getSubscriptionPlanLabel(row.planType).name
    : null

  return {
    id: row.studio.id,
    slug: row.studio.slug,
    name: row.studio.name,
    city: row.studio.city,
    waNumber: row.studio.waNumber,
    status: row.studio.status,
    isPublished: row.studio.isPublished,
    isTrusted: row.studio.isTrusted,
    createdAt: row.studio.createdAt.toISOString(),
    ownerName: row.ownerName,
    ownerEmail: row.ownerEmail,
    subscriptionStatus: row.subscriptionStatus,
    planType: row.planType,
    planLabel,
    expiresAt: row.expiresAt?.toISOString() ?? null,
  }
}

export async function listTenants(input: ListTenantsInput = {}) {
  if (!isDatabaseConfigured() || !db) {
    return { data: [] as AdminTenantRow[], total: 0, page: 1, limit: 20 }
  }

  const page = Math.max(1, input.page ?? 1)
  const limit = Math.min(100, Math.max(1, input.limit ?? 20))
  const offset = (page - 1) * limit
  const q = input.q?.trim()

  const conditions = []

  if (q) {
    const pattern = `%${q}%`
    conditions.push(
      or(
        ilike(studios.name, pattern),
        ilike(studios.slug, pattern),
        ilike(studios.waNumber, pattern),
        ilike(studios.city, pattern),
        ilike(user.name, pattern),
        ilike(user.email, pattern),
      ),
    )
  }

  if (input.studioStatus) {
    conditions.push(eq(studios.status, input.studioStatus))
  }

  if (input.subscriptionStatus) {
    conditions.push(eq(subscriptions.status, input.subscriptionStatus))
  }

  if (input.planType) {
    conditions.push(eq(subscriptions.planType, input.planType))
  }

  if (input.city) {
    conditions.push(eq(studios.city, input.city))
  }

  if (input.registeredFrom) {
    conditions.push(gte(studios.createdAt, new Date(input.registeredFrom)))
  }

  if (input.registeredTo) {
    const end = new Date(input.registeredTo)
    end.setHours(23, 59, 59, 999)
    conditions.push(lte(studios.createdAt, end))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const orderBy = (() => {
    switch (input.sort) {
      case "oldest":
        return asc(studios.createdAt)
      case "expiry_asc":
        return asc(subscriptions.expiresAt)
      case "expiry_desc":
        return desc(subscriptions.expiresAt)
      case "status":
        return asc(studios.status)
      case "newest":
      default:
        return desc(studios.createdAt)
    }
  })()

  const baseQuery = db
    .select({
      studio: studios,
      ownerName: user.name,
      ownerEmail: user.email,
      subscriptionStatus: subscriptions.status,
      planType: subscriptions.planType,
      expiresAt: subscriptions.expiresAt,
    })
    .from(studios)
    .leftJoin(
      studioMemberships,
      and(
        eq(studioMemberships.studioId, studios.id),
        eq(studioMemberships.isPrimaryOwner, true),
      ),
    )
    .leftJoin(user, eq(user.id, studioMemberships.userId))
    .leftJoin(subscriptions, eq(subscriptions.studioId, studios.id))
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)

  const countQuery = db
    .select({ total: count() })
    .from(studios)
    .leftJoin(
      studioMemberships,
      and(
        eq(studioMemberships.studioId, studios.id),
        eq(studioMemberships.isPrimaryOwner, true),
      ),
    )
    .leftJoin(user, eq(user.id, studioMemberships.userId))
    .leftJoin(subscriptions, eq(subscriptions.studioId, studios.id))
    .where(whereClause)

  const [rows, [totalRow]] = await Promise.all([baseQuery, countQuery])

  return {
    data: rows.map(mapTenantRow),
    total: Number(totalRow?.total ?? 0),
    page,
    limit,
  }
}

export async function getTenantById(studioId: string): Promise<AdminTenantDetail | null> {
  if (!isDatabaseConfigured() || !db) return null

  const [row] = await db
    .select({
      studio: studios,
      ownerName: user.name,
      ownerEmail: user.email,
      subscriptionStatus: subscriptions.status,
      planType: subscriptions.planType,
      expiresAt: subscriptions.expiresAt,
    })
    .from(studios)
    .leftJoin(
      studioMemberships,
      and(
        eq(studioMemberships.studioId, studios.id),
        eq(studioMemberships.isPrimaryOwner, true),
      ),
    )
    .leftJoin(user, eq(user.id, studioMemberships.userId))
    .leftJoin(subscriptions, eq(subscriptions.studioId, studios.id))
    .where(eq(studios.id, studioId))
    .limit(1)

  if (!row) return null

  const [lastInvoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.studioId, studioId))
    .orderBy(desc(invoices.createdAt))
    .limit(1)

  const base = mapTenantRow(row)

  return {
    ...base,
    description: row.studio.description,
    viewCount: row.studio.viewCount,
    clickCount: row.studio.clickCount,
    lastPayment: lastInvoice
      ? {
          orderId: lastInvoice.midtransOrderId,
          amount: lastInvoice.amount,
          status: lastInvoice.status,
          paidAt: lastInvoice.paidAt?.toISOString() ?? null,
          createdAt: lastInvoice.createdAt.toISOString(),
        }
      : null,
  }
}

export async function listTenantCities(): Promise<string[]> {
  if (!isDatabaseConfigured() || !db) return []

  const rows = await db
    .selectDistinct({ city: studios.city })
    .from(studios)
    .where(sql`${studios.city} IS NOT NULL AND ${studios.city} <> ''`)
    .orderBy(asc(studios.city))

  return rows.map((row) => row.city!).filter(Boolean)
}

export type AdminStudioRow = {
  id: string
  slug: string
  name: string
  city: string | null
  artist: string | null
  tags: string[] | null
  viewCount: number
  clickCount: number
  isTrusted: boolean
  isPublished: boolean
  status: string
  createdAt: string
}

export type ListStudiosInput = {
  page?: number
  limit?: number
  q?: string
  status?: string
  sort?: "newest" | "oldest" | "views" | "clicks"
}

export async function listStudios(input: ListStudiosInput = {}) {
  if (!isDatabaseConfigured() || !db) {
    return { data: [] as AdminStudioRow[], total: 0, page: 1, limit: 20 }
  }

  const page = Math.max(1, input.page ?? 1)
  const limit = Math.min(100, Math.max(1, input.limit ?? 20))
  const offset = (page - 1) * limit
  const q = input.q?.trim()

  const conditions = []

  if (q) {
    const pattern = `%${q}%`
    conditions.push(
      or(
        ilike(studios.name, pattern),
        ilike(studios.slug, pattern),
        ilike(studios.city, pattern),
        ilike(studios.artist, pattern)
      )
    )
  }

  if (input.status && input.status !== "all") {
    conditions.push(eq(studios.status, input.status))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const orderBy = (() => {
    switch (input.sort) {
      case "oldest":
        return asc(studios.createdAt)
      case "views":
        return desc(studios.viewCount)
      case "clicks":
        return desc(studios.clickCount)
      case "newest":
      default:
        return desc(studios.createdAt)
    }
  })()

  const baseQuery = db
    .select()
    .from(studios)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)

  const countQuery = db
    .select({ total: count() })
    .from(studios)
    .where(whereClause)

  const [rows, [totalRow]] = await Promise.all([baseQuery, countQuery])

  return {
    data: rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      city: row.city,
      artist: row.artist,
      tags: row.tags,
      viewCount: row.viewCount,
      clickCount: row.clickCount,
      isTrusted: row.isTrusted,
      isPublished: row.isPublished,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    })),
    total: Number(totalRow?.total ?? 0),
    page,
    limit,
  }
}

export type AdminUserRow = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  platformRole: string | null
  status: string
  createdAt: string
}

export type ListUsersInput = {
  page?: number
  limit?: number
  q?: string
  status?: string
  platformRole?: string
}

export async function listUsers(input: ListUsersInput = {}) {
  if (!isDatabaseConfigured() || !db) {
    return { data: [] as AdminUserRow[], total: 0, page: 1, limit: 20 }
  }

  const page = Math.max(1, input.page ?? 1)
  const limit = Math.min(100, Math.max(1, input.limit ?? 20))
  const offset = (page - 1) * limit
  const q = input.q?.trim()

  const conditions = []

  if (q) {
    const pattern = `%${q}%`
    conditions.push(
      or(
        ilike(user.name, pattern),
        ilike(user.email, pattern)
      )
    )
  }

  if (input.status && input.status !== "all") {
    conditions.push(eq(user.status, input.status))
  }

  if (input.platformRole && input.platformRole !== "all") {
    if (input.platformRole === "user") {
      conditions.push(sql`${user.platformRole} IS NULL OR ${user.platformRole} = ''`)
    } else {
      conditions.push(eq(user.platformRole, input.platformRole))
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const baseQuery = db
    .select()
    .from(user)
    .where(whereClause)
    .orderBy(desc(user.createdAt))
    .limit(limit)
    .offset(offset)

  const countQuery = db
    .select({ total: count() })
    .from(user)
    .where(whereClause)

  const [rows, [totalRow]] = await Promise.all([baseQuery, countQuery])

  return {
    data: rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      image: row.image,
      platformRole: row.platformRole,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    })),
    total: Number(totalRow?.total ?? 0),
    page,
    limit,
  }
}


