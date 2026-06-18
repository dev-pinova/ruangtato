import "server-only"
import type { Locale } from "./actions"

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  id: () => import("./dictionaries/id.json").then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
