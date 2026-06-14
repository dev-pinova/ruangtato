import { createHash } from "crypto"

import { beforeEach, afterEach, describe, expect, it, vi } from "vitest"

import { payments, studios, subscriptions } from "@/db/schema"

// --- Shared, hoisted mock state for the fake database transaction ---------
type TableRef = typeof payments | typeof subscriptions | typeof studios
type Row = Record<string, unknown>

interface WriteRecord {
  kind: "update" | "insert"
  table: string
  set?: Row
  values?: Row
}

interface Scenario {
  payment: Row | null
  subscription: Row | null
  writes: WriteRecord[]
}

const hoisted = vi.hoisted(() => {
  const scenario: { current: { payment: Row | null; subscription: Row | null; writes: WriteRecord[] } } = {
    current: { payment: null, subscription: null, writes: [] },
  }
  return { scenario }
})

vi.mock("@/db", () => ({
  getDb: () => ({
    transaction: async (fn: (tx: unknown) => Promise<unknown>) => fn(makeTx(hoisted.scenario.current)),
  }),
}))

function label(table: TableRef | undefined): string {
  if (table === payments) return "payments"
  if (table === subscriptions) return "subscriptions"
  if (table === studios) return "studios"
  return "other"
}

interface QueryCtx {
  kind?: "select" | "update" | "insert"
  table?: TableRef
  set?: Row
  values?: Row
}

function computeResult(ctx: QueryCtx, state: Scenario): Row[] {
  if (ctx.kind === "select") {
    if (ctx.table === payments) return state.payment ? [state.payment] : []
    if (ctx.table === subscriptions) return state.subscription ? [state.subscription] : []
    return []
  }

  // Any update/insert is a write — record it for assertions.
  state.writes.push({
    kind: ctx.kind === "insert" ? "insert" : "update",
    table: label(ctx.table),
    set: ctx.set,
    values: ctx.values,
  })

  if (ctx.table === subscriptions) {
    return [{ id: (state.subscription?.id as string) ?? "sub-new" }]
  }
  return []
}

type Terminal = Promise<Row[]> & {
  returning: (cols?: unknown) => Promise<Row[]>
  limit: (n?: number) => Terminal
  for: (strength?: string) => Promise<Row[]>
  onConflictDoNothing: () => Terminal
  onConflictDoUpdate: (arg?: unknown) => Terminal
}

function terminal(result: Row[]): Terminal {
  const p = Promise.resolve(result) as Terminal
  p.returning = () => Promise.resolve(result)
  p.limit = () => terminal(result)
  p.for = () => Promise.resolve(result)
  p.onConflictDoNothing = () => terminal(result)
  p.onConflictDoUpdate = () => terminal(result)
  return p
}

interface Builder {
  select: (cols?: unknown) => Builder
  from: (t: TableRef) => Builder
  where: (...args: unknown[]) => Terminal
  limit: (n?: number) => Terminal
  update: (t: TableRef) => Builder
  set: (v: Row) => Builder
  insert: (t: TableRef) => Builder
  values: (v: Row) => Terminal
}

function makeTx(state: Scenario) {
  function builder(): Builder {
    const ctx: QueryCtx = {}
    const b: Builder = {
      select: () => {
        ctx.kind = "select"
        return b
      },
      from: (t) => {
        ctx.table = t
        return b
      },
      where: () => terminal(computeResult(ctx, state)),
      limit: () => terminal(computeResult(ctx, state)),
      update: (t) => {
        ctx.kind = "update"
        ctx.table = t
        return b
      },
      set: (v) => {
        ctx.set = v
        return b
      },
      insert: (t) => {
        ctx.kind = "insert"
        ctx.table = t
        return b
      },
      values: (v) => {
        ctx.values = v
        return terminal(computeResult(ctx, state))
      },
    }
    return b
  }

  return {
    select: (cols?: unknown) => builder().select(cols),
    update: (t: TableRef) => builder().update(t),
    insert: (t: TableRef) => builder().insert(t),
  }
}

// --- Test environment + payload helpers ------------------------------------
const SERVER_KEY = "test-server-key"
process.env.MIDTRANS_SERVER_KEY = SERVER_KEY
process.env.MIDTRANS_CLIENT_KEY = "test-client-key"

