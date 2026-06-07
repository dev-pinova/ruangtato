import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import type { Block } from "@/lib/types"

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  permissions: jsonb("permissions").$type<Record<string, boolean>>().default({}),
})

export const studios = pgTable(
  "studios",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    city: text("city"),
    waNumber: text("wa_number"),
    description: text("description"),
    image: text("image"),
    artist: text("artist"),
    tags: jsonb("tags").$type<string[]>().default([]),
    viewCount: integer("view_count").notNull().default(0),
    clickCount: integer("click_count").notNull().default(0),
    isTrusted: boolean("is_trusted").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(false),
    status: text("status").notNull().default("active"),
    pageConfig: jsonb("page_config").$type<Block[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("studios_status_idx").on(table.status)],
)

export const studioMemberships = pgTable("studio_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  studioId: uuid("studio_id")
    .notNull()
    .references(() => studios.id, { onDelete: "cascade" }),
  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.id),
  isPrimaryOwner: boolean("is_primary_owner").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  studioId: uuid("studio_id")
    .notNull()
    .references(() => studios.id, { onDelete: "cascade" }),
  planType: text("plan_type").notNull(),
  status: text("status").notNull().default("pending"),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  midtransOrderId: text("midtrans_order_id"),
  midtransTransactionId: text("midtrans_transaction_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  studioId: uuid("studio_id")
    .notNull()
    .references(() => studios.id, { onDelete: "cascade" }),
  midtransOrderId: text("midtrans_order_id").notNull().unique(),
  planType: text("plan_type").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studioId: uuid("studio_id")
      .notNull()
      .references(() => studios.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id, {
      onDelete: "set null",
    }),
    orderId: text("order_id").notNull().unique(),
    transactionId: text("transaction_id"),
    amount: integer("amount").notNull(),
    paymentMethod: text("payment_method"),
    transactionStatus: text("transaction_status").notNull().default("pending"),
    fraudStatus: text("fraud_status"),
    rawPayload: jsonb("raw_payload").$type<Record<string, unknown>>(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("payments_transaction_status_idx").on(table.transactionStatus),
    index("payments_created_at_idx").on(table.createdAt),
  ],
)

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorUserId: text("actor_user_id").notNull(),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    reason: text("reason"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("audit_logs_created_at_idx").on(table.createdAt)],
)

export const suspensionLogs = pgTable("suspension_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: text("actor_user_id").notNull(),
  studioId: uuid("studio_id")
    .notNull()
    .references(() => studios.id, { onDelete: "cascade" }),
  statusBefore: text("status_before").notNull(),
  statusAfter: text("status_after").notNull(),
  reasonCategory: text("reason_category"),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  studioId: uuid("studio_id")
    .notNull()
    .references(() => studios.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  message: text("message"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
