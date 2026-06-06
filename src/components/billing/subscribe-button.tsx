"use client"

import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { loadMidtransSnap } from "@/lib/midtrans-snap"

const PLAN_TYPE_MAP: Record<number, string> = {
  1: "1month",
  3: "3months",
  6: "6months",
  12: "12months",
}

type SnapResult = {
  order_id?: string
  transaction_status?: string
}

type SnapPayOptions = {
  onSuccess?: (result: SnapResult) => void
  onPending?: (result: SnapResult) => void
  onError?: (result: SnapResult) => void
  onClose?: () => void
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options?: SnapPayOptions) => void
    }
  }
}

export function SubscribeButton({
  months,
  popular,
  label = "Pilih Plan",
  onPaymentComplete,
  onMessage,
}: {
  months: number
  popular?: boolean
  label?: string
  onPaymentComplete?: () => void
  onMessage?: (msg: string | null) => void
}) {
  const [loading, setLoading] = useState(false)
  const [snapReady, setSnapReady] = useState(false)
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ""

  useEffect(() => {
    if (!clientKey) return

    let cancelled = false

    loadMidtransSnap()
      .then(() => {
        if (!cancelled) setSnapReady(true)
      })
      .catch(() => {
        if (!cancelled) setSnapReady(false)
      })

    return () => {
      cancelled = true
    }
  }, [clientKey])

  const handleSubscribe = useCallback(async () => {
    setLoading(true)
    onMessage?.(null)

    if (!clientKey) {
      setLoading(false)
      onMessage?.("Midtrans belum dikonfigurasi.")
      return
    }

    try {
      if (!window.snap?.pay) {
        await loadMidtransSnap()
        setSnapReady(true)
      }
    } catch {
      setLoading(false)
      onMessage?.("Midtrans Snap belum siap. Muat ulang halaman.")
      return
    }

    const planType = PLAN_TYPE_MAP[months] ?? "1month"
    const res = await fetch("/api/billing/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planType }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setLoading(false)
      onMessage?.(data.error ?? "Gagal membuat order.")
      return
    }

    if (!data.snapToken) {
      setLoading(false)
      onMessage?.("Snap token tidak tersedia.")
      return
    }

    if (!window.snap?.pay) {
      setLoading(false)
      onMessage?.("Midtrans Snap belum siap. Muat ulang halaman.")
      return
    }

    window.snap.pay(data.snapToken, {
      onSuccess: () => {
        onMessage?.("Pembayaran berhasil. Mengaktifkan langganan...")
        onPaymentComplete?.()
        setLoading(false)
      },
      onPending: () => {
        onMessage?.(
          "Pembayaran menunggu konfirmasi. Status akan diperbarui otomatis.",
        )
        onPaymentComplete?.()
        setLoading(false)
      },
      onError: () => {
        onMessage?.("Pembayaran gagal atau dibatalkan.")
        setLoading(false)
      },
      onClose: () => {
        setLoading(false)
      },
    })
  }, [months, onMessage, onPaymentComplete, clientKey])

  const buttonLabel = !clientKey
    ? "Midtrans belum dikonfigurasi"
    : loading
      ? "Memproses..."
      : label

  return (
    <Button
      variant={popular ? "default" : "outline"}
      className="w-full"
      onClick={handleSubscribe}
      disabled={loading || !clientKey}
      title={
        !snapReady && clientKey
          ? "Pembayaran Midtrans sedang dimuat di latar belakang"
          : undefined
      }
    >
      {buttonLabel}
    </Button>
  )
}
