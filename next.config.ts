import type { NextConfig } from "next"

const remotePatterns = [
  { protocol: "https" as const, hostname: "images.unsplash.com" },
  { protocol: "https" as const, hostname: "*.r2.cloudflarestorage.com" },
]

if (process.env.S3_PUBLIC_URL) {
  try {
    const url = new URL(process.env.S3_PUBLIC_URL)
    remotePatterns.push({
      protocol: "https" as const,
      hostname: url.hostname,
    })
  } catch (e) {
    console.warn("Invalid S3_PUBLIC_URL for remotePatterns:", e)
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [
    "pg",
    "better-auth",
    "kysely",
    "@better-auth/kysely-adapter",
    "@better-auth/core",
    "midtrans-client",
  ],
  images: {
    remotePatterns,
  },
}

export default nextConfig
