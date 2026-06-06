/**
 * Cloudflare R2 upload stub (phase 1).
 * Configure S3_* env vars to enable real uploads.
 */

export function isR2Configured() {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_ENDPOINT,
  )
}

export async function uploadToR2(file: File): Promise<{ url: string } | null> {
  if (!isR2Configured()) {
    return null
  }

  // Phase 2: wire @aws-sdk/client-s3 PutObject against R2 endpoint
  throw new Error(`R2 upload not implemented yet for ${file.name}`)
}
