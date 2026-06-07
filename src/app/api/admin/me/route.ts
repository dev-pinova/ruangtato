import { NextResponse } from "next/server"

import { getPlatformUserFromSession } from "@/lib/admin-auth"

export async function GET() {
  const platformUser = await getPlatformUserFromSession()
  if (!platformUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ data: platformUser })
}
