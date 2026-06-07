import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin-auth"
import { setStudioTrusted } from "@/lib/admin-staff-service"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requirePlatformApiPermission(
    request,
    "settings:write",
    ["super_admin"],
  )
  if (!isPlatformApiUser(authResult)) return authResult

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const isTrusted = (body as { isTrusted?: unknown }).isTrusted
  if (typeof isTrusted !== "boolean") {
    return NextResponse.json(
      { error: "isTrusted harus boolean." },
      { status: 400 },
    )
  }

  try {
    const data = await setStudioTrusted({
      studioId: id,
      isTrusted,
      actorUserId: authResult.id,
    })
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 },
    )
  }
}
