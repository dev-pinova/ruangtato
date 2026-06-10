/**
 * Cloudflare R2 / S3-compatible storage upload.
 *
 * Requires the following environment variables:
 *   S3_BUCKET          — bucket name
 *   S3_ACCESS_KEY_ID   — access key
 *   S3_SECRET_ACCESS_KEY — secret key
 *   S3_ENDPOINT        — e.g. https://<account>.r2.cloudflarestorage.com
 *   S3_PUBLIC_URL      — (optional) public URL prefix for the bucket
 */

import { sanitizeFilename } from "@/lib/upload"

export function isR2Configured() {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_ENDPOINT,
  )
}

function getR2Config() {
  const bucket = process.env.S3_BUCKET
  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
  const endpoint = process.env.S3_ENDPOINT
  const publicUrl = process.env.S3_PUBLIC_URL

  if (!bucket || !accessKeyId || !secretAccessKey || !endpoint) {
    throw new Error(
      "R2 is not configured. Set S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT in env.",
    )
  }

  return { bucket, accessKeyId, secretAccessKey, endpoint, publicUrl }
}

export async function uploadToR2(file: File): Promise<{ url: string } | null> {
  if (!isR2Configured()) {
    return null
  }

  const config = getR2Config()

  // Dynamic import to avoid bundling @aws-sdk in the client
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3")

  const client = new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })

  const key = `uploads/${sanitizeFilename(file.name)}`
  const buffer = Buffer.from(await file.arrayBuffer())

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  )

  // Build the public URL — prefer explicit S3_PUBLIC_URL, fallback to endpoint
  const baseUrl = config.publicUrl
    ? config.publicUrl.replace(/\/+$/, "")
    : `${config.endpoint}/${config.bucket}`

  return { url: `${baseUrl}/${key}` }
}
