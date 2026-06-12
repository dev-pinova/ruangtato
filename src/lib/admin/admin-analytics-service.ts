import { and, count, desc, eq, gte, sql, sum } from "drizzle-orm"

import { db, isDatabaseConfigured } from "@/db"
import { user } from "@/db/auth-schema"
import { payments, studios, subscriptions } from "@/db/schema"
import { isActivePaidSubscription } from "@/lib/studio/studio-service"

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function last12MonthKeys() {
  const keys: string[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(monthKey(d))
  }
  return keys
}

function buildMonthlySeries(
  rows: { month: string; value: number }[],
  keys: string[],
) {
  const map = new Map(rows.map((row) => [row.month, row.value]))
  return keys.map((month) => ({ month, value: map.get(month) ?? 0 }))
}

export async function getPlatformAnalytics() {
  if (!isDatabaseConfigured() || !db) {
    return getEmptyAnalytics()
  }

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [userStats] = await db
    .select({
      totalUsers: count(),
      activeUsers: sql<number>`count(*) filter (where ${user.status} = 'active')`,
      newUsersThisMonth: sql<number>`count(*) filter (where ${user.createdAt} >= ${monthStart})`,
    })
    .from(user)
    .where(sql`${user.platformRole} is distinct from 'super_admin'`)

  const subRows = await db
    .select({
      planType: subscriptions.planType,
      status: subscriptions.status,
      expiresAt: subscriptions.expiresAt,
    })
    .from(subscriptions)

  const activeSubscribers = subRows.filter((sub) =>
    isActivePaidSubscription(sub),
  ).length

  const [paymentCount] = await db.select({ total: count() }).from(payments)

  const [paymentStats] = await db
    .select({
      totalRevenue: sum(payments.amount),
      revenueThisMonth: sql<number>`coalesce(sum(${payments.amount}) filter (where ${payments.paidAt} >= ${monthStart}), 0)`,
    })
    .from(payments)
    .where(eq(payments.transactionStatus, "success"))

  const studioRows = await db
    .select({
      isPublished: studios.isPublished,
      status: studios.status,
      pageConfig: studios.pageConfig,
    })
    .from(studios)

  const activeWebsites = studioRows.filter(
    (row) => row.isPublished && row.status === "active",
  ).length
  const inactiveWebsites = studioRows.length - activeWebsites

  let portfolioAssets = 0
  for (const row of studioRows) {
    const json = JSON.stringify(row.pageConfig ?? [])
    const matches = json.match(/https?:\/\/|\/uploads\//g)
    portfolioAssets += matches?.length ?? 0
  }

  const keys = last12MonthKeys()
  const earliest = new Date(keys[0] + "-01")

  const userGrowthRows = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${user.createdAt}), 'YYYY-MM')`,
      value: count(),
    })
    .from(user)
    .where(gte(user.createdAt, earliest))
    .groupBy(sql`date_trunc('month', ${user.createdAt})`)
    .orderBy(sql`date_trunc('month', ${user.createdAt})`)

  const paymentGrowthRows = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${payments.paidAt}), 'YYYY-MM')`,
      value: count(),
    })
    .from(payments)
    .where(
      and(eq(payments.transactionStatus, "success"), gte(payments.paidAt, earliest)),
    )
    .groupBy(sql`date_trunc('month', ${payments.paidAt})`)
    .orderBy(sql`date_trunc('month', ${payments.paidAt})`)

  const subscriberGrowthRows = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${subscriptions.createdAt}), 'YYYY-MM')`,
      value: count(),
    })
    .from(subscriptions)
    .where(
      and(
        gte(subscriptions.createdAt, earliest),
        sql`${subscriptions.planType} <> 'trial'`,
      ),
    )
    .groupBy(sql`date_trunc('month', ${subscriptions.createdAt})`)
    .orderBy(sql`date_trunc('month', ${subscriptions.createdAt})`)

  const planTypeRows = await db
    .select({
      planType: subscriptions.planType,
      count: count(),
    })
    .from(subscriptions)
    .groupBy(subscriptions.planType)

  const paymentMethodRows = await db
    .select({
      method: payments.paymentMethod,
      count: count(),
    })
    .from(payments)
    .where(eq(payments.transactionStatus, "success"))
    .groupBy(payments.paymentMethod)

  const latestSubscriptions = await db
    .select({
      id: subscriptions.id,
      studioName: studios.name,
      planType: subscriptions.planType,
      status: subscriptions.status,
      createdAt: subscriptions.createdAt,
      expiresAt: subscriptions.expiresAt,
    })
    .from(subscriptions)
    .leftJoin(studios, eq(subscriptions.studioId, studios.id))
    .orderBy(desc(subscriptions.createdAt))
    .limit(10)

  return {
    kpis: {
      totalUsers: Number(userStats?.totalUsers ?? 0),
      activeUsers: Number(userStats?.activeUsers ?? 0),
      newUsersThisMonth: Number(userStats?.newUsersThisMonth ?? 0),
      activeSubscribers,
      totalTransactions: Number(paymentCount?.total ?? 0),
      totalRevenue: Number(paymentStats?.totalRevenue ?? 0),
      revenueThisMonth: Number(paymentStats?.revenueThisMonth ?? 0),
      activeWebsites,
      inactiveWebsites,
      portfolioAssets,
    },
    breakdowns: {
      planTypes: planTypeRows.map(r => ({ planType: r.planType, count: Number(r.count) })),
      paymentMethods: paymentMethodRows.map(r => ({ method: r.method, count: Number(r.count) })),
    },
    latestSubscriptions: latestSubscriptions.map(sub => ({
      id: sub.id,
      studioName: sub.studioName ?? "Unknown Studio",
      planType: sub.planType,
      status: sub.status,
      createdAt: sub.createdAt?.toISOString() ?? null,
      expiresAt: sub.expiresAt?.toISOString() ?? null,
    })),
    charts: {
      userGrowth: buildMonthlySeries(
        userGrowthRows.map((row) => ({ month: row.month, value: Number(row.value) })),
        keys,
      ),
      transactionGrowth: buildMonthlySeries(
        paymentGrowthRows.map((row) => ({ month: row.month, value: Number(row.value) })),
        keys,
      ),
      subscriberGrowth: buildMonthlySeries(
        subscriberGrowthRows.map((row) => ({ month: row.month, value: Number(row.value) })),
        keys,
      ),
    },
  }
}

function getEmptyAnalytics() {
  const keys = last12MonthKeys()
  const empty = keys.map((month) => ({ month, value: 0 }))
  return {
    kpis: {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      activeSubscribers: 0,
      totalTransactions: 0,
      totalRevenue: 0,
      revenueThisMonth: 0,
      activeWebsites: 0,
      inactiveWebsites: 0,
      portfolioAssets: 0,
    },
    breakdowns: {
      planTypes: [],
      paymentMethods: [],
    },
    latestSubscriptions: [],
    charts: {
      userGrowth: empty,
      transactionGrowth: empty,
      subscriberGrowth: empty,
    },
  }
}
