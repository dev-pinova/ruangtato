import { SectionHeading } from "@/components/design"
import { MarketingShell } from "@/components/marketing/marketing-shell"

export function LegalShell({
  eyebrow,
  title,
  description,
  updatedAt,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  updatedAt?: string
  children: React.ReactNode
}) {
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <div className="border-b border-border pb-8">
          <SectionHeading
            as="h1"
            size="lg"
            tagline={eyebrow}
            title={title}
            description={description}
          />
          {updatedAt ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Terakhir diperbarui: {updatedAt}
            </p>
          ) : null}
        </div>

        <div className="legal-prose mt-10 space-y-10">{children}</div>
      </article>
    </MarketingShell>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <SectionHeading title={title} />
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </div>
    </section>
  )
}
