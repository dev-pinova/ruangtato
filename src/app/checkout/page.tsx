"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ShieldCheck, CreditCard, Lock, CheckCircle2, AlertCircle } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { SubscribeButton } from "@/components/billing/subscribe-button"
import { loadMidtransSnap } from "@/lib/billing/midtrans-snap"
import { PlatformLogo } from "@/components/brand/platform-logo"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const isUnpaid = searchParams.get("status") === "unpaid"
  const isWelcome = searchParams.get("welcome") === "1"

  const [snapReady, setSnapReady] = useState(false)
  const [orderMessage, setOrderMessage] = useState<string | null>(null)

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ""

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

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-16 selection:bg-red-600 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-red-900/10 blur-[120px]" />
        <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-red-950/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand Logo */}
        <div className="mb-10 flex justify-center">
          <PlatformLogo variant="auth" />
        </div>

        {/* Warning Notification if kicked back from dashboard */}
        {isUnpaid && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-900/30 bg-red-950/25 p-4 text-sm text-red-400 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <div className="space-y-1">
              <p className="font-semibold text-red-300">Akses Dibatasi</p>
              <p>Selesaikan pembayaran sebesar Rp 799.000 terlebih dahulu untuk mengaktifkan fitur Builder.</p>
            </div>
          </div>
        )}

        {/* Welcome Notification */}
        {isWelcome && !isUnpaid && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-900/30 bg-emerald-950/25 p-4 text-sm text-emerald-400 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-300">Pendaftaran Berhasil!</p>
              <p>Studio Anda telah terdaftar. Langkah terakhir, aktifkan langganan Anda untuk mulai mendesain landing page.</p>
            </div>
          </div>
        )}

        {/* Premium Checkout Card */}
        <Card className="border border-white/5 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
          <CardHeader className="border-b border-white/5 pb-6">
            <div className="flex items-center gap-2 text-red-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-4 w-4" /> Secure checkout
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Aktifkan Builder Anda
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Mulai buat landing page profesional berkonversi tinggi untuk studio tato Anda.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Price breakdown */}
            <div className="rounded-lg bg-zinc-950/60 p-5 border border-white/5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-zinc-400">Paket Pro (12 Bulan)</span>
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  Rp 799.000
                </span>
              </div>
              <div className="mt-2 border-t border-white/5 pt-2 flex items-center justify-between text-xs text-zinc-500">
                <span>Total tagihan (Termasuk PPN)</span>
                <span>Rp 799.000 / tahun</span>
              </div>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                Yang Anda Dapatkan:
              </p>
              <ul className="space-y-2.5">
                {[
                  "Akses penuh Halaman Builder Drag-and-drop",
                  "11 blok landing page studio tato premium",
                  "Formulir lead konsultasi terintegrasi",
                  "Metrik analitik kunjungan dan klik WhatsApp",
                  "Tampil gratis di direktori showcase utama",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <CheckCircle2 className="h-4.5 w-4.5 mt-0.5 shrink-0 text-red-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Error/Status Message */}
            {orderMessage && (
              <div className="rounded-md border border-white/5 bg-zinc-950/60 p-3.5 text-center text-xs text-zinc-400">
                {orderMessage}
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t border-white/5 pt-6 flex flex-col gap-4">
            <SubscribeButton
              months={12}
              popular={true}
              label="Bayar Sekarang"
              snapReady={snapReady}
              onMessage={setOrderMessage}
              onPaymentComplete={() => {
                // When payment is done successfully, redirect user to the app dashboard
                window.location.href = "/app/dashboard"
              }}
            />

            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
              <Lock className="h-3.5 w-3.5" />
              <span>Pembayaran diproses secara aman oleh Midtrans</span>
            </div>
          </CardFooter>
        </Card>

        {/* Support links */}
        <p className="mt-8 text-center text-xs text-zinc-500">
          Butuh bantuan? Hubungi billing support kami di{" "}
          <a href="mailto:billing@ruangtato.com" className="text-zinc-400 hover:text-red-500 hover:underline">
            billing@ruangtato.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-sm text-zinc-400">Memuat halaman checkout...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
