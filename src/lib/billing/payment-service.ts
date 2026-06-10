import { and, asc, count, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm"

import { db, getDb, isDatabaseConfigured } from "@/db"
import { payments, studios, subscriptions } from "@/db/schema"
import {
  isSuccessfulPayment,
  parsePaymentMetadata,
  type MidtransNotificationPayload,
} from "@/lib/billing/midtrans"
import { getSubscriptionPlanLabel } from "@/lib/billing/billing-plans"

const STATUS_RANK: Record<string, number> = {
  pending: 1,
  deny: 2,
  cancel: 2,
  expire: 2,
  failure: 2,
  capture: 3,
  settlement: 4,
}

function normalizeTransactionStatus(payload: MidtransNotificationPayload): string {
  const status = payload.transaction_status ?? "pending"
  if (isSuccessfulPayment(payload)) return "success"
  if (status === "expire") return "expired"
  if (status === "deny" || status === "cancel" || status === "failure") return "failed"
  return "pending"
}

function shouldReplaceStatus(current: string | null | undefined, incoming: string): boolean {
  if (!current) return true
  if (current === "success") return incoming === "success"
  const currentRank = STATUS_RANK[current] ?? 0
  const incomingRank = STATUS_RANK[incoming] ?? 0
  return incomingRank >= currentRank
}

export async function recordPaymentEvent(payload: MidtransNotificationPayload) {
  const d = getDb()

  const orderId = payload.order_id
  if (!orderId) throw new Error("Missing order_id")

  const metadata = parsePaymentMetadata(payload.custom_field1)
  if (!metadata) throw new Error("Invalid payment metadata")

  const amount = Number(payload.gross_amount)
  if (!Number.isFinite(amount)) throw new Error("Invalid gross_amount")

  const normalizedStatus = normalizeTransactionStatus(payload)
  const paidAt = normalizedStatus === "success" ? new Date() : null

  const [existing] = await d
    .select({ transactionStatus: payments.transactionStatus })
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .limit(1)

  if (existing && !shouldReplaceStatus(existing.transactionStatus, normalizedStatus)) {
    return existing
  }

  const [sub] = await d
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.studioId, metadata.studioId))
    .limit(1)

  const paymentMethod =
    typeof (payload as Record<string, unknown>).payment_type === "string"
      ? ((payload as Record<string, unknown>).payment_type as string)
      : null

  const transactionId =
    typeof (payload as Record<string, unknown>).transaction_id === "string"
      ? ((payload as Record<string, unknown>).transaction_id as string)
      : null

  const [row] = await d
    .insert(payments)
    .values({
      studioId: metadata.studioId,
      subscriptionId: sub?.id ?? null,
      orderId,
      transactionId,
      amount: Math.round(amount),
      paymentMethod,
      transactionStatus: normalizedStatus,
      fraudStatus: payload.fraud_status ?? null,
      rawPayload: payload as Record<string, unknown>,
      paidAt,
    })
    .onConflictDoUpdate({
      target: payments.orderId,
      set: {
        transactionId,
        amount: Math.round(amount),
        paymentMethod,
        transactionStatus: normalizedStatus,
        fraudStatus: payload.fraud_status ?? null,
        rawPayload: payload as Record<string, unknown>,
        paidAt: normalizedStatus === "success" ? sql`COALESCE(${payments.paidAt}, NOW())` : payments.paidAt,
      },
    })
    .returning()

  return row
}

export async function recordPendingPayment(input: {
  studioId: string
  orderId: string
  planType: string
  amount: number
}) {
  const d = getDb()

  const [sub] = await d
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.studioId, input.studioId))
    .limit(1)

  await d
    .insert(payments)
    .values({
      studioId: input.studioId,
      subscriptionId: sub?.id ?? null,
      orderId: input.orderId,
      amount: input.amount,
      transactionStatus: "pending",
      rawPayload: { planType: input.planType, source: "create-order" },
    })
    .onConflictDoNothing()
}

export type PaymentListSort = "newest" | "oldest" | "amount_desc" | "amount_asc"

export type AdminPaymentRow = {
  id: string
  orderId: string
  transactionId: string | null
  amount: number
  paymentMethod: string | null
  transactionStatus: string
  studioId: string
  studioName: string
  studioSlug: string
  planType: string | null
  planLabel: string | null
  paidAt: string | null
  createdAt: string
}

