"use client"

import { useState } from "react"
import { Send, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function BlockLeadForm({
  studioName,
  studioSlug,
}: {
  studioName: string
  studioSlug?: string
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    if (!studioSlug) {
      setSubmitted(true)
      return
    }

    setLoading(true)
    setError(null)

    const res = await fetch(`/api/studios/${studioSlug}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: email || undefined, message }),
    })

    setLoading(false)

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? "Gagal mengirim pesan.")
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6 md:py-28">
          <div className="mx-auto mb-5 inline-flex size-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="size-5 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Pesan terkirim
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Terima kasih sudah menghubungi {studioName}. Kami akan segera
            merespons pesan Anda.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-2xl px-4 py-20 md:px-6 md:py-28">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Hubungi kami
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Punya pertanyaan atau ingin konsultasi? Kirim pesan dan kami akan
            segera menghubungi Anda.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5 rounded-xl border border-border bg-card p-6 md:p-8"
        >
          <div className="space-y-2">
            <Label htmlFor="lead-name">Nama</Label>
            <Input
              id="lead-name"
              placeholder="Nama lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-email">
              Email <span className="text-muted-foreground">(opsional)</span>
            </Label>
            <Input
              id="lead-email"
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-message">Pesan</Label>
            <Textarea
              id="lead-message"
              placeholder="Ceritakan ide tato Anda, pertanyaan, atau hal lain yang ingin ditanyakan..."
              className="min-h-28"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            <Send className="size-4" data-icon="inline-start" />
            {loading ? "Mengirim..." : "Kirim Pesan"}
          </Button>
        </form>
      </div>
    </section>
  )
}
