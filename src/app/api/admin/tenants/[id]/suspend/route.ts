import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

import { suspendStudio } from "@/lib/admin/admin-suspend-service"
import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { checkRateLimit } from "@/lib/admin/admin-rate-limit"
import { isSuspensionReasonCategory } from "@/lib/admin/suspension-types"
import { parseJsonBody, z } from "@/lib/validation"

const SuspendSchema = z.object({
  reasonCategory: z
    .string()
    .refine(isSuspensionReasonCategory, "Kategori alasan wajib dipilih."),
  reason: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v.length >= 10, "Alasan suspend wajib diisi (min. 10 karakter)."),
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

  const rate = checkRateLimit(`suspend:${authResult.id}`, 10, 60_000)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak permintaan. Coba lagi dalam ${rate.retryAfterSec} detik.` },
      { status: 429 },
    )
  }

  const { id } = await params
  const parsed = await parseJsonBody(request, SuspendSchema)
  if (!parsed.ok) return parsed.response
  const { reason, reasonCategory } = parsed.data

  try {
    const result = await suspendStudio({
      studioId: id,
      actorUserId: authResult.id,
      reason,
      reasonCategory,
    })
    // Suspended studio must drop off the cached homepage immediately.
    revalidatePath("/")
    return NextResponse.json({ data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Suspend failed" },
      { status: 400 },
    )
  }
}
