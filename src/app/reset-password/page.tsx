"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetShell>Memuat...</ResetShell>}>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordContent() {
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
      <ResetShell title="Tautan tidak valid">
        <p className="text-sm text-muted-foreground">
          Tautan reset password sudah tidak berlaku atau pernah digunakan.
          Silakan minta tautan baru.
        </p>
        <Link
          href="/forgot-password"
          className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
        >
          Minta tautan baru
        </Link>
      </ResetShell>
    )
  }

  if (success) {
    return (
      <ResetShell title="Password berhasil direset">
        <p className="text-sm text-muted-foreground">
          Password Anda sudah diperbarui. Silakan masuk dengan password baru
          Anda.
        </p>
        <Button
          type="button"
          className="mt-2 w-full"
          onClick={() => router.push("/login")}
        >
          Masuk
        </Button>
      </ResetShell>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password minimal 8 karakter.")
      return
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok.")
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
          "Gagal mereset password. Tautan mungkin sudah kedaluwarsa.",
      )
      return
    }

    setSuccess(true)
  }

  return (
    <ResetShell title="Buat password baru" subtitle="Masukkan password baru untuk akun Anda.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="reset-password">Password baru</Label>
          <Input
            id="reset-password"
            type="password"
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="reset-confirm">Konfirmasi password</Label>
          <Input
            id="reset-confirm"
            type="password"
            placeholder="Ulangi password baru"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="mt-2 w-full" disabled={loading}>
          {loading ? "Memproses..." : "Simpan password baru"}
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
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-base font-semibold tracking-tight text-foreground"
          >
            <span className="relative inline-flex size-6 items-center justify-center rounded-md bg-primary">
              <span className="size-2 rounded-sm bg-primary-foreground" />
            </span>
            Ruang Tato
          </Link>
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
            Kembali ke login
          </Link>
        </p>
      </div>
    </div>
  )
}
