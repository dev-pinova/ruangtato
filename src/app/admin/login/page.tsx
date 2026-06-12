"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { authClient } from "@/lib/auth/auth-client"

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next") ?? "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let active = true
    fetch("/api/admin/me")
      .then((res) => {
        if (res.ok && active) {
          router.push(nextPath.startsWith("/admin") ? nextPath : "/admin")
        } else if (active) {
          setCheckingSession(false)
        }
      })
      .catch(() => {
        if (active) setCheckingSession(false)
      })
    return () => {
      active = false
    }
  }, [router, nextPath])

  if (checkingSession) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    })

    if (signInError) {
      setLoading(false)
      setError(signInError.message ?? "Gagal masuk. Periksa email dan password.")
      return
    }

    const meResponse = await fetch("/api/admin/me")
    setLoading(false)

    if (!meResponse.ok) {
      await authClient.signOut()
      setError("Akun ini tidak memiliki akses panel admin.")
      return
    }

    router.push(nextPath.startsWith("/admin") ? nextPath : "/admin")
    router.refresh()
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(1_0_0/0.04),transparent_55%)]"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <PlatformLogo variant="auth" />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-lg shadow-black/20 md:p-8">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-xl font-semibold tracking-tight">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Login khusus staff internal Ruang Tato
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@ruangtato.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="min-h-11"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="min-h-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="admin-remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="admin-remember" className="text-sm font-normal">
                Ingat sesi saya
              </Label>
            </div>
            {error ? (
              <p role="alert" aria-live="polite" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              className="mt-2 min-h-11 w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk Admin"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Bukan staff internal?{" "}
          <Link
            href="/"
            className="font-medium text-primary transition-colors hover:underline"
          >
            Kembali ke situs
          </Link>
          {" · "}
          <Link
            href="/login"
            className="font-medium text-foreground transition-colors hover:underline"
          >
            Login studio
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
