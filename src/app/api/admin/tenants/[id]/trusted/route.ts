import { NextResponse } from "next/server"

import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { setStudioTrusted } from "@/lib/admin/admin-staff-service"
import { parseJsonBody, z } from "@/lib/validation"

const TrustedSchema = z.object({
  isTrusted: z.boolean({ message: "isTrusted harus boolean." }),
})

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
  const parsed = await parseJsonBody(request, TrustedSchema)
  if (!parsed.ok) return parsed.response
  const { isTrusted } = parsed.data

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
