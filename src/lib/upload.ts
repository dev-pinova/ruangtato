/**
 * Upload validation utilities.
 *
 * Centralises file validation rules so that every upload endpoint enforces
 * consistent size, MIME-type, and filename constraints.
 */

/** Maximum allowed file size in bytes (5 MB). */
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024

/** MIME types accepted for image uploads. */
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
])

// NOTE: SVG (image/svg+xml) is intentionally NOT allowed. SVG files can embed
// <script> and event handlers, so serving user-uploaded SVGs inline is an XSS
// vector. Use raster formats only.

/** File extensions we consider safe for images. */
const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
])

export type UploadValidationError = {
  field: string
  message: string
}

/**
 * Validates an uploaded `File` object and returns a list of validation errors.
 * Returns an empty array when the file passes all checks.
 */
export function validateUploadedFile(file: File): UploadValidationError[] {
  const errors: UploadValidationError[] = []

  // --- Size ---
  if (file.size > MAX_UPLOAD_SIZE) {
    const maxMB = Math.round(MAX_UPLOAD_SIZE / (1024 * 1024))
    errors.push({
      field: "file",
      message: `Ukuran file melebihi batas maksimum ${maxMB} MB.`,
    })
  }

  if (file.size === 0) {
    errors.push({
      field: "file",
      message: "File kosong.",
    })
  }

  // --- MIME type ---
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    errors.push({
      field: "file",
      message: `Tipe file "${file.type || "unknown"}" tidak diizinkan. Gunakan JPG, PNG, WebP, GIF, atau AVIF.`,
    })
  }

  // --- Extension (double-check against the name) ---
  const ext = extractExtension(file.name)
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    errors.push({
      field: "file",
      message: `Ekstensi file "${ext || "(none)"}" tidak diizinkan.`,
    })
  }

  return errors
}

/**
 * Sanitises a filename for safe storage:
 * - strips directory components (path traversal)
 * - replaces unsafe characters with hyphens
 * - prepends a timestamp to avoid collisions
 */
export function sanitizeFilename(name: string): string {
  // Take only the basename (strip any directory separators)
  const basename = name.replace(/^.*[\\/]/, "")

  // Replace anything that is not alphanumeric, dash, underscore, or dot
  const safe = basename.replace(/[^a-zA-Z0-9._-]/g, "-")

  // Collapse multiple dashes / dots
  const collapsed = safe
    .replace(/-{2,}/g, "-")
    .replace(/\.{2,}/g, ".")
    .replace(/^[.-]+/, "")

  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)

  return collapsed ? `${timestamp}-${random}-${collapsed}` : `${timestamp}-${random}-upload`
}

function extractExtension(filename: string): string {
  const idx = filename.lastIndexOf(".")
  if (idx < 0) return ""
  return filename.slice(idx).toLowerCase()
}
