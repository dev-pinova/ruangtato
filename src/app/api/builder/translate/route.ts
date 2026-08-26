import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text, from = "id", to = "en" } = await req.json()

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ translatedText: "" })
    }

    const trimmed = text.trim()

    // Try MyMemory free translation API first
    try {
      const langPair = `${from}|${to}`
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${encodeURIComponent(langPair)}`
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) })
      if (res.ok) {
        const json = await res.json()
        const translated = json?.responseData?.translatedText
        if (translated && typeof translated === "string" && translated.trim() !== "") {
          return NextResponse.json({ translatedText: translated.trim() })
        }
      }
    } catch {
      // Fallback if network or timeout fails
    }

    // Fallback: return original text if translation service fails
    return NextResponse.json({ translatedText: trimmed })
  } catch (error) {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
