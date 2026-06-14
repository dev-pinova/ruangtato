import { notFound } from "next/navigation"
import Link from "next/link"
import { eq } from "drizzle-orm"
import { ArrowLeft, Calendar, CreditCard, FileText, Globe, Hash, Key, Shield, User } from "lucide-react"

import { getDb } from "@/db"
import { payments, studios, subscriptions } from "@/db/schema"
import { requirePlatformSession } from "@/lib/admin/admin-auth"
import { getSubscriptionPlanLabel } from "@/lib/billing/billing-plans"
import { AdminStatusBadge } from "@/components/admin/ui/admin-status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const dynamic = "force-dynamic"

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
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
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Page Header & Back Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Detail Transaksi</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">ID: {payment.id}</p>
        </div>
        <Link href="/admin/payments" passHref legacyBehavior>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-md transition-colors self-start sm:self-center">
            <ArrowLeft className="size-4" />
            Kembali ke Daftar Transaksi
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main transaction details card */}
        <Card className="md:col-span-2 border-border bg-card">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="size-5 text-primary" />
                Informasi Pembayaran
              </CardTitle>
              <AdminStatusBadge
                status={payment.transactionStatus}
                label={payment.transactionStatus.toUpperCase()}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Amount & Plan Section */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Nominal Transaksi</span>
              <span className="text-3xl font-bold text-foreground tabular-nums">{formatIDR(payment.amount)}</span>
            </div>

            <Separator className="bg-border/50" />

            {/* Financial Auditing Grid */}
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Key className="size-4 text-muted-foreground/70" />
                  Order ID
                </span>
                <span className="font-mono font-medium text-foreground">{payment.orderId}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Hash className="size-4 text-muted-foreground/70" />
                  Midtrans Transaction ID
                </span>
                <span className="font-mono font-medium text-foreground">{payment.transactionId ?? "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="size-4 text-muted-foreground/70" />
                  Metode Pembayaran
                </span>
                <span className="font-medium text-foreground capitalize">{payment.paymentMethod ?? "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Shield className="size-4 text-muted-foreground/70" />
                  Fraud Status
                </span>
                <span className="font-medium text-foreground uppercase">{payment.fraudStatus ?? "—"}</span>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Dates & Timestamps */}
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-4 text-muted-foreground/70" />
                  Waktu Order
                </span>
                <span className="font-medium text-foreground">{formatDateTime(payment.createdAt)}</span>
              </div>
              {isSuccess && payment.paidAt && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-4 text-muted-foreground/70" />
                    Waktu Lunas
                  </span>
                  <span className="font-medium text-foreground">{formatDateTime(payment.paidAt)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tenant/Studio information card */}
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="size-5 text-primary" />
              Detail Pelanggan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 text-sm">
            {/* Studio Name */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Nama Studio</span>
              <span className="font-semibold text-foreground text-base">{studioName}</span>
            </div>

            {/* Studio Slug */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Globe className="size-4 text-muted-foreground/70" />
                Slug Studio
              </span>
              <span className="font-mono text-muted-foreground">
                <Link
                  href={`/app/studio/${studioSlug}`}
                  target="_blank"
                  className="hover:underline text-primary hover:text-primary/80"
                >
                  {studioSlug}
                </Link>
              </span>
            </div>

            <Separator className="bg-border/50" />

            {/* Subscription Package */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <FileText className="size-4 text-muted-foreground/70" />
                Paket Langganan
              </span>
              <span className="font-medium text-foreground">{planLabel}</span>
              {planType && (
                <span className="text-xs text-muted-foreground font-mono">({planType})</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* JSONB Raw Payload Viewer Accordion */}
      <Card className="border-border bg-card overflow-hidden">
        <Accordion className="w-full">
          <AccordionItem value="raw-payload" className="border-0">
            <AccordionTrigger className="px-6 py-4 hover:no-underline text-foreground font-semibold text-sm">
              Lihat Payload API Mentah (Developer Only)
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <pre className="max-h-96 overflow-auto rounded-md border border-border bg-background p-4 text-xs font-mono text-muted-foreground scrollbar-thin scrollbar-thumb-accent">
                <code>{JSON.stringify(payment.rawPayload, null, 2)}</code>
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  )
}
