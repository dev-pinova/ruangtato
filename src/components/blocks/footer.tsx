"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"

import type { FooterData } from "@/lib/types"

export function BlockFooter({ data }: { data: FooterData }) {
  const title = data?.title || "Studio Name"
  const address = data?.address || "Jakarta, Indonesia"
  const instagram = data?.instagram
  const whatsapp = data?.whatsapp
  const email = data?.email

  const showNewsletter = data?.showNewsletter !== false && Boolean(
    data?.newsletterHeadline ?? "Subscribe to our newsletter"
  )
  const newsletterEyebrow = data?.newsletterEyebrow || "Newsletter"
  const newsletterHeadline =
    data?.newsletterHeadline || "Subscribe to our newsletter"
  const newsletterPlaceholder =
    data?.newsletterPlaceholder || "Enter your email"
  const newsletterCta = data?.newsletterCta || "Subscribe"

  const [emailValue, setEmailValue] = useState("")
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!emailValue.trim()) return
    setDone(true)
  }

  return (
    <footer className="bg-black text-white">
      {showNewsletter && (
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center md:px-10 md:py-24">
            <p className="font-display text-[11px] uppercase tracking-[0.4em] text-white/60">
              — {newsletterEyebrow}
            </p>
            <h2 className="mt-5 font-display text-3xl font-light uppercase tracking-[0.16em] md:text-5xl">
              {newsletterHeadline}
            </h2>

            {done ? (
              <div className="mx-auto mt-10 inline-flex items-center gap-3 border border-white/30 px-8 py-4 font-display text-[11px] uppercase tracking-[0.4em] text-white">
                <Check className="size-4" />
                Subscribed
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-10 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:gap-0"
              >
                <input
                  type="email"
                  required
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  placeholder={newsletterPlaceholder}
                  className="flex-1 border border-white/20 bg-transparent px-6 py-3 font-display text-xs uppercase tracking-[0.2em] text-white placeholder:text-white/30 focus:border-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 border border-white/40 bg-transparent px-8 py-3 font-display text-[11px] uppercase tracking-[0.4em] text-white transition-colors hover:border-white hover:bg-white hover:text-black sm:border-l-0"
                >
                  {newsletterCta}
                  <ArrowRight className="size-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-24">
          <div className="text-center">
            <p className="font-display text-2xl font-semibold uppercase tracking-[0.4em] text-white md:text-3xl">
              {title}
            </p>
            {address && (
              <p className="mt-4 text-[11px] uppercase tracking-[0.4em] text-white/50">
                {address}
              </p>
            )}

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.32em] text-white/70">
              {whatsapp && (
                <li>
                  <a
                    href={
                      whatsapp.startsWith("http")
                        ? whatsapp
                        : `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display transition-colors hover:text-white"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {instagram && (
                <li>
                  <a
                    href={
                      instagram.startsWith("http")
                        ? instagram
                        : `https://instagram.com/${instagram.replace(/^@/, "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display transition-colors hover:text-white"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="font-display transition-colors hover:text-white"
                  >
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-[10px] uppercase tracking-[0.32em] text-white/40 md:flex-row">
            <p>
              © {new Date().getFullYear()} {title}. All Rights Reserved.
            </p>
            <p>Powered By Ruang Tato</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