export async function listPayments(input: {
  page?: number
  limit?: number
  q?: string
  status?: string
  studioId?: string
  sort?: PaymentListSort
  from?: string
  to?: string
}) {
  if (!isDatabaseConfigured() || !db) {
    return { data: [] as AdminPaymentRow[], total: 0, page: 1, limit: 20 }
  }

  const page = Math.max(1, input.page ?? 1)
  const limit = Math.min(100, Math.max(1, input.limit ?? 20))
  const offset = (page - 1) * limit

  const conditions = []
  if (input.status) conditions.push(eq(payments.transactionStatus, input.status))
  if (input.studioId) conditions.push(eq(payments.studioId, input.studioId))
  if (input.from) conditions.push(gte(payments.createdAt, new Date(input.from)))
  if (input.to) {
    const end = new Date(input.to)
    end.setHours(23, 59, 59, 999)
    conditions.push(lte(payments.createdAt, end))
  }
  if (input.q?.trim()) {
    const pattern = `%${input.q.trim()}%`
    conditions.push(
      or(
        ilike(payments.orderId, pattern),
        ilike(payments.transactionId, pattern),
        ilike(studios.name, pattern),
        ilike(studios.slug, pattern),
      ),
    )
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const orderBy = (() => {
    switch (input.sort) {
      case "oldest":
        return asc(payments.createdAt)
      case "amount_desc":
        return desc(payments.amount)
      case "amount_asc":
        return asc(payments.amount)
      case "newest":
      default:
        return desc(payments.createdAt)
    }
  })()

  const rows = await db
    .select({
      payment: payments,
      studioName: studios.name,
      studioSlug: studios.slug,
    })
    .from(payments)
    .innerJoin(studios, eq(studios.id, payments.studioId))
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)

  const [totalRow] = await db
    .select({ total: count() })
    .from(payments)
    .innerJoin(studios, eq(studios.id, payments.studioId))
    .where(whereClause)

  const data: AdminPaymentRow[] = rows.map((row) => {
    const raw = row.payment.rawPayload as { planType?: string } | null
    const planType = raw?.planType ?? null
    return {
      id: row.payment.id,
      orderId: row.payment.orderId,
      transactionId: row.payment.transactionId,
      amount: row.payment.amount,
      paymentMethod: row.payment.paymentMethod,
      transactionStatus: row.payment.transactionStatus,
      studioId: row.payment.studioId,
      studioName: row.studioName,
      studioSlug: row.studioSlug,
      planType,
      planLabel: planType ? getSubscriptionPlanLabel(planType).name : null,
      paidAt: row.payment.paidAt?.toISOString() ?? null,
      createdAt: row.payment.createdAt.toISOString(),
    }
  })

  return {
    data,
    total: Number(totalRow?.total ?? 0),
    page,
    limit,
  }
}

export async function getPaymentById(paymentId: string) {
  if (!isDatabaseConfigured() || !db) return null

  const [row] = await db
    .select({
      payment: payments,
      studioName: studios.name,
      studioSlug: studios.slug,
    })
    .from(payments)
    .innerJoin(studios, eq(studios.id, payments.studioId))
    .where(eq(payments.id, paymentId))
    .limit(1)

  if (!row) return null

  const raw = row.payment.rawPayload as { planType?: string } | null
  const planType = raw?.planType ?? null

  return {
    id: row.payment.id,
    orderId: row.payment.orderId,
    transactionId: row.payment.transactionId,
    amount: row.payment.amount,
    paymentMethod: row.payment.paymentMethod,
    transactionStatus: row.payment.transactionStatus,
    fraudStatus: row.payment.fraudStatus,
    studioId: row.payment.studioId,
    studioName: row.studioName,
    studioSlug: row.studioSlug,
    planType,
    planLabel: planType ? getSubscriptionPlanLabel(planType).name : null,
    paidAt: row.payment.paidAt?.toISOString() ?? null,
    createdAt: row.payment.createdAt.toISOString(),
    rawPayload: row.payment.rawPayload,
  }
}

export async function backfillPaymentsFromInvoices() {
  const d = getDb()

  const { invoices } = await import("@/db/schema")
  const rows = await d.select().from(invoices)

  let inserted = 0
  for (const invoice of rows) {
    const status = invoice.status === "paid" ? "success" : invoice.status
    await d
      .insert(payments)
      .values({
        studioId: invoice.studioId,
        orderId: invoice.midtransOrderId,
        amount: invoice.amount,
        transactionStatus: status,
        rawPayload: {
          planType: invoice.planType,
          source: "backfill-invoices",
        },
        paidAt: invoice.paidAt,
        createdAt: invoice.createdAt,
      })
      .onConflictDoNothing()
    inserted += 1
  }

  return { processed: rows.length, inserted }
}
