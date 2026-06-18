"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, X, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-provider"

type PendingStatus = {
  hasPending: boolean
  orderId?: string
  planType?: string
  createdAt?: string
}

function formatRelativeTime(isoString: string, t: any, locale: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)

  if (minutes < 60) {
    return t.pendingPayment.relativeTime.minutes.replace("{count}", String(minutes))
  }
  if (hours < 24) {
    return t.pendingPayment.relativeTime.hours.replace("{count}", String(hours))
  }
  return new Date(isoString).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "short",
  })
}

function getPlanLabel(planType: string | undefined, t: any): string {
  if (!planType) return t.pendingPayment.defaultPlan

  const duration1 = t.pendingPayment.durationLabel.replace("{duration}", "1")
  const duration3 = t.pendingPayment.durationLabel.replace("{duration}", "3")
  const duration6 = t.pendingPayment.durationLabel.replace("{duration}", "6")
  const duration12 = t.pendingPayment.durationLabel.replace("{duration}", "12")

  const labels: Record<string, string> = {
    "1month": t.pendingPayment.starter.replace("{duration}", duration1),
    "3months": t.pendingPayment.growth.replace("{duration}", duration3),
    "6months": t.pendingPayment.pro.replace("{duration}", duration6),
    "12months": t.pendingPayment.enterprise.replace("{duration}", duration12),
  }
  return labels[planType] ?? planType
}

/**
 * Banner kuning yang muncul ketika ada payment dengan status `pending`
 * untuk studio yang sedang login. Dapat di-dismiss (hanya untuk sesi ini).
 */
export function PendingPaymentBanner() {
  const { locale, t } = useLanguage()
  const [status, setStatus] = useState<PendingStatus | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch("/api/billing/pending-status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: PendingStatus | null) => {
        if (data?.hasPending) setStatus(data)
      })
      .catch(() => {})
  }, [])

  if (!status?.hasPending || dismissed) return null

  const displayPlan = getPlanLabel(status.planType, t)
  const displayOrderId = status.orderId?.slice(0, 16) ?? ""
  const displayRelative = status.createdAt ? ` — ${formatRelativeTime(status.createdAt, t, locale)}` : ""

  const descText = t.pendingPayment.desc
    .replace("{plan}", displayPlan)
    .replace("{orderId}", displayOrderId + "…")
    .split(")")
  
  // Custom format description to preserve time and orderId truncation structure
  const formattedDesc = (
    <>
      {t.pendingPayment.desc
        .replace("{plan}", displayPlan)
        .replace("{orderId}", `${displayOrderId}…${displayRelative}`)}
    </>
  )

  return (
    <div
      role="alert"
      className="relative flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3.5 text-sm animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-amber-600 dark:text-amber-400">
          {t.pendingPayment.title}
        </p>
        <p className="mt-0.5 text-amber-700/80 dark:text-amber-300/80 leading-relaxed">
          {formattedDesc}
        </p>
        <Link
          href={`/checkout/success?order_id=${status.orderId}&transaction_status=pending`}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline underline-offset-4"
        >
          {t.pendingPayment.checkStatus}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <button
        type="button"
        aria-label={t.pendingPayment.closeAlert}
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded-md p-0.5 text-amber-500/70 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

