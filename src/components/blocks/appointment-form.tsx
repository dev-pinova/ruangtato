"use client"

import { useRef, useState } from "react"
import { ArrowRight, Check, CheckCircle } from "lucide-react"

import { normalizeGoogleMapsEmbedUrl } from "@/lib/google-maps-embed"
import type { AppointmentFormData } from "@/lib/types"
import { getLocalizedText } from "@/lib/studio/i18n-block-utils"

const DEFAULT_MAP_HEIGHT = 420

export function BlockAppointmentForm({
  data,
  studioSlug,
  studioName,
  locale = "id",
}: {
  data: AppointmentFormData
  studioSlug?: string
  studioName?: string
  locale?: string
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [ageOk, setAgeOk] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)

  const requireAge = data?.requireAge !== false
  const ageLabel = getLocalizedText(
    data,
    "ageLabel",
    locale,
    locale === "en" ? "Are you 18 years old or older?" : "Apakah Anda berusia 18 tahun atau lebih?"
  )
  const headline = getLocalizedText(
    data,
    "headline",
    locale,
    locale === "en" ? "Book An Appointment" : "Buat Janji Temu"
  )
  const subheadline = getLocalizedText(
    data,
    "subheadline",
    locale,
    locale === "en"
      ? "Fill out the form below for consultation and tattoo session scheduling."
      : "Isi formulir di bawah untuk konsultasi dan penjadwalan sesi tato."
  )
  const ctaText = getLocalizedText(
    data,
    "ctaText",
    locale,
    locale === "en" ? "Send Request" : "Kirim Permintaan"
  )

  const showMap = data?.showMap === true
  const mapHeight = data?.mapHeight ?? DEFAULT_MAP_HEIGHT
  const mapEmbedUrl = data?.mapEmbedUrl?.trim() ?? ""
  const normalizedMapUrl = mapEmbedUrl
    ? normalizeGoogleMapsEmbedUrl(mapEmbedUrl)
    : null
  const showMapSection = showMap && !submitted

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    if (requireAge && !ageOk) {
      setError(
        locale === "en"
          ? "Please confirm that you are 18 years old or older."
          : "Mohon konfirmasi bahwa Anda berusia 18 tahun atau lebih."
      )
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }

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
      setError(
        body.error ??
          (locale === "en" ? "Failed to send request." : "Gagal mengirim pesan.")
      )
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section
        id="appointment"
        className="border-y border-white/10 bg-black text-white"
      >
        <div className="mx-auto max-w-2xl px-6 py-24 text-center md:px-10 md:py-32">
          <div className="mx-auto mb-6 inline-flex size-14 items-center justify-center rounded-full border border-white/30">
            <CheckCircle className="size-6 text-white" />
          </div>
          <h2 className="font-display text-4xl font-light uppercase tracking-[0.16em] text-white md:text-5xl">
            {locale === "en" ? "Request Sent" : "Permintaan Terkirim"}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/60 md:text-base">
            {locale === "en"
              ? `Thank you! ${studioName ?? "Studio"} will contact you shortly.`
              : `Terima kasih! ${studioName ?? "Studio"} akan segera menghubungi Anda.`}
          </p>
        </div>
      </section>
    )
  }

  const hasValidMap = Boolean(normalizedMapUrl)
  const useSplitLayout = showMapSection && hasValidMap

  return (
    <section
      id="appointment"
      className="border-y border-white/10 bg-black text-white"
    >
      <div
        className={`mx-auto px-6 py-24 md:px-10 md:py-32 ${
          useSplitLayout ? "max-w-7xl" : "max-w-3xl"
        }`}
      >
        <div className="text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
            — {locale === "en" ? "Get In Touch" : "Hubungi Kami"}
          </p>
          <h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.16em] text-white md:text-6xl">
            {headline}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
            {subheadline}
          </p>
        </div>

        <div
          className={`mt-14 ${
            useSplitLayout
              ? "grid items-start gap-10 lg:grid-cols-2 lg:gap-12"
              : ""
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Field
                label={locale === "en" ? "Name" : "Nama"}
                value={name}
                onChange={setName}
                required
                name="name"
                autoComplete="name"
                placeholder={locale === "en" ? "Your full name" : "Nama lengkap Anda"}
              />
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                name="email"
                autoComplete="email"
                placeholder="email@example.com"
              />
            </div>

            <FieldTextarea
              label={locale === "en" ? "Tell Us About Your Tattoo Idea" : "Ceritakan Ide Tato Anda"}
              value={message}
              onChange={setMessage}
              required
              placeholder={
                locale === "en"
                  ? "Size, placement, style, references, and preferred dates…"
                  : "Ukuran, lokasi, gaya, referensi, dan tanggal yang diinginkan…"
              }
            />

            {requireAge && (
              <label className="flex cursor-pointer select-none items-center gap-3 border-y border-white/10 py-5">
                <input
                  type="checkbox"
                  checked={ageOk}
                  onChange={(e) => setAgeOk(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  className={`relative inline-flex size-5 shrink-0 items-center justify-center border peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black ${
                    ageOk
                      ? "border-white bg-white text-black"
                      : "border-white/40"
                  }`}
                >
                  {ageOk && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span className="font-display text-xs uppercase tracking-[0.32em] text-white/80">
                  {ageLabel}
                </span>
              </label>
            )}

            {error && (
              <p
                ref={errorRef}
                tabIndex={-1}
                aria-live="assertive"
                className="text-xs uppercase tracking-[0.2em] text-destructive focus:outline-none"
              >
                {error}
              </p>
            )}

            <div className="flex justify-center pt-2 lg:justify-start">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center gap-3 border border-white/40 px-10 font-display text-[11px] uppercase tracking-[0.4em] text-white transition-colors hover:border-white hover:bg-white hover:text-black disabled:opacity-50"
              >
                {loading ? (locale === "en" ? "Sending…" : "Mengirim…") : ctaText}
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </form>

          {showMapSection ? (
            <MapEmbed
              embedUrl={normalizedMapUrl}
              rawInput={mapEmbedUrl}
              address={getLocalizedText(data, "mapAddress", locale)}
              height={mapHeight}
              locale={locale}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}

function MapEmbed({
  embedUrl,
  rawInput,
  address,
  height,
  locale = "id",
}: {
  embedUrl: string | null
  rawInput: string
  address?: string
  height: number
  locale?: string
}) {
  if (!embedUrl) {
    const message = rawInput
      ? (locale === "en" ? "Invalid embed URL" : "URL embed tidak valid")
      : (locale === "en" ? "Add Google Maps embed URL" : "Tambah URL embed Google Maps")

    return (
      <div
        className="flex min-h-[280px] w-full items-center justify-center border border-dashed border-white/20 bg-white/5 px-6 text-center"
        style={{ minHeight: Math.min(height, 280) }}
      >
        <p className="font-display text-xs uppercase tracking-[0.28em] text-white/40">
          {message}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        className="overflow-hidden border border-white/10"
        style={{ height }}
      >
        <iframe
          src={embedUrl}
          title="Lokasi studio"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
      {address ? (
        <p className="mt-3 text-xs leading-relaxed text-white/50">{address}</p>
      ) : null}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  name,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
  name?: string
  autoComplete?: string
}) {
  return (
    <label className="block">
      <span className="font-display text-[10px] uppercase tracking-[0.4em] text-white/50">
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 block w-full border-0 border-b border-white/20 bg-transparent py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white focus:outline-none"
      />
    </label>
  )
}

function FieldTextarea({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="font-display text-[10px] uppercase tracking-[0.4em] text-white/50">
        {label}
        {required && " *"}
      </span>
      <textarea
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-3 block w-full resize-none border-0 border-b border-white/20 bg-transparent py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white focus:outline-none"
      />
    </label>
  )
}
