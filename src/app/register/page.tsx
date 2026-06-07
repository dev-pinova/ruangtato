"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [waNumber, setWaNumber] = useState("")
  const [city, setCity] = useState("")
  const [studioName, setStudioName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, waNumber, city, studioName, password }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(
        typeof data.error === "string"
          ? data.error
          : "Gagal mendaftar. Coba lagi.",
      )
      return
    }

    router.push("/app/builder?welcome=1")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <PlatformLogo variant="auth" />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <PageHeading
            size="sm"
            align="center"
            title="Buat akun baru"
            description="Daftar untuk membuat landing page studio Anda"
            className="mb-6"
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-name">Nama Lengkap</Label>
              <Input
                id="reg-name"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-whatsapp">Nomor WhatsApp</Label>
              <Input
                id="reg-whatsapp"
                type="tel"
                placeholder="6281234567890"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-city">Kota</Label>
              <Input
                id="reg-city"
                placeholder="Jakarta"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-studio">Nama Studio</Label>
              <Input
                id="reg-studio"
                placeholder="Nama studio tato Anda"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
