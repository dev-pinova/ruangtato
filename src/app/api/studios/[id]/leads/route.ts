import { NextResponse } from "next/server"

import { createStudioLead } from "@/lib/studio/studio-service"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: slug } = await params

  const body = await request.json().catch(() => null)
  if (!body || typeof body.name !== "string" || typeof body.message !== "string") {
    return NextResponse.json(
      { error: "name and message are required" },
      { status: 400 },
    )
  }

  const name = body.name.trim()
  const message = body.message.trim()
  const email = typeof body.email === "string" ? body.email.trim() : undefined

  if (!name || !message) {
    return NextResponse.json({ error: "name and message are required" }, { status: 400 })
  }

  try {
    const lead = await createStudioLead({ slug, name, email, message })
    if (!lead) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }
    return NextResponse.json({ lead }, { status: 201 })
  } catch (error) {
    console.error("Failed to create lead:", error)
    return NextResponse.json({ error: "Failed to submit lead" }, { status: 500 })
  }
}
