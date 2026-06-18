"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const LOCALE_COOKIE_NAME = "NEXT_LOCALE"

export type Locale = "id" | "en"

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: "lax",
    secure: false, // Allow HTTP on localhost/staging
  })
  revalidatePath("/", "layout")
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value
  if (locale === "en") return "en"
  return "id" // default
}
