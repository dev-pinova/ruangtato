"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/auth-client"
import { useLanguage } from "@/lib/i18n/language-provider"

export default function ResetPasswordPage() {
  const { t } = useLanguage()
  return (
    <Suspense fallback={<ResetShell>{t.auth.loading}</ResetShell>}>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const tokenError = searchParams.get("error")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (tokenError === "INVALID_TOKEN" || !token) {
    return (
      <ResetShell title={t.auth.resetInvalidToken}>
        <p className="text-sm text-muted-foreground">
          {t.auth.resetInvalidTokenDesc}
        </p>
        <Button
          nativeButton={false}
          className="mt-2 w-full"
          render={<Link href="/forgot-password" />}
        >
          {t.auth.requestNewLink}
        </Button>
      </ResetShell>
    )
  }

  if (success) {
    return (
      <ResetShell title={t.auth.resetSuccessTitle}>
        <p className="text-sm text-muted-foreground">
          {t.auth.resetSuccessDesc}
        </p>
        <Button
          type="button"
          className="mt-2 w-full"
          onClick={() => router.push("/login")}
        >
          {t.auth.loginBtn}
        </Button>
      </ResetShell>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError(t.auth.errorPasswordLength)
      return
    }
    if (password !== confirm) {
      setError(t.auth.errorPasswordMismatch)
      return
    }

    setLoading(true)
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token: token!,
    })
    setLoading(false)

    if (resetError) {
      setError(
        resetError.message ??
          t.auth.errorResetPassword,
      )
      return
    }

    setSuccess(true)
  }

  return (
    <ResetShell title={t.auth.resetTitle} subtitle={t.auth.resetDesc}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="reset-password">{t.auth.newPassword}</Label>
          <Input
            id="reset-password"
            type="password"
            placeholder={t.auth.newPasswordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="reset-confirm">{t.auth.confirmNewPassword}</Label>
          <Input
            id="reset-confirm"
            type="password"
            placeholder={t.auth.confirmNewPasswordPlaceholder}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="mt-2 w-full" disabled={loading}>
          {loading ? t.auth.processing : t.auth.saveNewPassword}
        </Button>
      </form>
    </ResetShell>
  )
}

function ResetShell({
  children,
  title = "Reset password",
  subtitle,
}: {
  children: React.ReactNode
  title?: string
  subtitle?: string
}) {
  const { t } = useLanguage()
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
            title={title}
            description={subtitle}
            className="mb-6"
          />
          <div className="flex flex-col gap-4">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
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
