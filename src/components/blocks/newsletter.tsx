"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"

import type { NewsletterData } from "@/lib/types"
import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

export function BlockNewsletter({ data, locale = "id" }: { data: NewsletterData; locale?: string }) {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const eyebrow = getLocalizedText(data, "eyebrow", locale, "Newsletter")
  const headline = getLocalizedText(
    data,
    "headline",
    locale,
    locale === "en" ? "Subscribe To Our Newsletter" : "Berlangganan Newsletter Kami"
  )
  const description = getLocalizedText(data, "description", locale)
  const placeholder = getLocalizedText(
    data,
    "placeholder",
    locale,
    locale === "en" ? "Enter your email…" : "Masukkan email Anda…"
  )
  const ctaText = getLocalizedText(
    data,
    "ctaText",
    locale,
    locale === "en" ? "Subscribe" : "Berlangganan"
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
  }

  return (
    <section className="border-y border-white/10 bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-24 text-center md:px-10 md:py-32">
        <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
          — {eyebrow}
        </p>
        <h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">
          {headline}
        </h2>
        {description && (
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
            {description}
          </p>
        )}

        {done ? (
          <div
            aria-live="polite"
            className="mx-auto mt-12 inline-flex items-center gap-3 border border-white/30 px-8 py-4 font-display text-[11px] uppercase tracking-[0.4em] text-white"
          >
            <Check className="size-4" />
            {locale === "en" ? "Subscribed" : "Berhasil Berlangganan"}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:gap-0"
          >
            <input
              type="email"
              required
              name="email"
              autoComplete="email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="flex-1 border border-white/20 bg-transparent px-6 py-3 font-display text-xs uppercase tracking-[0.2em] text-white placeholder:text-white/30 focus:border-white focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 border border-white/40 bg-transparent px-8 py-3 font-display text-[11px] uppercase tracking-[0.4em] text-white transition-colors hover:border-white hover:bg-white hover:text-black sm:border-l-0"
            >
              {ctaText}
              <ArrowRight className="size-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
