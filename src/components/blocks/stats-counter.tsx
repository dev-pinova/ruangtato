import type { StatsCounterData } from "@/lib/types"

const DEFAULT_STATS = [
  { value: "2,500", label: "Tattoos Done" },
  { value: "1,800", label: "Happy Clients" },
  { value: "15", label: "Years Experience" },
  { value: "50", label: "Custom Designs" },
]

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
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-black px-6 py-12 text-center md:py-16"
            >
              <p className="font-display text-5xl font-light tracking-[0.05em] text-white md:text-7xl lg:text-8xl">
                {stat.value}
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/60 md:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
