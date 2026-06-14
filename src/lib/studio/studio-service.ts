import { and, desc, eq, inArray, ne, sql } from "drizzle-orm"

import { db, getDb, isDatabaseConfigured, type AppDb } from "@/db"
import { user } from "@/db/auth-schema"
import {
  leads,
  invoices,
  roles,
  studioMemberships,
  studios,
  subscriptions,
} from "@/db/schema"
import {
  createDefaultPageConfig,
  createSlugFromName,
} from "@/lib/studio/default-page-config"
import { DEFAULT_STUDIO_COVER } from "@/lib/placeholder-images"
import { getStudioArtistImage, resolveStudioCoverImage } from "@/lib/studio/studio-utils"
import { type Block, type Studio, mapDbBlocksToBlocks, mapBlocksToDbBlocks } from "@/lib/types"

/**
 * Drizzle executor: either the root db handle or a transaction handle.
 * Lets write helpers run standalone or inside a shared transaction.
 */
export type TxOrDb = AppDb | Parameters<Parameters<AppDb["transaction"]>[0]>[0]

export function isActivePaidSubscription(sub: {
  planType: string
  status: string
  expiresAt: Date | null
}): boolean {
  if (sub.status !== "active") return false
  if (sub.expiresAt && sub.expiresAt.getTime() <= Date.now()) return false
  return true
}

function mapStudioRow(
  row: typeof studios.$inferSelect,
  blocks: Block[],
  isVerified = false,
): Studio {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city ?? "",
    waNumber: row.waNumber ?? "",
    description: row.description ?? "",
    image: resolveStudioCoverImage(row.image, blocks),
    viewCount: row.viewCount,
    clickCount: row.clickCount,
    isTrusted: row.isTrusted,
    isVerified,
    isPublished: row.isPublished,
    tags: row.tags ?? [],
    artist: row.artist ?? "",
    artistImage: getStudioArtistImage(blocks),
    blocks,
  }
}

export async function getStudioBySlugFromDb(slug: string): Promise<Studio | null> {
  if (!isDatabaseConfigured() || !db) return null

  const [row] = await db.select().from(studios).where(eq(studios.slug, slug)).limit(1)
  if (!row) return null

  return mapStudioRow(row, mapDbBlocksToBlocks(row.pageConfig ?? []))
}

export async function getPublishedStudioBySlug(slug: string): Promise<Studio | null> {
  if (!isDatabaseConfigured() || !db) return null

  const [row] = await db.select().from(studios).where(eq(studios.slug, slug)).limit(1)
  if (!row?.isPublished || row.status === "suspended") return null

  return mapStudioRow(row, mapDbBlocksToBlocks(row.pageConfig ?? []))
}

export async function getSuspendedStudioBySlug(
  slug: string,
): Promise<{ name: string; slug: string } | null> {
  if (!isDatabaseConfigured() || !db) return null

  const [row] = await db
    .select({ name: studios.name, slug: studios.slug, status: studios.status, isPublished: studios.isPublished })
    .from(studios)
    .where(eq(studios.slug, slug))
    .limit(1)

  if (!row || row.status !== "suspended") return null
  return { name: row.name, slug: row.slug }
}

export async function getStudioForUser(userId: string): Promise<Studio | null> {
  if (!isDatabaseConfigured() || !db) return null

  const [account] = await db
    .select({ status: user.status })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  if (account?.status === "suspended") return null

  const [membership] = await db
    .select({
      studio: studios,
    })
    .from(studioMemberships)
    .innerJoin(studios, eq(studioMemberships.studioId, studios.id))
    .where(eq(studioMemberships.userId, userId))
    .limit(1)

  if (!membership) return null

  const row = membership.studio
  if (row.status === "suspended") return null

  return mapStudioRow(row, mapDbBlocksToBlocks(row.pageConfig ?? []))
}

export async function getStudioSuspendedFlagForUser(userId: string): Promise<boolean> {
  if (!isDatabaseConfigured() || !db) return false

  const [account] = await db
    .select({ status: user.status })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  if (account?.status === "suspended") return true

  const [membership] = await db
    .select({ status: studios.status })
    .from(studioMemberships)
    .innerJoin(studios, eq(studioMemberships.studioId, studios.id))
    .where(eq(studioMemberships.userId, userId))
    .limit(1)

  return membership?.status === "suspended"
}

export async function userCanAccessStudio(userId: string, studioId: string): Promise<boolean> {
  if (!isDatabaseConfigured() || !db) return false

  const [membership] = await db
    .select({ id: studioMemberships.id })
    .from(studioMemberships)
    .where(
      and(
        eq(studioMemberships.userId, userId),
        eq(studioMemberships.studioId, studioId),
      ),
    )
    .limit(1)

  return Boolean(membership)
}

