import { notFound } from "next/navigation"
import Link from "next/link"
import { eq } from "drizzle-orm"
import { ArrowLeft, Calendar, CreditCard, FileText, Globe, Hash, Key, Shield, User } from "lucide-react"

import { getDb } from "@/db"
import { payments, studios, subscriptions } from "@/db/schema"
import { requirePlatformSession } from "@/lib/admin/admin-auth"
import { getSubscriptionPlanLabel } from "@/lib/billing/billing-plans"
import {
  AdminPageHeaderV2,
  AdminPanel,
  AdminPanelInset,
  AdminSectionCard,
  AdminStatusBadge,
} from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const dynamic = "force-dynamic"

// Matches the shared admin currency convention used across the admin panels
// (see src/components/admin/payments-panel.tsx).
function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

function formatDateTime(date: Date | null) {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) + " WIB"
}

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // 1. Authenticate session & enforce administrative access
  await requirePlatformSession(["super_admin", "admin", "support", "finance"])

  const { id } = await params
  const db = getDb()

  // 2. Fetch the transaction with a join to studios and subscriptions
  let row
  try {
    const results = await db
      .select({
        payment: payments,
        studioName: studios.name,
        studioSlug: studios.slug,
        subscriptionPlanType: subscriptions.planType,
      })
      .from(payments)
      .innerJoin(studios, eq(studios.id, payments.studioId))
      .leftJoin(subscriptions, eq(subscriptions.id, payments.subscriptionId))
      .where(eq(payments.id, id))
      .limit(1)

    row = results[0]
  } catch (error) {
    console.error("Failed to query payment by ID:", error)
    notFound()
  }

  if (!row) {
    notFound()
  }

  const { payment, studioName, studioSlug, subscriptionPlanType } = row

  // Resolve plan label
  const rawPayload = payment.rawPayload as { planType?: string } | null
  const planType = subscriptionPlanType ?? rawPayload?.planType ?? null
  const planLabel = planType ? getSubscriptionPlanLabel(planType).name : "Trial / Custom"

  const isSuccess =
    payment.transactionStatus === "success" ||
    payment.transactionStatus === "settlement" ||
    payment.transactionStatus === "capture"

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeaderV2
        title="Detail Transaksi"
        description={`ID transaksi: ${payment.id}`}
        actions={
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            className="min-h-11 sm:min-h-0"
            render={<Link href="/admin/payments" />}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Kembali ke Daftar Transaksi
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main transaction details panel */}
        <AdminPanel className="md:col-span-2">
          <AdminPanelInset>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CreditCard className="size-5 text-muted-foreground" aria-hidden />
                <h2 className="text-lg font-semibold">Informasi Pembayaran</h2>
              </div>
              <AdminStatusBadge
                status={payment.transactionStatus}
                label={payment.transactionStatus.toUpperCase()}
              />
            </div>
          </AdminPanelInset>

          <div className="space-y-6 p-4 md:p-5">
            {/* Amount & Plan Section */}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Nominal Transaksi</span>
              <span className="text-3xl font-bold tabular-nums text-foreground">{formatIDR(payment.amount)}</span>
            </div>

            {/* Financial Auditing Grid */}
            <div className="grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Key className="size-4 text-muted-foreground/70" aria-hidden />
                  Order ID
                </span>
                <span className="font-mono font-medium text-foreground">{payment.orderId}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Hash className="size-4 text-muted-foreground/70" aria-hidden />
                  Midtrans Transaction ID
                </span>
                <span className="font-mono font-medium text-foreground">{payment.transactionId ?? "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <CreditCard className="size-4 text-muted-foreground/70" aria-hidden />
                  Metode Pembayaran
                </span>
                <span className="font-medium capitalize text-foreground">{payment.paymentMethod ?? "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Shield className="size-4 text-muted-foreground/70" aria-hidden />
                  Fraud Status
                </span>
                <span className="font-medium uppercase text-foreground">{payment.fraudStatus ?? "—"}</span>
              </div>
            </div>

            {/* Dates & Timestamps */}
            <div className="grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="size-4 text-muted-foreground/70" aria-hidden />
                  Waktu Order
                </span>
                <span className="font-medium text-foreground">{formatDateTime(payment.createdAt)}</span>
              </div>
              {isSuccess && payment.paidAt && (
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="size-4 text-muted-foreground/70" aria-hidden />
                    Waktu Lunas
                  </span>
                  <span className="font-medium text-foreground">{formatDateTime(payment.paidAt)}</span>
                </div>
              )}
            </div>
          </div>
        </AdminPanel>

        {/* Tenant/Studio information panel */}
        <AdminPanel>
          <AdminPanelInset>
            <div className="flex items-center gap-2">
              <User className="size-5 text-muted-foreground" aria-hidden />
              <h2 className="text-lg font-semibold">Detail Pelanggan</h2>
            </div>
          </AdminPanelInset>

          <div className="space-y-6 p-4 text-sm md:p-5">
            {/* Studio Name */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Nama Studio</span>
              <span className="text-base font-semibold text-foreground">{studioName}</span>
            </div>

            {/* Studio Slug */}
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Globe className="size-4 text-muted-foreground/70" aria-hidden />
                Slug Studio
              </span>
              <span className="font-mono text-muted-foreground">
                <Link
                  href={`/app/studio/${studioSlug}`}
                  target="_blank"
                  className="text-primary hover:text-primary/80 hover:underline"
                >
                  {studioSlug}
                </Link>
              </span>
            </div>

            {/* Subscription Package */}
            <div className="flex flex-col gap-1 border-t border-border pt-6">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <FileText className="size-4 text-muted-foreground/70" aria-hidden />
                Paket Langganan
              </span>
              <span className="font-medium text-foreground">{planLabel}</span>
              {planType && (
                <span className="font-mono text-xs text-muted-foreground">({planType})</span>
              )}
            </div>
          </div>
        </AdminPanel>
      </div>

      {/* JSONB Raw Payload Viewer Accordion */}
      <AdminSectionCard className="p-0">
        <Accordion className="w-full">
          <AccordionItem value="raw-payload" className="border-0">
            <AccordionTrigger className="px-4 py-4 text-sm font-semibold text-foreground hover:no-underline md:px-5">
              Lihat Payload API Mentah (Developer Only)
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-6 pt-2 md:px-5">
              <pre className="max-h-96 overflow-auto rounded-md border border-border bg-background p-4 font-mono text-xs text-muted-foreground">
                <code>{JSON.stringify(payment.rawPayload, null, 2)}</code>
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </AdminSectionCard>
    </div>
  )
}
