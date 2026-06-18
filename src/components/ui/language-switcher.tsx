"use client"

import { useEffect, useState } from "react"
import { Check, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { setLocale, type Locale } from "@/lib/i18n/actions"

export function LanguageSwitcher({ defaultLocale = "id" }: { defaultLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Sync state with cookie on mount in case it changed in another tab
    const match = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/)
    if (match) {
      setLocaleState(match[2] as Locale)
    }
  }, [])

  const handleSwitch = async (newLocale: Locale) => {
    if (newLocale === locale) return
    setLocaleState(newLocale)
    // Set cookie client-side instantly to prevent reload race conditions
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    await setLocale(newLocale)
    window.location.reload() // Reload to apply new language across server components
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="h-9 w-9 px-0 rounded-full">
            <Globe className="size-4" />
            <span className="sr-only">Toggle language</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleSwitch("id")} className="justify-between">
          <span>Bahasa Indonesia</span>
          {locale === "id" && <Check className="size-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSwitch("en")} className="justify-between">
          <span>English</span>
          {locale === "en" && <Check className="size-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
