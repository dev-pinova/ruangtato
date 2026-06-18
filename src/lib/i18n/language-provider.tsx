"use client"

import { createContext, useContext, ReactNode } from "react"
import type { Locale } from "./actions"
import type { Dictionary } from "./get-dictionary"

type LanguageContextType = {
  locale: Locale
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({
  children,
  locale,
  dictionary,
}: {
  children: ReactNode
  locale: Locale
  dictionary: Dictionary
}) {
  return (
    <LanguageContext.Provider value={{ locale, t: dictionary }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
