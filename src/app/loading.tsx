import { MarketingShell } from "@/components/marketing/marketing-shell"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Route-level loading UI for the homepage. Fires during navigation and
 * streaming/revalidation while the server fetches published studios.
 * Mirrors the showcase layout so the page does not visually "jump".
 */
export default function Loading() {
  return (
    <MarketingShell>
      {/* Hero placeholder */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center md:px-6 md:py-28">
          <Skeleton className="mx-auto h-10 w-3/4 md:h-12" />
          <Skeleton className="mx-auto mt-4 h-5 w-2/3" />
          <Skeleton className="mx-auto mt-10 h-12 w-full max-w-2xl rounded-full" />
        </div>
      </section>

      {/* Filter bar placeholder */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-end md:justify-between md:px-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-[150px]" />
            <Skeleton className="h-8 w-[150px]" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Studio grid placeholder */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="space-y-3 p-6">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  )
}
