import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  getStudioSuspendedFlagForUser,
  publishStudio,
  studioHasActiveSubscription,
  userCanAccessStudio,
} from "@/lib/studio-service"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (await getStudioSuspendedFlagForUser(session.user.id)) {
    return NextResponse.json({ error: "Account suspended", suspended: true }, { status: 403 })
  }

  const allowed = await userCanAccessStudio(session.user.id, id)
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const hasSubscription = await studioHasActiveSubscription(id)
  if (!hasSubscription) {
    return NextResponse.json({ error: "Subscription required" }, { status: 402 })
  }

  try {
    const studio = await publishStudio(id)
    if (!studio) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 })
    }
    return NextResponse.json({ studio })
  } catch (error) {
    console.error("Failed to publish studio:", error)
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 })
  }
}
