"use client"

import { useCallback, useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-provider"

const PLAN_TYPE_MAP: Record<number, string> = {
  1: "1month",
  3: "3months",
  6: "6months",
  12: "12months",
}

const CREATE_ORDER_TIMEOUT_MS = 30_000
const PENDING_ORDER_STORAGE_KEY = "rt_pending_order"

function storePendingOrder(orderId: string, planType: string) {
  sessionStorage.setItem(
    PENDING_ORDER_STORAGE_KEY,
    JSON.stringify({ orderId, planType }),
  )
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
  snapReady = false, // Kept for backwards compatibility
  onMessage,
}: {
  months: number
  popular?: boolean
  label?: string
  snapReady?: boolean
  onPaymentComplete?: () => void
  onMessage?: (msg: string | null) => void
}) {
  const { locale, t } = useLanguage()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = useCallback(async () => {
    setLoading(true)
    onMessage?.(null)

    const planType = PLAN_TYPE_MAP[months] ?? "1month"

    try {
      const orderResult = await fetchWithTimeout("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
        timeoutMs: CREATE_ORDER_TIMEOUT_MS,
      })

      const data = (await orderResult.json().catch(() => ({}))) as {
        paymentUrl?: string
        orderId?: string
        planType?: string
        error?: string
      }

      if (!orderResult.ok) {
        setLoading(false)
        onMessage?.(data.error ?? (locale === "en" ? "Failed to create order." : "Gagal membuat order."))
        return
      }

      if (!data.paymentUrl || !data.orderId || !data.planType) {
        setLoading(false)
        onMessage?.(locale === "en" ? "Payment URL not available." : "URL Pembayaran tidak tersedia.")
        return
      }

      storePendingOrder(data.orderId, data.planType)

      // Redirect directly to Duitku payment page
      window.location.href = data.paymentUrl
    } catch (error) {
      setLoading(false)
      const isTimeout = error instanceof DOMException && error.name === "AbortError"
      onMessage?.(
        isTimeout
          ? (locale === "en" ? "Order creation timed out. Check your internet connection." : "Koneksi terputus. Silakan coba lagi.")
          : (locale === "en" ? "An error occurred. Please try again." : "Terjadi kesalahan. Coba lagi.")
      )
    }
  }, [months, onMessage, locale])

  const buttonLabel = loading
    ? t.auth.processing
    : label

  return (
    <Button
      variant={popular ? "default" : "outline"}
      size="lg"
      className="w-full"
      onClick={handleSubscribe}
      disabled={loading}
    >
      {loading && (
        <Loader2 className="animate-spin size-4 shrink-0" aria-hidden="true" />
      )}
      {buttonLabel}
    </Button>
  )
}
