import type { Locale } from "@/lib/i18n/actions"

/**
 * Returns localized string from block data object.
 * If locale is 'en' and `fieldName_en` exists and non-empty, returns `fieldName_en`.
 * Otherwise falls back to `fieldName`.
 */
export function getLocalizedText(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  fieldName: string,
  locale: Locale | string = "id",
  fallback: string = ""
): string {
  if (!data) return fallback

  if (locale === "en") {
    const enVal = data[`${fieldName}_en`]
    if (typeof enVal === "string" && enVal.trim() !== "") {
      return enVal
    }
  }

  const idVal = data[fieldName]
  if (typeof idVal === "string") {
    return idVal
  }

  return fallback
}
