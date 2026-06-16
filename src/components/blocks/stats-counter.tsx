import type { StatsCounterData } from "@/lib/types"
import { NumberTicker } from "@/components/ui/number-ticker"

const DEFAULT_STATS = [
  { value: "2,500", label: "Tatos Done" },
  { value: "1,800", label: "Happy Clients" },
  { value: "15", label: "Years Experience" },
  { value: "50", label: "Custom Designs" },
]

/**
 * Splits a stat string like "2,500", "15+", "98%" into a numeric value plus
 * any leading/trailing non-numeric decoration. Falls back to rendering the
 * raw string when there is no parseable number.
 */
function parseStatValue(raw: string): {
  prefix: string
  value: number | null
  suffix: string
} {
  const match = raw.match(/^(\D*?)([\d.,]+)(\D*)$/)
  if (!match) return { prefix: "", value: null, suffix: raw }
  const [, prefix, numeric, suffix] = match
  const value = Number(numeric.replace(/,/g, ""))
  if (!Number.isFinite(value)) return { prefix: "", value: null, suffix: raw }
  return { prefix, value, suffix }
}

export function BlockStatsCounter({ data }: { data: StatsCounterData }) {
  const stats = data?.stats?.length ? data.stats : DEFAULT_STATS

  return (
    <section className="border-b border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
        {data?.headline && (
          <h2 className="mb-12 text-center font-display text-3xl font-light uppercase tracking-[0.2em] text-white md:text-5xl">
            {data.headline}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4">
          {stats.map((stat, i) => {
            const { prefix, value, suffix } = parseStatValue(stat.value ?? "")
            return (
              <div
                key={i}
                className="bg-black px-6 py-12 text-center md:py-16"
              >
                <p className="font-display text-5xl font-light tracking-[0.05em] text-white md:text-7xl lg:text-8xl">
                  {value === null ? (
                    stat.value
                  ) : (
                    <>
                      {prefix}
                      <NumberTicker
                        value={value}
                        grouping
                        delay={i * 0.1}
                        className="font-display font-light tracking-[0.05em] text-white"
                      />
                      {suffix}
                    </>
                  )}
                </p>
                <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/60 md:text-xs">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
