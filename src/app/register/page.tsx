"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { PlatformLogo } from "@/components/brand/platform-logo"
import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Particles } from "@/components/ui/particles"
import { BorderBeam } from "@/components/ui/border-beam"
import { useLanguage } from "@/lib/i18n/language-provider"

export default function RegisterPage() {
  const { t } = useLanguage()
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
          : "Gagal mendaftar. Coba lagi.", // Keep this fallback generic or translate it later
      )
      return
    }

    router.push("/app/dashboard?welcome=1")
    router.refresh()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <Particles className="absolute inset-0 z-0" quantity={30} ease={80} color="var(--brand-scarlet)" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <PlatformLogo variant="auth" />
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8">
          <BorderBeam size={200} duration={14} />
          <PageHeading
            size="sm"
            align="center"
            title={t.auth.registerTitle}
            description={t.auth.registerDesc}
            className="mb-6"
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-name">{t.auth.name}</Label>
              <Input
                id="reg-name"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-email">{t.auth.email}</Label>
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
              <Label htmlFor="reg-password">{t.auth.password}</Label>
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
              {loading ? t.auth.processing : t.auth.registerBtn}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.auth.hasAccount}{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            {t.auth.loginBtn}
          </Link>
        </p>
      </div>
    </div>
  )
}
