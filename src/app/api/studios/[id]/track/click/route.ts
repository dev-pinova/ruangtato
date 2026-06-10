import { NextResponse } from "next/server"

import { incrementStudioClickCount } from "@/lib/studio/studio-service"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: slug } = await params

  try {
    const ok = await incrementStudioClickCount(slug)
    if (!ok) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to track click:", error)
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
  }
}
