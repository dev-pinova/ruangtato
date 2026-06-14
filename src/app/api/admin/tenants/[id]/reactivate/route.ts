import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { reactivateStudio } from "@/lib/admin/admin-suspend-service"
import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { checkRateLimit } from "@/lib/admin/admin-rate-limit"
import { parseJsonBody, z } from "@/lib/validation"

const ReactivateSchema = z.object({
  reason: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v.length >= 10, "Alasan reactivate wajib diisi (min. 10 karakter)."),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requirePlatformApiPermission(
    request,
    "suspensions:write",
    ["super_admin"],
  )
  if (!isPlatformApiUser(authResult)) return authResult

  const rate = checkRateLimit(`reactivate:${authResult.id}`, 10, 60_000)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak permintaan. Coba lagi dalam ${rate.retryAfterSec} detik.` },
      { status: 429 },
    )
  }

  const { id } = await params
  const parsed = await parseJsonBody(request, ReactivateSchema)
  if (!parsed.ok) return parsed.response
  const { reason } = parsed.data

  try {
    const result = await reactivateStudio({
      studioId: id,
      actorUserId: authResult.id,
      reason,
    })
    // Reactivated studio should reappear on the cached homepage immediately.
    revalidatePath("/")
    return NextResponse.json({ data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reactivate failed" },
      { status: 400 },
    )
  }
}
