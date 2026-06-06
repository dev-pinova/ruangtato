import type { Plan } from "@/lib/types"

/** Katalog plan langganan — sumber tunggal untuk billing & pricing. */
export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: "plan-1",
    name: "Starter",
    duration: "1 Bulan",
    months: 1,
    price: 99_000,
    pricePerMonth: 99_000,
    features: [
      "1 Landing Page",
      "11 Blok Komponen",
      "Custom Slug URL",
      "Lead Capture Form",
      "Statistik Dasar",
    ],
  },
  {
    id: "plan-2",
    name: "Growth",
    duration: "3 Bulan",
    months: 3,
    price: 249_000,
    pricePerMonth: 83_000,
    features: [
      "Semua fitur Starter",
      "Priority Support",
      "Trusted Badge Request",
      "Analytics Dashboard",
      "Hemat 16%",
    ],
  },
  {
    id: "plan-3",
    name: "Pro",
    duration: "6 Bulan",
    months: 6,
    price: 449_000,
    pricePerMonth: 74_833,
    popular: true,
    features: [
      "Semua fitur Growth",
      "Custom Domain (soon)",
      "Team Management (3 user)",
      "Lead Export",
      "Hemat 24%",
    ],
  },
  {
    id: "plan-4",
    name: "Enterprise",
    duration: "12 Bulan",
    months: 12,
    price: 799_000,
    pricePerMonth: 66_583,
    features: [
      "Semua fitur Pro",
      "Team Unlimited",
      "API Access (soon)",
      "Dedicated Support",
      "Hemat 33%",
    ],
  },
]

export function monthsToPlanType(months: number): string {
  return `${months}month${months > 1 ? "s" : ""}`
}

export function planTypeToMonths(planType: string): number | null {
  const plan = SUBSCRIPTION_PLANS.find(
    (p) => monthsToPlanType(p.months) === planType
  )
  return plan?.months ?? null
}

export function getPlanByType(planType: string): Plan | undefined {
  const months = planTypeToMonths(planType)
  if (months === null) return undefined
  return SUBSCRIPTION_PLANS.find((p) => p.months === months)
}

export function getSubscriptionPlanLabel(planType: string): {
  name: string
  duration: string
} {
  if (planType === "trial") {
    return { name: "Trial", duration: "14 Hari" }
  }

  const plan = getPlanByType(planType)
  if (plan) {
    return { name: plan.name, duration: plan.duration }
  }

  return { name: planType, duration: "—" }
}
