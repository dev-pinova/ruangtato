/**
 * Trusted origin resolution for Better Auth, kept as a pure, env-injectable
 * module so it can be unit-tested without booting the full auth instance.
 *
 * Better Auth rejects state-changing requests whose `Origin` header is not in
 * this list (error code `INVALID_ORIGIN`). The client posts from whatever host
 * is serving the app, so every production host the app is reachable from must
 * be listed here (or supplied via the `BETTER_AUTH_TRUSTED_ORIGINS` env var).
 */

/** Known, stable production origins the platform is served from. */
export const PRODUCTION_ORIGINS = [
  "https://www.ruangtato.com",
  "https://ruangtato.com",
  "https://ruangtato.vercel.app",
] as const

export const LOCAL_DEV_HOSTS = ["localhost", "127.0.0.1"] as const
const LOCAL_DEV_PORT_MIN = 3000
const LOCAL_DEV_PORT_MAX = 3010

type EnvLike = Record<string, string | undefined>

export function getAuthBaseURL(env: EnvLike = process.env): string | undefined {
  return env.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_APP_URL
}

export function buildLocalDevOrigins(): string[] {
  const origins: string[] = []
  for (const host of LOCAL_DEV_HOSTS) {
    origins.push(`http://${host}:*`)
    for (let port = LOCAL_DEV_PORT_MIN; port <= LOCAL_DEV_PORT_MAX; port++) {
      origins.push(`http://${host}:${port}`)
    }
  }
  return origins
}

/**
 * Comma-separated extra origins (e.g. for Vercel preview deployments) provided
 * at runtime. Better Auth also reads this var natively; we include it here so
 * the resolved list is explicit and testable.
 */
function getEnvTrustedOrigins(env: EnvLike): string[] {
  return (env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

export function buildTrustedOrigins(env: EnvLike = process.env): string[] {
  const isProduction = env.NODE_ENV === "production"

  const origins = [
    getAuthBaseURL(env),
    env.NEXT_PUBLIC_APP_URL,
    ...PRODUCTION_ORIGINS,
    ...getEnvTrustedOrigins(env),
    ...(isProduction ? [] : buildLocalDevOrigins()),
  ]

  return [...new Set(origins.filter((value): value is string => Boolean(value)))]
}

export function isLocalDevOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin)
    return LOCAL_DEV_HOSTS.includes(hostname as (typeof LOCAL_DEV_HOSTS)[number])
  } catch {
    return false
  }
}
