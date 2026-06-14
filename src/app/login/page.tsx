"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Particles } from "@/components/ui/particles"
import { BorderBeam } from "@/components/ui/border-beam"
import { authClient } from "@/lib/auth/auth-client"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message ?? "Gagal masuk. Periksa email dan password.")
      return
    }

    const nextPath = searchParams.get("next") ?? "/app/dashboard"
    router.push(nextPath)
    router.refresh()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <Particles className="absolute inset-0 z-0" quantity={30} ease={80} color="var(--brand-scarlet)" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <PlatformLogo variant="auth" />
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8">
          <BorderBeam size={180} duration={14} />
          <PageHeading
            size="sm"
            align="center"
            title="Masuk ke akun Anda"
            description="Masukkan email dan password untuk melanjutkan"
            className="mb-6"
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                id="login-remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="login-remember" className="text-sm font-normal">
                Ingat sesi saya
              </Label>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground hover:underline"
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
