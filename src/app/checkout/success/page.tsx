"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Loader2,
  LayoutDashboard,
  ReceiptText,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlatformLogo } from "@/components/brand/platform-logo"
import { SUBSCRIPTION_PLANS } from "@/lib/billing/billing-plans"
import { useLanguage } from "@/lib/i18n/language-provider"

// ── Types ──────────────────────────────────────────────────────────────────────

type TxState = "success" | "pending" | "error" | "loading"

type ConfirmResult = {
  activated: boolean
  planType?: string
  transactionStatus?: string
  paid?: boolean
  subscriptionExpiresAt?: string | null
  message?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isSuccessStatus(status: string | null): boolean {
  return status === "settlement" || status === "capture" || status === "success"
}

function isPendingStatus(status: string | null): boolean {
  return status === "pending"
}

function formatIDR(amount: number, locale: string) {
  if (locale === "en") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
}

function getPlanByType(planType: string | undefined) {
  if (!planType) return null
  return SUBSCRIPTION_PLANS.find((p) => {
    const type = `${p.months}month${p.months > 1 ? "s" : ""}`
    return type === planType
  }) ?? null
}

// ── Konfirmasi ke server ──────────────────────────────────────────────────────

async function confirmPaymentServer(
  orderId: string,
  planType: string,
  errorFallback: string
): Promise<ConfirmResult> {
  const res = await fetch("/api/billing/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, planType }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { activated: false, message: data.error ?? errorFallback }
  }
  return {
    activated: data.status?.activated ?? false,
    planType: data.status?.planType,
    transactionStatus: data.status?.transactionStatus,
    paid: data.status?.paid,
    subscriptionExpiresAt: data.status?.subscriptionExpiresAt ?? null,
    message: data.message,
  }
}

// ── Komponen utama ─────────────────────────────────────────────────────────────

function CheckoutSuccessContent() {
  const { locale, t } = useLanguage()
  const searchParams = useSearchParams()

  const orderId = searchParams.get("order_id") ?? ""
  const rawStatus = searchParams.get("transaction_status")
  const statusCode = searchParams.get("status_code")

  // Derive initial state from URL params (Midtrans Snap / finish URL)
  const initialState: TxState = isSuccessStatus(rawStatus)
    ? "success"
    : isPendingStatus(rawStatus)
    ? "pending"
    : rawStatus === "deny" || rawStatus === "cancel" || rawStatus === "expire" || rawStatus === "failure"
    ? "error"
    : orderId
    ? "loading"   // has order_id but no recognisable status → server-confirm
    : "error"

  const [state, setState] = useState<TxState>(initialState)
  const [confirmResult, setConfirmResult] = useState<ConfirmResult | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [pollingCount, setPollingCount] = useState(0)
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Resolve planType — stored in sessionStorage from subscribe-button
  const pendingOrderRaw =
    typeof window !== "undefined"
      ? sessionStorage.getItem("rt_pending_order")
      : null
  const pendingOrder = (() => {
    try {
      return pendingOrderRaw ? JSON.parse(pendingOrderRaw) as { orderId: string; planType: string } : null
    } catch {
      return null
    }
  })()
  const planType = pendingOrder?.planType ?? ""
  const plan = getPlanByType(planType)

  const doConfirm = useCallback(async () => {
    if (!orderId || !planType) return
    setConfirmLoading(true)
    try {
      const errorFallback = locale === "en" ? "Failed to verify payment." : "Gagal memverifikasi pembayaran."
      const result = await confirmPaymentServer(orderId, planType, errorFallback)
      setConfirmResult(result)
      if (result.activated || result.paid) {
        setState("success")
        // Clean up pending order from sessionStorage once confirmed
        sessionStorage.removeItem("rt_pending_order")
      } else if (result.transactionStatus === "pending") {
        setState("pending")
      } else if (
        result.transactionStatus === "deny" ||
        result.transactionStatus === "cancel" ||
        result.transactionStatus === "expire" ||
        result.transactionStatus === "failure"
      ) {
        setState("error")
      }
    } catch {
      // keep current state, allow retry
    } finally {
      setConfirmLoading(false)
    }
  }, [orderId, planType, locale])

  // Run server confirm on mount when status is "loading" or "success"
  useEffect(() => {
    if ((state === "loading" || state === "success") && orderId && planType) {
      doConfirm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-poll every 8s for up to 5 times if status is pending
  useEffect(() => {
    if (state !== "pending" || pollingCount >= 5) return
    pollTimerRef.current = setTimeout(async () => {
      await doConfirm()
      setPollingCount((c) => c + 1)
    }, 8_000)
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
    }
  }, [state, pollingCount, doConfirm])

  const expiresAt = confirmResult?.subscriptionExpiresAt

  // ── Render helpers ──────────────────────────────────────────────────────────

  const StatusIcon = () => {
    if (state === "loading") {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 ring-4 ring-muted">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      )
    }
    if (state === "success") {
      return (
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-success/10 ring-4 ring-success/30">
          <CheckCircle2 className="h-10 w-10 text-success" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-success/20" />
        </div>
      )
    }
    if (state === "pending") {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 ring-4 ring-amber-500/30">
          <Clock className="h-10 w-10 text-amber-500" />
        </div>
      )
    }
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/30">
        <XCircle className="h-10 w-10 text-destructive" />
      </div>
    )
  }

  const title = (() => {
    if (state === "loading") return t.checkoutSuccess.loading
    if (state === "success") return t.checkoutSuccess.success
    if (state === "pending") return t.checkoutSuccess.pending
    return t.checkoutSuccess.failed
  })()

  const description = (() => {
    if (state === "loading") return t.checkoutSuccess.loadingDesc
    if (state === "success") return t.checkoutSuccess.successDesc
    if (state === "pending") return t.checkoutSuccess.pendingDesc
    return t.checkoutSuccess.failedDesc
  })()

  const getPlanDurationLabel = (plan: any) => {
    return t.pendingPayment.durationLabel.replace("{duration}", String(plan.months))
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 selection:bg-primary selection:text-primary-foreground">
      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className={`absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full blur-[120px] transition-colors duration-700 ${
          state === "success" ? "bg-success/8" : state === "pending" ? "bg-amber-500/8" : "bg-primary/8"
        }`} />
        <div className={`absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full blur-[120px] transition-colors duration-700 ${
          state === "success" ? "bg-success/5" : state === "pending" ? "bg-amber-500/5" : "bg-primary/5"
        }`} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <PlatformLogo variant="auth" />
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-card/50 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center gap-5 px-8 pt-10 pb-8 text-center">
            <StatusIcon />

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto">
                {description}
              </p>
            </div>

            {/* Status badge */}
            {rawStatus && state !== "loading" && (
              <Badge
                variant={state === "success" ? "default" : state === "pending" ? "secondary" : "destructive"}
                className={state === "success" ? "bg-success/15 text-success hover:bg-success/25" : ""}
              >
                {state === "success" ? t.checkoutSuccess.statusLabel.success : state === "pending" ? t.checkoutSuccess.statusLabel.pending : t.checkoutSuccess.statusLabel.failed}
              </Badge>
            )}
          </div>

          {/* Details */}
          {(state === "success" || state === "pending") && (plan || orderId) && (
            <div className="mx-6 mb-6 rounded-xl border border-white/5 bg-background/40 divide-y divide-white/5">
              {orderId && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">{t.checkoutSuccess.table.orderId}</span>
                  <span className="text-xs font-mono text-foreground truncate max-w-[180px]">{orderId}</span>
                </div>
              )}
              {statusCode && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">{t.checkoutSuccess.table.statusCode}</span>
                  <span className="text-xs font-mono text-foreground">{statusCode}</span>
                </div>
              )}
              {plan && (
                <>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs font-medium text-muted-foreground">{t.checkoutSuccess.table.plan}</span>
                    <span className="text-xs font-semibold text-foreground">{plan.name} — {getPlanDurationLabel(plan)}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs font-medium text-muted-foreground">{t.checkoutSuccess.table.amount}</span>
                    <span className="text-xs font-semibold text-foreground">{formatIDR(plan.price, locale)}</span>
                  </div>
                </>
              )}
              {state === "success" && expiresAt && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">{t.checkoutSuccess.table.expiresAt}</span>
                  <span className="text-xs font-semibold text-foreground">{formatDate(expiresAt, locale)}</span>
                </div>
              )}
              {state === "pending" && (
                <div className="px-4 py-3">
                  <p className="text-xs text-amber-500/90 leading-relaxed">
                    {t.checkoutSuccess.table.pendingNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Polling indicator */}
          {state === "pending" && pollingCount < 5 && (
            <div className="mx-6 mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t.checkoutSuccess.polling}</span>
            </div>
          )}

          {/* CTAs */}
          <div className="px-6 pb-8 space-y-3">
            {state === "success" && (
              <>
                <Link
                  href="/app/builder"
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--radius)] border border-white/10 bg-[var(--brand-scarlet)] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_24px_oklch(0.62_0.21_25/0.4)] active:scale-[0.99]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t.checkoutSuccess.btnStartDesign}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  {/* shimmer overlay */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
                </Link>
                <Button
                  variant="ghost"
                  className="w-full"
                  render={<Link href="/app/dashboard" />}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t.checkoutSuccess.btnDashboard}
                </Button>
              </>
            )}

            {state === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={doConfirm}
                  disabled={confirmLoading}
                >
                  {confirmLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {t.checkoutSuccess.btnCheckStatus}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  render={<Link href="/app/dashboard" />}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t.checkoutSuccess.btnTempDashboard}
                </Button>
              </>
            )}

            {state === "loading" && (
              <Button variant="outline" className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.checkoutSuccess.btnVerifying}
              </Button>
            )}

            {state === "error" && (
              <>
                <Button
                  className="w-full"
                  render={<Link href="/checkout" />}
                >
                  {t.checkoutSuccess.btnTryAgain}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  render={<Link href="/app/billing" />}
                >
                  <ReceiptText className="mr-2 h-4 w-4" />
                  {t.checkoutSuccess.btnViewHistory}
                </Button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 px-6 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              {locale === "en" ? (
                <>
                  Any issues?{" "}
                  <a
                    href="mailto:billing@ruangtato.com"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    Contact billing support
                  </a>
                </>
              ) : (
                <>
                  Ada kendala?{" "}
                  <a
                    href="mailto:billing@ruangtato.com"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    Hubungi billing support
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
