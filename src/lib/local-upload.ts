import { writeFile, mkdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"

import { sanitizeFilename } from "@/lib/upload"

export function isLocalUploadConfigured() {
  return Boolean(process.env.UPLOAD_DIR)
}

function getLocalUploadConfig() {
  const dir = process.env.UPLOAD_DIR
  const prefix = process.env.UPLOAD_URL_PREFIX || "/uploads"
  if (!dir) {
    throw new Error("Local upload not configured. Set UPLOAD_DIR in env.")
  }
  return { dir, prefix }
}

export async function uploadLocally(file: File): Promise<{ url: string } | null> {
  if (!isLocalUploadConfigured()) {
    return null
  }

  const config = getLocalUploadConfig()

  const key = sanitizeFilename(file.name)
  const fullPath = path.join(config.dir, key)

  const dir = path.dirname(fullPath)
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(fullPath, buffer)

  const baseUrl = config.prefix.replace(/\/+$/, "")
  return { url: `${baseUrl}/${key}` }
}
