"use client"

import { useRef, useState } from "react"
import { Send, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { LeadFormData } from "@/lib/types"

export function BlockLeadForm({
  studioName,
  studioSlug,
  data,
}: {
  studioName: string
  studioSlug?: string
  data?: LeadFormData
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)

  const title = data?.title || "Hubungi kami"
  const description = data?.description || "Punya pertanyaan atau ingin konsultasi? Kirim pesan dan kami akan segera menghubungi Anda."
  const ctaText = data?.ctaText || "Kirim Pesan"

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
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="border-b border-white/10 bg-black text-white">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center md:py-28">
          <div className="mx-auto mb-5 inline-flex size-12 items-center justify-center rounded-full bg-white/10">
            <CheckCircle className="size-5 text-white" />
          </div>
          <h2 className="font-display text-2xl font-light uppercase tracking-[0.16em] text-white md:text-3xl">
            Pesan terkirim
          </h2>
          <p className="mt-4 text-sm text-white/60">
            Terima kasih sudah menghubungi {studioName}. Kami akan segera
            merespons pesan Anda.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="border-b border-white/10 bg-black text-white">
      <div className="mx-auto max-w-2xl px-6 py-20 md:py-28">
        <div className="text-center">
          <h2 className="font-display text-4xl font-light uppercase tracking-[0.16em] text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-sm text-white/60 leading-relaxed">
            {description}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5 rounded-xl border border-white/10 bg-zinc-950 p-6 md:p-8"
        >
          <div className="space-y-2">
            <Label htmlFor="lead-name" className="text-xs uppercase tracking-wider text-white/70">Nama</Label>
            <Input
              id="lead-name"
              placeholder="Nama lengkap Anda"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-white focus:ring-white rounded-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-email" className="text-xs uppercase tracking-wider text-white/70">
              Email <span className="text-zinc-500">(opsional)</span>
            </Label>
            <Input
              id="lead-email"
              type="email"
              placeholder="email@contoh.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-white focus:ring-white rounded-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-message" className="text-xs uppercase tracking-wider text-white/70">Pesan</Label>
            <Textarea
              id="lead-message"
              placeholder="Ceritakan ide tato Anda, pertanyaan, atau hal lain yang ingin ditanyakan..."
              className="min-h-28 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-white focus:ring-white rounded-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {error && (
            <p
              ref={errorRef}
              tabIndex={-1}
              aria-live="assertive"
              className="text-sm text-destructive focus:outline-none"
            >
              {error}
            </p>
          )}

          <Button 
            type="submit" 
            className="w-full bg-white hover:bg-white/90 text-black border border-white/10 uppercase tracking-[0.2em] font-medium text-xs py-3 rounded-none transition-colors" 
            disabled={loading}
          >
            <Send className="size-3.5" data-icon="inline-start" />
            {loading ? "Mengirim…" : ctaText}
          </Button>
        </form>
      </div>
    </section>
  )
}
