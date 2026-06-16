import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { isLocalUploadConfigured, uploadLocally } from "@/lib/local-upload"
import { isR2Configured, uploadToR2 } from "@/lib/r2"
import { getStudioSuspendedFlagForUser } from "@/lib/studio/studio-service"
import { validateUploadedFile } from "@/lib/upload"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (await getStudioSuspendedFlagForUser(session.user.id)) {
    return NextResponse.json({ error: "Account suspended", suspended: true }, { status: 403 })
  }

  // Require at least one storage backend to be configured.
  // Priority: R2 (cloud CDN) → local filesystem (self-hosted fallback)
  if (!isR2Configured() && !isLocalUploadConfigured()) {
    return NextResponse.json(
      {
        error: "Upload storage not configured",
        message:
          "Set R2 env vars (S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT) " +
          "or set UPLOAD_DIR for local storage.",
      },
      { status: 503 },
    )
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 })
  }

  // Validate file size, MIME type, and extension
  const validationErrors = validateUploadedFile(file)
  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: validationErrors },
      { status: 400 },
    )
  }

  try {
    // R2 takes priority; fall back to local disk when not configured.
    const result = isR2Configured()
      ? await uploadToR2(file)
      : await uploadLocally(file)

    if (!result?.url) {
      return NextResponse.json({ error: "Upload failed: no URL returned" }, { status: 500 })
    }

    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error("Upload failed:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

