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

const securityHeaders = [
  // Block MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer leakage to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful APIs the app does not use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Enforce HTTPS for two years, including subdomains.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Prevent our pages from being framed by other origins (clickjacking).
  // This only restricts who can embed US; it does not affect the Midtrans
  // Snap iframe that our own page embeds, so the payment flow is unaffected.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
]

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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
