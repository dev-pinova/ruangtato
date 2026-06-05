"use client"

import { useState } from "react"
import { Send, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { H2, P } from "@/components/ui/typography"

export function BlockLeadForm({ studioName }: { studioName: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="border-y border-white/5 bg-zinc-950 py-20">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="mx-auto mb-6 inline-flex rounded-full bg-primary/20 p-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <H2 className="mb-3 text-3xl">Pesan Terkirim!</H2>
          <P className="text-base text-white/70">
            Terima kasih sudah menghubungi {studioName}. Kami akan segera merespons pesan Anda.
          </P>
        </div>
      </section>
    )
  }

  return (
    <section className="border-y border-white/5 bg-zinc-950 py-20">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-10 text-center">
          <H2 className="mb-3 text-3xl md:text-4xl">Hubungi Kami</H2>
          <P className="text-base text-white/70">
            Punya pertanyaan atau ingin konsultasi? Kirim pesan dan kami akan segera menghubungi Anda.
          </P>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="lead-name">Nama *</Label>
              <Input
                id="lead-name"
                placeholder="Nama lengkap Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="lead-email">Email (opsional)</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="lead-message">Pesan *</Label>
              <Textarea
                id="lead-message"
                placeholder="Ceritakan ide tato Anda, pertanyaan, atau hal lain yang ingin ditanyakan..."
                className="min-h-28 rounded-2xl border-white/10 bg-white/5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full rounded-2xl">
              <Send className="mr-2 h-4 w-4" />
              Kirim Pesan
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