export type StudioRole = "owner" | "admin" | "member"
export type StudioPermission =
  | "content:write"
  | "publish"
  | "profile:write"
  | "billing:manage"

const STUDIO_ROLE_PERMISSIONS: Record<StudioRole, StudioPermission[]> = {
  owner: ["content:write", "publish", "profile:write", "billing:manage"],
  admin: ["content:write", "publish", "profile:write"],
  member: ["content:write"],
}

export function isStudioRole(value: string | null | undefined): value is StudioRole {
  return value === "owner" || value === "admin" || value === "member"
}

export function studioRoleHasPermission(
  role: StudioRole,
  permission: StudioPermission,
): boolean {
  return STUDIO_ROLE_PERMISSIONS[role].includes(permission)
}

/** Resolve the membership role name a user holds for a given studio. */
export async function getUserStudioRole(
  userId: string,
  studioId: string,
): Promise<StudioRole | null> {
  if (!isDatabaseConfigured() || !db) return null

  const [membership] = await db
    .select({ roleName: roles.name, isPrimaryOwner: studioMemberships.isPrimaryOwner })
    .from(studioMemberships)
    .innerJoin(roles, eq(studioMemberships.roleId, roles.id))
    .where(
      and(
        eq(studioMemberships.userId, userId),
        eq(studioMemberships.studioId, studioId),
      ),
    )
    .limit(1)

  if (!membership) return null
  // The primary owner is always treated as `owner` regardless of role row drift.
  if (membership.isPrimaryOwner) return "owner"
  return isStudioRole(membership.roleName) ? membership.roleName : "member"
}

