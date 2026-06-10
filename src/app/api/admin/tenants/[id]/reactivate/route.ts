import { NextResponse } from "next/server"

import { reactivateStudio } from "@/lib/admin/admin-suspend-service"
import {
  isPlatformApiUser,
  requirePlatformApiPermission,
} from "@/lib/admin/admin-auth"
import { checkRateLimit } from "@/lib/admin/admin-rate-limit"

function parseReason(body: unknown): string | null {
  if (!body || typeof body !== "object") return null
  const reason = (body as { reason?: unknown }).reason
  if (typeof reason !== "string") return null
  const trimmed = reason.trim()
  if (trimmed.length < 10) return null
  return trimmed
}

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
  const body = await request.json().catch(() => null)
  const reason = parseReason(body)
  if (!reason) {
    return NextResponse.json(
      { error: "Alasan reactivate wajib diisi (min. 10 karakter)." },
      { status: 400 },
    )
  }

  try {
    const result = await reactivateStudio({
      studioId: id,
      actorUserId: authResult.id,
      reason,
    })
    return NextResponse.json({ data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reactivate failed" },
      { status: 400 },
    )
  }
}
