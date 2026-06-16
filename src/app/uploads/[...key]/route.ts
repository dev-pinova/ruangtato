import { readFile } from "node:fs/promises"
import path from "node:path"

import { NextResponse } from "next/server"

/**
 * Serves uploaded files from the local filesystem.
 *
 * Only active when UPLOAD_DIR is set. Files must be within UPLOAD_DIR
 * (path traversal is rejected with 400).
 *
 * URL pattern: GET /uploads/[...filename]
 * e.g.  GET /uploads/1718123456789-abc123-photo.jpg
 */

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
}

// 1 year — safe because every uploaded filename includes a timestamp+random suffix,
// so filenames are effectively immutable / content-addressed.
const CACHE_MAX_AGE = 60 * 60 * 24 * 365

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const uploadDir = process.env.UPLOAD_DIR

  // If UPLOAD_DIR is not set, this route is not active.
  if (!uploadDir) {
    return NextResponse.json({ error: "Local upload not configured" }, { status: 404 })
  }

  const { key } = await params

  // Reconstruct the relative path from catch-all segments.
  const relativePath = key.join("/")

  // Resolve the absolute path and ensure it is still within UPLOAD_DIR.
  // This prevents path traversal attacks (e.g. ../../etc/passwd).
  const resolvedUploadDir = path.resolve(uploadDir)
  const resolvedFilePath = path.resolve(resolvedUploadDir, relativePath)

  if (!resolvedFilePath.startsWith(resolvedUploadDir + path.sep) &&
      resolvedFilePath !== resolvedUploadDir) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 })
  }

  // Only allow extensions from the whitelist.
  const ext = path.extname(resolvedFilePath).toLowerCase()
  const contentType = MIME_MAP[ext]
  if (!contentType) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
  }

  try {
    const buffer = await readFile(resolvedFilePath)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
        // Prevent browsers from sniffing content type
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code === "ENOENT") {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    console.error("[uploads] Failed to read file:", resolvedFilePath, error)
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 })
  }
}
