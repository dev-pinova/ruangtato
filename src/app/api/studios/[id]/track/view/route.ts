import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { incrementStudioViewCount } from "@/lib/studio/studio-service"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: slug } = await params

  try {
    const cookieStore = await cookies()
    const cookieName = `sv_${slug}`

    if (cookieStore.get(cookieName)) {
      return NextResponse.json({ ok: true, duplicated: true })
    }

    const ok = await incrementStudioViewCount(slug)
    if (!ok) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }

    // Set a session cookie to prevent subsequent increments
    cookieStore.set(cookieName, "1", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to track view:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}
