import type { Metadata } from "next"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/design"
import { MarketingShell } from "@/components/marketing/marketing-shell"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Particles } from "@/components/ui/particles"
import { BorderBeam } from "@/components/ui/border-beam"
import { SUBSCRIPTION_PLANS } from "@/lib/billing/billing-plans"
import { staticPageMetadata } from "@/lib/seo"
import { SUPPORT_EMAIL } from "@/lib/site"
import { cn } from "@/lib/utils"
import { getLocale } from "@/lib/i18n/actions"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export const metadata: Metadata = staticPageMetadata("/pricing")

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

export default async function PricingPage() {
  const locale = await getLocale()
  const t = await getDictionary(locale)

  return (
    <MarketingShell>
      <section className="relative border-b border-border bg-background overflow-hidden">
        <Particles className="absolute inset-0 z-0" quantity={40} ease={80} color="var(--brand-scarlet)" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center md:px-6 md:py-28">
          <SectionHeading
            as="h1"
            size="lg"
            align="center"
            tagline={t.pricing.headerTagline}
            title={t.pricing.headerTitle}
            description={t.pricing.headerDesc}
          />
        </div>
      </section>

      <section className="relative border-b border-border bg-background overflow-hidden">
        <Particles className="absolute inset-0 z-0" quantity={40} ease={80} color="#ffffff" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-xl border bg-card p-6",
                  plan.popular ? "border-primary/40 overflow-hidden" : "border-border"
                )}
              >
                {plan.popular && (
                  <>
                    <BorderBeam size={220} duration={12} />
                    <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                      {t.pricing.popular}
                    </span>
                  </>
                )}

                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {plan.duration}
                </p>

                <div className="mt-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tracking-tight text-foreground">
                      {formatIDR(plan.price)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatIDR(plan.pricePerMonth)} / {t.pricing.perMonth}
                  </p>
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-foreground/85"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.popular ? (
                  <ShimmerButton className="mt-6 w-full font-medium" shimmerColor="var(--brand-scarlet)">
                    <Link href="/register" className="flex items-center justify-center gap-2 w-full">
                      {t.pricing.selectPlan} {plan.name}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </ShimmerButton>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    nativeButton={false}
                    className="mt-6 w-full"
                    render={<Link href="/register" />}
                  >
                    {t.pricing.selectPlan} {plan.name}
                    <ArrowRight className="size-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            {t.pricing.footerNote}
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-24">
          <SectionHeading
            align="center"
            title={t.pricing.faqTitle}
            description={
              <>
                {t.pricing.faqDescPrefix}
                <span className="font-medium text-foreground">
                  {SUPPORT_EMAIL}
                </span>
                .
              </>
            }
          />

          <Accordion className="mt-12">
            {t.pricing.faq.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-border last:border-b-0"
              >
                <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </MarketingShell>
  )
}