function sign(orderId: string, statusCode: string, grossAmount: string): string {
  return createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${SERVER_KEY}`)
    .digest("hex")
}

function buildPayload(input: {
  orderId?: string
  statusCode?: string
  grossAmount: string
  transactionStatus: string
  fraudStatus?: string
  customField1?: string
  signatureOverride?: string
}): Record<string, unknown> {
  const orderId = input.orderId ?? "RT-test-001"
  const statusCode = input.statusCode ?? "200"
  return {
    order_id: orderId,
    status_code: statusCode,
    gross_amount: input.grossAmount,
    transaction_status: input.transactionStatus,
    fraud_status: input.fraudStatus,
    custom_field1: input.customField1,
    transaction_id: "txn-001",
    payment_type: "qris",
    signature_key: input.signatureOverride ?? sign(orderId, statusCode, input.grossAmount),
  }
}

function makeRequest(payload: Record<string, unknown> | string): Request {
  return new Request("http://localhost/api/billing/webhook", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  })
}

const META_6M = JSON.stringify({ studioId: "studio-1", planType: "6months" })

// Import after mocks/env are configured.
import { POST } from "./route"

describe("POST /api/billing/webhook", () => {
  beforeEach(() => {
    hoisted.scenario.current = { payment: null, subscription: null, writes: [] }
    vi.spyOn(console, "log").mockImplementation(() => {})
    vi.spyOn(console, "warn").mockImplementation(() => {})
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it("rejects an invalid signature with 401", async () => {
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "settlement",
      customField1: META_6M,
      signatureOverride: "deadbeef",
    })
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(401)
    expect(hoisted.scenario.current.writes).toHaveLength(0)
  })

  it("returns 503 when Midtrans is not configured", async () => {
    vi.stubEnv("MIDTRANS_SERVER_KEY", "")
    vi.stubEnv("MIDTRANS_CLIENT_KEY", "")
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "settlement",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(503)
  })

  it("returns 400 for an unparseable payload", async () => {
    const res = await POST(makeRequest("{not-valid-json"))
    expect(res.status).toBe(400)
  })

  it("activates subscription on a valid settlement for a new order", async () => {
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "settlement",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.message).toBe("Transaction processed successfully")

    const { writes } = hoisted.scenario.current
    expect(writes.some((w) => w.table === "payments" && w.kind === "insert")).toBe(true)
    expect(writes.some((w) => w.table === "studios" && w.set?.status === "active")).toBe(true)

    const subWrite = writes.find((w) => w.table === "subscriptions")
    expect(subWrite).toBeDefined()
    expect((subWrite?.values ?? subWrite?.set)?.planType).toBe("6months")
    expect((subWrite?.values ?? subWrite?.set)?.status).toBe("active")
  })

  it("is idempotent: a replayed settlement does not re-activate or extend", async () => {
    hoisted.scenario.current.payment = {
      studioId: "studio-1",
      subscriptionId: "sub-1",
      transactionStatus: "success",
    }
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "settlement",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.message).toBe("Already processed")
    // No mutations at all on a duplicate.
    expect(hoisted.scenario.current.writes).toHaveLength(0)
  })

  it("does NOT activate on capture with fraud_status=challenge", async () => {
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "capture",
      fraudStatus: "challenge",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.message).toBe("Status 'capture' logged")
    expect(hoisted.scenario.current.writes).toHaveLength(0)
  })

  it("activates on capture with fraud_status=accept and matching amount", async () => {
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "capture",
      fraudStatus: "accept",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.message).toBe("Transaction processed successfully")
    expect(hoisted.scenario.current.writes.some((w) => w.table === "subscriptions")).toBe(true)
  })

  it("refuses activation when the paid amount does not match the declared plan", async () => {
    // Buyer declares 6months (449000) but only pays 99000.
    const payload = buildPayload({
      grossAmount: "99000",
      transactionStatus: "settlement",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.message).toBe("Amount mismatch logged")
    // Nothing granted.
    expect(hoisted.scenario.current.writes.some((w) => w.table === "subscriptions")).toBe(false)
    expect(hoisted.scenario.current.writes.some((w) => w.table === "studios")).toBe(false)
  })

  it("records a failed payment on a deny notification", async () => {
    hoisted.scenario.current.payment = {
      studioId: "studio-1",
      subscriptionId: null,
      transactionStatus: "pending",
    }
    const payload = buildPayload({
      grossAmount: "449000",
      transactionStatus: "deny",
      customField1: META_6M,
    })
    const res = await POST(makeRequest(payload))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.message).toBe("Failed payment recorded")
    const failWrite = hoisted.scenario.current.writes.find((w) => w.table === "payments")
    expect(failWrite?.set?.transactionStatus).toBe("failed")
  })
})