export async function studioHasActiveSubscription(studioId: string): Promise<boolean> {
  if (!isDatabaseConfigured() || !db) return false

  const [sub] = await db
    .select({ status: subscriptions.status, expiresAt: subscriptions.expiresAt })
    .from(subscriptions)
    .where(eq(subscriptions.studioId, studioId))
    .limit(1)

  if (!sub || sub.status !== "active") return false
  if (!sub.expiresAt) return true
  return sub.expiresAt.getTime() > Date.now()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureOwnerRole(tx?: any) {
  const d = tx ?? getDb()

  const [existing] = await d.select().from(roles).where(eq(roles.name, "owner")).limit(1)
  if (existing) return existing

  const [created] = await d
    .insert(roles)
    .values({ name: "owner" })
    .returning()

  return created
}

async function ensureUniqueSlug(
  baseSlug: string,
  excludeStudioId?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx?: any,
): Promise<string> {
  const d = tx ?? getDb()

  let slug = baseSlug || "studio"
  let suffix = 1

  while (true) {
    const [existing] = await d
      .select({ id: studios.id })
      .from(studios)
      .where(eq(studios.slug, slug))
      .limit(1)
    if (!existing || (excludeStudioId && existing.id === excludeStudioId)) {
      return slug
    }
    slug = `${baseSlug}-${suffix}`
    suffix += 1
  }
}

export async function createStudioForUser(input: {
  userId: string
  studioName: string
  ownerName: string
  city: string
  waNumber: string
}) {
  const d = getDb()

  // Wrap all inserts in a transaction so that a failure in any step
  // rolls back the entire operation (prevents orphaned studios without
  // an owner membership).
  return d.transaction(async (tx) => {
    const ownerRole = await ensureOwnerRole(tx)
    const baseSlug = createSlugFromName(input.studioName) || "studio"
    const slug = await ensureUniqueSlug(baseSlug, undefined, tx)
    const pageConfig = createDefaultPageConfig(input.studioName)

    const [studio] = await tx
      .insert(studios)
      .values({
        slug,
        name: input.studioName,
        city: input.city.trim(),
        waNumber: input.waNumber.trim(),
        description: `Landing page resmi ${input.studioName}`,
        image: DEFAULT_STUDIO_COVER,
        artist: input.ownerName,
        tags: ["Custom", "Studio"],
        pageConfig: mapBlocksToDbBlocks(pageConfig),
      })
      .returning()

    await tx.insert(studioMemberships).values({
      userId: input.userId,
      studioId: studio.id,
      roleId: ownerRole.id,
      isPrimaryOwner: true,
    })


    return mapStudioRow(studio, pageConfig)
  })
}

export async function updateStudioProfile(
  studioId: string,
  input: {
    name: string
    slug: string
    city: string
    waNumber: string
    description: string
    image: string
  },
): Promise<Studio | null> {
  const d = getDb()

  const name = input.name.trim()
  const rawSlug = createSlugFromName(input.slug) || createSlugFromName(name) || "studio"
  const slug = await ensureUniqueSlug(rawSlug, studioId)
  const image = input.image.trim() || DEFAULT_STUDIO_COVER

  const [updated] = await d
    .update(studios)
    .set({
      name,
      slug,
      city: input.city.trim(),
      waNumber: input.waNumber.trim(),
      description: input.description.trim(),
      image,
      updatedAt: new Date(),
    })
    .where(eq(studios.id, studioId))
    .returning()

  if (!updated) return null
  return mapStudioRow(updated, mapDbBlocksToBlocks(updated.pageConfig ?? []))
}

export async function saveStudioPageConfig(studioId: string, blocks: Block[], slug?: string) {
  const d = getDb()

  const [existing] = await d
    .select()
    .from(studios)
    .where(eq(studios.id, studioId))
    .limit(1)

  if (!existing) return null

  const updates: Partial<typeof studios.$inferInsert> = {
    pageConfig: mapBlocksToDbBlocks(blocks),
    image: resolveStudioCoverImage(existing.image, blocks),
    updatedAt: new Date(),
  }

  if (slug) {
    updates.slug = slug
  }

  const [updated] = await d
    .update(studios)
    .set(updates)
    .where(eq(studios.id, studioId))
    .returning()

  if (!updated) return null
  return mapStudioRow(updated, mapDbBlocksToBlocks(updated.pageConfig ?? []))
}

export async function publishStudio(studioId: string) {
  const d = getDb()

  const [existing] = await d
    .select()
    .from(studios)
    .where(eq(studios.id, studioId))
    .limit(1)

  if (!existing) return null

  const blocks = mapDbBlocksToBlocks(existing.pageConfig ?? [])

  const [updated] = await d
    .update(studios)
    .set({
      isPublished: true,
      image: resolveStudioCoverImage(existing.image, blocks),
      updatedAt: new Date(),
    })
    .where(eq(studios.id, studioId))
    .returning()

  if (!updated) return null
  return mapStudioRow(updated, mapDbBlocksToBlocks(updated.pageConfig ?? []))
}

export async function getStudioIdBySlug(slug: string): Promise<string | null> {
  if (!isDatabaseConfigured() || !db) return null

  const [row] = await db
    .select({ id: studios.id })
    .from(studios)
    .where(eq(studios.slug, slug))
    .limit(1)

  return row?.id ?? null
}

export async function incrementStudioViewCount(slug: string): Promise<boolean> {
  if (!isDatabaseConfigured() || !db) return false

  const [updated] = await db
    .update(studios)
    .set({
      viewCount: sql`${studios.viewCount} + 1`,
      updatedAt: new Date(),
    })
    .where(and(eq(studios.slug, slug), eq(studios.isPublished, true)))
    .returning({ id: studios.id })

  return Boolean(updated)
}

export async function incrementStudioClickCount(slug: string): Promise<boolean> {
  if (!isDatabaseConfigured() || !db) return false

  const [updated] = await db
    .update(studios)
    .set({
      clickCount: sql`${studios.clickCount} + 1`,
      updatedAt: new Date(),
    })
    .where(and(eq(studios.slug, slug), eq(studios.isPublished, true)))
    .returning({ id: studios.id })

  return Boolean(updated)
}

export async function createStudioLead(input: {
  slug: string
  name: string
  email?: string
  message: string
}) {
  const d = getDb()

  const studioId = await getStudioIdBySlug(input.slug)
  if (!studioId) return null

  const [lead] = await d
    .insert(leads)
    .values({
      studioId,
      name: input.name,
      email: input.email ?? null,
      message: input.message,
    })
    .returning()

  return lead
}

export async function getSubscriptionForStudio(
  studioId: string,
  executor?: TxOrDb,
) {
  if (!executor && (!isDatabaseConfigured() || !db)) return null
  const d = executor ?? getDb()

  const [sub] = await d
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.studioId, studioId))
    .limit(1)

  return sub ?? null
}

