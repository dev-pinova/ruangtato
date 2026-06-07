"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { PageHeading, SectionHeading } from "@/components/design"
import { SubscribeButton } from "@/components/billing/subscribe-button"
import { loadMidtransSnap } from "@/lib/midtrans-snap"
import {
  SUBSCRIPTION_PLANS,
  getPlanByType,
  getSubscriptionPlanLabel,
  planTypeToMonths,
} from "@/lib/billing-plans"
import { PLAN_CATALOG } from "@/lib/midtrans"

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const SUBSCRIPTION_STATUS: Record<
  string,
  { label: string; className: string }
> = {
  active: {
    label: "Aktif",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  expired: {
    label: "Kedaluwarsa",
    className: "border-red-500/30 bg-red-500/10 text-red-400",
  },
  pending: {
    label: "Menunggu",
    className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  },
}

const INVOICE_STATUS: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  paid: { label: "Lunas", variant: "outline" },
  pending: { label: "Menunggu", variant: "secondary" },
  failed: { label: "Gagal", variant: "destructive" },
}

type SubInfo = {
  planType: string
  status: string
  expiresAt: string | null
  midtransOrderId: string | null
  createdAt: string
}

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingPageFallback />}>
      <BillingPageContent />
    </Suspense>
  )
}

function BillingPageFallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
      <PageHeading
        title="Billing"
        description="Kelola langganan, plan, dan riwayat pembayaran Anda."
      />
      <p className="text-sm text-muted-foreground">Memuat...</p>
    </div>
  )
}

function BillingPageContent() {
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState<SubInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderMessage, setOrderMessage] = useState<string | null>(null)
  const [snapReady, setSnapReady] = useState(false)
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ""

  const refetchSubscription = useCallback(async () => {
    const res = await fetch("/api/studios/me")
    setLoading(false)
    if (!res.ok) return
    const data = await res.json().catch(() => null)
    setSubscription(data?.subscription ?? null)
  }, [])

  useEffect(() => {
    refetchSubscription()
  }, [refetchSubscription])

  useEffect(() => {
    if (!clientKey) return

    let cancelled = false

    loadMidtransSnap()
      .then(() => {
        if (!cancelled) setSnapReady(true)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setSnapReady(false)
        setOrderMessage(
          err instanceof Error
            ? err.message
            : "Gagal memuat gateway pembayaran. Muat ulang halaman.",
        )
      })

    return () => {
      cancelled = true
    }
  }, [clientKey])

  useEffect(() => {
    if (searchParams.get("payment") === "finish") {
      setOrderMessage("Pembayaran selesai. Memperbarui status langganan...")
      refetchSubscription()
    }
  }, [searchParams, refetchSubscription])

  const activePlanMonths = subscription
    ? planTypeToMonths(subscription.planType)
    : null
  const planLabel = subscription
    ? getSubscriptionPlanLabel(subscription.planType)
    : null
  const subStatus = subscription
    ? SUBSCRIPTION_STATUS[subscription.status]
    : SUBSCRIPTION_STATUS.pending

  const invoices = useMemo(() => {
    if (!subscription?.midtransOrderId) return []

    const label = getSubscriptionPlanLabel(subscription.planType)
    const plan = getPlanByType(subscription.planType)
    const amount =
      PLAN_CATALOG[subscription.planType]?.amount ?? plan?.price ?? 0
    const status =
      subscription.status === "active" ? "paid" : subscription.status

    return [
      {
        id: subscription.midtransOrderId,
        planType: `${label.name} (${label.duration})`,
        amount,
        status,
        createdAt: subscription.createdAt,
      },
    ]
  }, [subscription])

  const hasActiveSubscription =
    subscription?.status === "active" &&
    (!subscription.expiresAt || new Date(subscription.expiresAt) > new Date())

  const isTrialSubscription =
    hasActiveSubscription && subscription?.planType === "trial"

  function getSubscribeButtonLabel(planMonths: number): string {
    if (isTrialSubscription) return "Upgrade"
    if (hasActiveSubscription && activePlanMonths !== planMonths) {
      return "Ganti Plan"
    }
    return "Pilih Plan"
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
      <PageHeading
        title="Billing"
        description="Kelola langganan, plan, dan riwayat pembayaran Anda."
      />

      <Card>
        <CardHeader>
          <CardTitle>Plan Saat Ini</CardTitle>
          <CardDescription>
            Kelola langganan dan riwayat pembayaran Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat langganan...</p>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold tracking-tight">
                    {planLabel
                      ? `${planLabel.name} (${planLabel.duration})`
                      : "Belum berlangganan"}
                  </span>
                  <Badge variant="outline" className={subStatus?.className}>
                    {subscription ? subStatus?.label : "Belum aktif"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Berlaku hingga{" "}
                  <span className="font-medium text-foreground">
                    {subscription?.expiresAt
                      ? formatDate(subscription.expiresAt)
                      : "—"}
                  </span>
                </p>
              </div>
              {hasActiveSubscription ? (
                <Button
                  nativeButton={false}
                  variant="outline"
                  render={<a href="/app/builder" />}
                >
                  Buka Builder
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {orderMessage && (
        <p className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          {orderMessage}
        </p>
      )}

      <div className="space-y-4">
        <SectionHeading title="Pilih Plan" />
        <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 2xl:grid-cols-4">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isActive =
              hasActiveSubscription && activePlanMonths === plan.months
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative flex h-full min-w-0 flex-col overflow-visible",
                  plan.popular && "ring-2 ring-primary",
                  isActive && "ring-2 ring-emerald-500/50",
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    <Badge className="whitespace-nowrap bg-primary text-primary-foreground">
                      Paling Populer
                    </Badge>
                  </div>
                )}
                <CardHeader className="pt-6">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.duration}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-4">
                  <div>
                    <span className="text-2xl font-semibold tracking-tight">
                      {formatIDR(plan.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      / {plan.duration.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatIDR(plan.pricePerMonth)} / bulan
                  </p>
                  <ul className="flex-1 space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="min-w-0 break-words text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto w-full">
                  {isActive ? (
                    <Badge
                      variant="outline"
                      className="w-full justify-center border-emerald-500/30 bg-emerald-500/10 py-1.5 text-emerald-400"
                    >
                      Plan Aktif
                    </Badge>
                  ) : (
                    <SubscribeButton
                      months={plan.months}
                      popular={plan.popular}
                      label={getSubscribeButtonLabel(plan.months)}
                      snapReady={snapReady}
                      onMessage={setOrderMessage}
                      onPaymentComplete={refetchSubscription}
                    />
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Invoice</CardTitle>
          <CardDescription>
            Daftar pembayaran yang telah dilakukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada riwayat pembayaran.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const status =
                    INVOICE_STATUS[invoice.status] ?? INVOICE_STATUS.pending
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-xs">
                        {invoice.id.toUpperCase()}
                      </TableCell>
                      <TableCell>{invoice.planType}</TableCell>
                      <TableCell className="font-medium">
                        {formatIDR(invoice.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={status.variant}
                          className={
                            invoice.status === "paid"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : undefined
                          }
                        >
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(invoice.createdAt)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
