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
      "1 Landing Page Studio Resmi",
      "15+ Blok Komponen Premium (Hero, Galeri, FAQ)",
      "Integrasi WhatsApp Direct Booking",
      "Formulir Konsultasi Prospek (Lead Capture)",
      "Analisis Kunjungan Dasar",
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
      "Semua Fitur Starter",
      "Lencana Verifikasi 'Trusted Studio'",
      "Analisis Kunjungan & Klik Konversi",
      "Dukungan Prioritas WhatsApp",
      "Hemat 16% dibanding Bulanan",
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
      "Semua Fitur Growth",
      "Ekspor Data Prospek Pelanggan (CSV/Excel)",
      "Manajemen Anggota Tim (Hingga 3 Artist)",
      "Kustomisasi Domain Pribadi (Segera)",
      "Penyaringan Ulasan & FAQ Khusus",
      "Hemat 24% dibanding Bulanan",
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
      "Semua Fitur Pro",
      "Manajemen Artist Tanpa Batas",
      "Laporan Kinerja Bulanan Otomatis",
      "Manajer Akun Khusus (Dedicated Support)",
      "Akses API Pengembang (Segera)",
      "Hemat 33% dibanding Bulanan",
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
