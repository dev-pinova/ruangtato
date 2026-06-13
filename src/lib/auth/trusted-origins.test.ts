import { describe, expect, it } from "vitest"

import {
  buildTrustedOrigins,
  getAuthBaseURL,
  isLocalDevOrigin,
  PRODUCTION_ORIGINS,
} from "./trusted-origins"

describe("buildTrustedOrigins", () => {
  it("always trusts the known production origins", () => {
    const origins = buildTrustedOrigins({ NODE_ENV: "production" })
    expect(origins).toEqual(expect.arrayContaining([...PRODUCTION_ORIGINS]))
    expect(origins).toContain("https://ruangtato.vercel.app")
    expect(origins).toContain("https://www.ruangtato.com")
  })

  it("no longer trusts the stale studiotato.vercel.app origin", () => {
    const origins = buildTrustedOrigins({ NODE_ENV: "production" })
    expect(origins).not.toContain("https://studiotato.vercel.app")
  })

  it("excludes local dev origins in production", () => {
    const origins = buildTrustedOrigins({ NODE_ENV: "production" })
    expect(origins).not.toContain("http://localhost:3000")
  })

  it("includes local dev origins outside production", () => {
    const origins = buildTrustedOrigins({ NODE_ENV: "development" })
    expect(origins).toContain("http://localhost:3000")
  })

  it("includes the configured auth base URL", () => {
    const origins = buildTrustedOrigins({
      NODE_ENV: "production",
      BETTER_AUTH_URL: "https://app.example.com",
    })
    expect(origins).toContain("https://app.example.com")
  })

  it("merges comma-separated BETTER_AUTH_TRUSTED_ORIGINS (e.g. preview deploys)", () => {
    const origins = buildTrustedOrigins({
      NODE_ENV: "production",
      BETTER_AUTH_TRUSTED_ORIGINS:
        "https://ruangtato-git-feature.vercel.app, https://staging.ruangtato.com",
    })
    expect(origins).toContain("https://ruangtato-git-feature.vercel.app")
    expect(origins).toContain("https://staging.ruangtato.com")
  })

  it("de-duplicates origins", () => {
    const origins = buildTrustedOrigins({
      NODE_ENV: "production",
      BETTER_AUTH_URL: "https://www.ruangtato.com",
      NEXT_PUBLIC_APP_URL: "https://www.ruangtato.com",
    })
    const occurrences = origins.filter((o) => o === "https://www.ruangtato.com")
    expect(occurrences).toHaveLength(1)
  })
})

describe("getAuthBaseURL", () => {
  it("prefers BETTER_AUTH_URL over NEXT_PUBLIC_APP_URL", () => {
    expect(
      getAuthBaseURL({
        BETTER_AUTH_URL: "https://a.com",
        NEXT_PUBLIC_APP_URL: "https://b.com",
      }),
    ).toBe("https://a.com")
  })

  it("falls back to NEXT_PUBLIC_APP_URL", () => {
    expect(getAuthBaseURL({ NEXT_PUBLIC_APP_URL: "https://b.com" })).toBe(
      "https://b.com",
    )
  })
})

describe("isLocalDevOrigin", () => {
  it("recognizes localhost / 127.0.0.1", () => {
    expect(isLocalDevOrigin("http://localhost:3000")).toBe(true)
    expect(isLocalDevOrigin("http://127.0.0.1:3005")).toBe(true)
  })

  it("rejects remote origins", () => {
    expect(isLocalDevOrigin("https://ruangtato.vercel.app")).toBe(false)
  })
})
