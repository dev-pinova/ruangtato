type RateLimitEntry = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitEntry>()

/**
 * Hapus semua entries yang sudah expired untuk mencegah memory leak
 * pada instance yang berjalan lama (uptime berminggu-minggu/bulan).
 */
function evictExpiredBuckets(now: number) {
  for (const [key, entry] of buckets) {
    if (now >= entry.resetAt) buckets.delete(key)
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now()

  // Cleanup periodik: jalankan eviction setiap kali Map melebihi 5.000 entries.
  // Threshold ini lebih dari cukup untuk traffic admin panel normal.
  if (buckets.size > 5_000) {
    evictExpiredBuckets(now)
  }

  const entry = buckets.get(key)

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSec: 0 }
  }

  if (entry.count >= limit) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfterSec }
  }

  entry.count += 1
  return { allowed: true, retryAfterSec: 0 }
}
