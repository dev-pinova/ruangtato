import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { isR2Configured, uploadToR2 } from "@/lib/r2"
import { getStudioSuspendedFlagForUser } from "@/lib/studio-service"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (await getStudioSuspendedFlagForUser(session.user.id)) {
    return NextResponse.json({ error: "Account suspended", suspended: true }, { status: 403 })
  }

  if (!isR2Configured()) {
    return NextResponse.json(
      {
        error: "R2 not configured",
        message: "Set S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT in env",
      },
      { status: 503 },
    )
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 })
  }

  try {
    const result = await uploadToR2(file)
    return NextResponse.json({ url: result?.url })
  } catch (error) {
    console.error("Upload failed:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