export async function activateSubscription(
  input: {
    studioId: string
    planType: string
    midtransOrderId: string
    months: number
  },
  executor?: TxOrDb,
) {
  const d = executor ?? getDb()

  const existing = await getSubscriptionForStudio(input.studioId, d)

  // Idempotent: the same order already activated for the same plan is a no-op.
  if (
    existing &&
    existing.midtransOrderId === input.midtransOrderId &&
    existing.planType === input.planType &&
    existing.status === "active"
  ) {
    return existing
  }

  // Stack remaining paid time when extending/renewing an active subscription.
  const hasActivePaidTime = existing?.expiresAt && existing.expiresAt > new Date()
  const base = hasActivePaidTime ? new Date(existing.expiresAt!) : new Date()
  const startsAt = new Date()
  const expiresAt = new Date(base)
  expiresAt.setMonth(expiresAt.getMonth() + input.months)

  if (existing) {
    const [updated] = await d
      .update(subscriptions)
      .set({
        planType: input.planType,
        status: "active",
        startsAt,
        expiresAt,
        midtransOrderId: input.midtransOrderId,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.studioId, input.studioId))
      .returning()
    return updated ?? null
  }

  const [created] = await d
    .insert(subscriptions)
    .values({
      studioId: input.studioId,
      planType: input.planType,
      status: "active",
      startsAt,
      expiresAt,
      midtransOrderId: input.midtransOrderId,
    })
    .returning()

  return created ?? null
}

/**
 * Mark a studio active after a successful payment WITHOUT clobbering an
 * admin suspension. A studio in `suspended` status stays suspended even if a
 * (possibly stale/duplicate) payment webhook arrives.
 */
export async function setStudioActiveIfNotSuspended(
  studioId: string,
  executor?: TxOrDb,
) {
  const d = executor ?? getDb()
  await d
    .update(studios)
    .set({ status: "active", updatedAt: new Date() })
    .where(and(eq(studios.id, studioId), ne(studios.status, "suspended")))
}

export async function recordInvoice(
  input: {
    studioId: string
    midtransOrderId: string
    planType: string
    amount: number
    status: "paid" | "pending" | "failed"
    paidAt?: Date | null
  },
  executor?: TxOrDb,
) {
  const d = executor ?? getDb()

  const paidAt =
    input.status === "paid" ? (input.paidAt ?? new Date()) : input.paidAt ?? null

  const [row] = await d
    .insert(invoices)
    .values({
      studioId: input.studioId,
      midtransOrderId: input.midtransOrderId,
      planType: input.planType,
      amount: input.amount,
      status: input.status,
      paidAt,
    })
    .onConflictDoUpdate({
      target: invoices.midtransOrderId,
      set: {
        planType: input.planType,
        amount: input.amount,
        status: input.status,
        paidAt,
      },
    })
    .returning()

  return row ?? null
}

export async function listInvoicesForStudio(studioId: string) {
  if (!isDatabaseConfigured() || !db) return []

  return db
    .select()
    .from(invoices)
    .where(eq(invoices.studioId, studioId))
    .orderBy(desc(invoices.paidAt), desc(invoices.createdAt))
}

export async function listPublishedStudios(): Promise<Studio[]> {
  if (!isDatabaseConfigured() || !db) return []

  const rows = await db
    .select()
    .from(studios)
    .where(and(eq(studios.isPublished, true), eq(studios.status, "active")))
    .orderBy(desc(studios.viewCount))

  if (rows.length === 0) return []

  const studioIds = rows.map((row) => row.id)
  const subRows = await db
    .select({
      studioId: subscriptions.studioId,
      planType: subscriptions.planType,
      status: subscriptions.status,
      expiresAt: subscriptions.expiresAt,
    })
    .from(subscriptions)
    .where(inArray(subscriptions.studioId, studioIds))

  const verifiedByStudioId = new Map<string, boolean>()
  for (const sub of subRows) {
    if (isActivePaidSubscription(sub)) {
      verifiedByStudioId.set(sub.studioId, true)
    }
  }

  return rows.map((row) =>
    mapStudioRow(row, mapDbBlocksToBlocks(row.pageConfig ?? []), verifiedByStudioId.get(row.id) ?? false),
  )
}

export async function getLeadsForStudio(studioId: string) {
  if (!isDatabaseConfigured() || !db) return []

  return db
    .select()
    .from(leads)
    .where(eq(leads.studioId, studioId))
    .orderBy(desc(leads.createdAt))
    .limit(50)
}

export async function getStudioDashboardStats(studioId: string) {
  if (!isDatabaseConfigured() || !db) {
    return {
      totalViews: 0,
      totalClicks: 0,
      totalLeads: 0,
      conversionRate: 0,
    }
  }

  const [studio] = await db
    .select({
      viewCount: studios.viewCount,
      clickCount: studios.clickCount,
    })
    .from(studios)
    .where(eq(studios.id, studioId))
    .limit(1)

  const [leadCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(leads)
    .where(eq(leads.studioId, studioId))

  const totalViews = studio?.viewCount ?? 0
  const totalClicks = studio?.clickCount ?? 0
  const totalLeads = leadCount?.count ?? 0
  const conversionRate =
    totalViews > 0 ? Math.round((totalClicks / totalViews) * 1000) / 10 : 0

  return {
    totalViews,
    totalClicks,
    totalLeads,
    conversionRate,
  }
}
