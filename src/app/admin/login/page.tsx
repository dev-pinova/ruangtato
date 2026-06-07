"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next") ?? "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <PlatformLogo variant="auth" />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <PageHeading
            size="sm"
            align="center"
            title="Admin Panel"
            description="Login khusus staff internal Ruang Tato"
            className="mb-6"
          />

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
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk Admin"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Bukan staff internal?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Login studio
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AdminLoginForm />
    </Suspense>
  )
}
