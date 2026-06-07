"use client"

import { useCallback, useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { loadMidtransSnap } from "@/lib/midtrans-snap"

const PLAN_TYPE_MAP: Record<number, string> = {
  1: "1month",
  3: "3months",
  6: "6months",
  12: "12months",
}

const CREATE_ORDER_TIMEOUT_MS = 30_000
const PENDING_ORDER_STORAGE_KEY = "rt_pending_order"

type CreateOrderResponse = {
  snapToken?: string
  orderId?: string
  planType?: string
  error?: string
}

async function confirmPayment(orderId: string, planType: string) {
  const res = await fetch("/api/billing/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, planType }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "Gagal mengaktifkan langganan setelah pembayaran.",
    )
  }
}

function storePendingOrder(orderId: string, planType: string) {
  sessionStorage.setItem(
    PENDING_ORDER_STORAGE_KEY,
    JSON.stringify({ orderId, planType }),
  )
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

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = CREATE_ORDER_TIMEOUT_MS, ...fetchInit } = init
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, { ...fetchInit, signal: controller.signal })
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export function SubscribeButton({
  months,
  popular,
  label = "Pilih Plan",
  snapReady = false,
  onPaymentComplete,
  onMessage,
}: {
  months: number
  popular?: boolean
  label?: string
  snapReady?: boolean
  onPaymentComplete?: () => void
  onMessage?: (msg: string | null) => void
}) {
  const [loading, setLoading] = useState(false)
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ""

  const handleSubscribe = useCallback(async () => {
    setLoading(true)
    onMessage?.(null)

    if (!clientKey) {
      setLoading(false)
      onMessage?.("Midtrans belum dikonfigurasi.")
      return
    }

    const planType = PLAN_TYPE_MAP[months] ?? "1month"

    try {
      const [snapResult, orderResult] = await Promise.allSettled([
        window.snap?.pay ? Promise.resolve() : loadMidtransSnap(),
        fetchWithTimeout("/api/billing/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planType }),
          timeoutMs: CREATE_ORDER_TIMEOUT_MS,
        }),
      ])

      if (snapResult.status === "rejected") {
        setLoading(false)
        onMessage?.(
          snapResult.reason instanceof Error
            ? snapResult.reason.message
            : "Midtrans Snap belum siap. Muat ulang halaman.",
        )
        return
      }

      if (orderResult.status === "rejected") {
        setLoading(false)
        const isTimeout =
          orderResult.reason instanceof DOMException &&
          orderResult.reason.name === "AbortError"
        onMessage?.(
          isTimeout
            ? "Membuat order terlalu lama. Periksa koneksi internet lalu coba lagi."
            : "Gagal membuat order. Coba lagi.",
        )
        return
      }

      const res = orderResult.value
      const data = (await res.json().catch(() => ({}))) as CreateOrderResponse

      if (!res.ok) {
        setLoading(false)
        onMessage?.(data.error ?? "Gagal membuat order.")
        return
      }

      if (!data.snapToken || !data.orderId || !data.planType) {
        setLoading(false)
        onMessage?.("Snap token tidak tersedia.")
        return
      }

      if (!window.snap?.pay) {
        setLoading(false)
        onMessage?.("Midtrans Snap belum siap. Muat ulang halaman.")
        return
      }

      storePendingOrder(data.orderId, data.planType)

      window.snap.pay(data.snapToken, {
        onSuccess: async () => {
          onMessage?.("Pembayaran berhasil. Mengaktifkan langganan...")
          try {
            await confirmPayment(data.orderId!, data.planType!)
            sessionStorage.removeItem(PENDING_ORDER_STORAGE_KEY)
            onMessage?.("Langganan berhasil diaktifkan.")
          } catch (error) {
            onMessage?.(
              error instanceof Error
                ? error.message
                : "Gagal memverifikasi pembayaran. Muat ulang halaman.",
            )
          }
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
    } catch {
      setLoading(false)
      onMessage?.("Terjadi kesalahan. Coba lagi.")
    }
  }, [months, onMessage, onPaymentComplete, clientKey])

  const isPreparing = Boolean(clientKey) && !snapReady
  const buttonLabel = !clientKey
    ? "Midtrans belum dikonfigurasi"
    : loading
      ? "Memproses..."
      : isPreparing
        ? "Menyiapkan pembayaran..."
        : label

  return (
    <Button
      variant={popular ? "default" : "outline"}
      className="w-full"
      onClick={handleSubscribe}
      disabled={loading || !clientKey || isPreparing}
    >
      {(loading || isPreparing) && (
        <Loader2 className="animate-spin" aria-hidden="true" />
      )}
      {buttonLabel}
    </Button>
  )
}
