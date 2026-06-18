"use client"

import { useState } from "react"
import Link from "next/link"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/auth-client"
import { useLanguage } from "@/lib/i18n/language-provider"

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
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
          t.auth.errorForgot,
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
            title={t.auth.forgotPasswordTitle}
            description={t.auth.forgotPasswordDesc}
            className="mb-6"
          />

          {submitted ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-foreground">
                {t.auth.forgotSuccessMsg.replace("{email}", email)}
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
                {t.auth.resendToOtherEmail}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="forgot-email">{t.auth.email}</Label>
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
                {loading ? t.auth.sending : t.auth.sendResetLink}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.auth.rememberPassword}{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            {t.auth.backToLogin}
          </Link>
        </p>
      </div>
    </div>
  )
}
