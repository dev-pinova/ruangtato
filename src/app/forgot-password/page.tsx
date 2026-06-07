"use client"

import { useState } from "react"
import Link from "next/link"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: requestError } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    })

    setLoading(false)

    if (requestError) {
      setError(
        requestError.message ??
          "Gagal mengirim email reset password. Coba lagi sebentar.",
      )
      return
    }

    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <PlatformLogo variant="auth" />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <PageHeading
            size="sm"
            align="center"
            title="Lupa password?"
            description="Masukkan email akun Anda dan kami akan mengirimkan tautan untuk mereset password."
            className="mb-6"
          />

          {submitted ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-foreground">
                Jika email <span className="font-medium">{email}</span>{" "}
                terdaftar di sistem kami, kami sudah mengirimkan tautan reset
                password. Periksa kotak masuk Anda (dan folder spam) dalam
                beberapa menit ke depan.
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSubmitted(false)
                  setEmail("")
                }}
              >
                Kirim ulang ke email lain
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="mt-2 w-full" disabled={loading}>
                {loading ? "Mengirim..." : "Kirim tautan reset"}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ingat password Anda?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Kembali ke login
          </Link>
        </p>
      </div>
    </div>
  )
}
