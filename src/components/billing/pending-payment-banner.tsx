"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, X, ArrowRight } from "lucide-react"

type PendingStatus = {
  hasPending: boolean
  orderId?: string
  planType?: string
  createdAt?: string
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)

  if (minutes < 60) return `${minutes} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  })
}

function getPlanLabel(planType: string | undefined): string {
  const labels: Record<string, string> = {
    "1month": "Starter (1 Bulan)",
    "3months": "Growth (3 Bulan)",
    "6months": "Pro (6 Bulan)",
    "12months": "Enterprise (12 Bulan)",
  }
  return planType ? (labels[planType] ?? planType) : "Langganan"
}

/**
 * Banner kuning yang muncul ketika ada payment dengan status `pending`
 * untuk studio yang sedang login. Dapat di-dismiss (hanya untuk sesi ini).
 */
export function PendingPaymentBanner() {
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

  return (
    <div
      role="alert"
      className="relative flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3.5 text-sm animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-amber-600 dark:text-amber-400">
          Pembayaran Menunggu Konfirmasi
        </p>
        <p className="mt-0.5 text-amber-700/80 dark:text-amber-300/80 leading-relaxed">
          Paket{" "}
          <span className="font-semibold">{getPlanLabel(status.planType)}</span>{" "}
          (order{" "}
          <span className="font-mono text-xs">{status.orderId?.slice(0, 16)}…</span>
          {status.createdAt && ` — ${formatRelativeTime(status.createdAt)}`}
          ) sedang menunggu konfirmasi dari Midtrans. Langganan akan aktif
          otomatis setelah pembayaran berhasil.
        </p>
        <Link
          href={`/checkout/success?order_id=${status.orderId}&transaction_status=pending`}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline underline-offset-4"
        >
          Cek Status Pembayaran
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <button
        type="button"
        aria-label="Tutup banner"
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded-md p-0.5 text-amber-500/70 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
