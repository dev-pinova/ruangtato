"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Store } from "lucide-react"

import { MarketingShell } from "@/components/marketing/marketing-shell"
import { ShowcaseHero } from "@/components/showcase/hero"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-provider"
import type { Studio } from "@/lib/types"

const BASE_POPULAR_TAGS = ["Fine Line", "Blackwork", "Japanese", "Realism", "Jakarta", "Bali"]

function buildPopularTags(studios: Studio[]) {
  const fromStudios = studios.flatMap((studio) => studio.tags)
  const merged = [...BASE_POPULAR_TAGS, ...fromStudios]
  return [...new Set(merged.map((tag) => tag.trim()).filter(Boolean))].slice(0, 15)
}

export function ShowcasePage({
  studios,
}: {
  studios: Studio[]
  cities: string[]
}) {
  const { t } = useLanguage()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const featuredStudios = useMemo(
    () =>
      [...studios]
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 12),
    [studios],
  )

  const popularTags = useMemo(() => buildPopularTags(studios), [studios])

  const handleTagClick = (tag: string) => {
    router.push(`/app?q=${encodeURIComponent(tag)}`)
  }

  const handleSubmitSearch = () => {
    router.push(`/app?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <MarketingShell>
      <ShowcaseHero
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onTagClick={handleTagClick}
        featuredStudios={featuredStudios}
        popularTags={popularTags}
        onSubmitSearch={handleSubmitSearch}
      />

      {/* Studio-owner conversion path */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-lg border border-border bg-background text-foreground">
                  <Store className="size-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {t.cta.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {t.cta.subtitle}
                </p>
              </div>
              <Button
                size="lg"
                nativeButton={false}
                className="shrink-0 gap-2"
                render={<Link href="/register" />}
              >
                {t.cta.button}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}

