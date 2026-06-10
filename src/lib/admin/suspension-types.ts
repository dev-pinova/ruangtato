export const SUSPENSION_REASON_CATEGORIES = [
  { value: "policy_violation", label: "Pelanggaran kebijakan" },
  { value: "refund_dispute", label: "Refund / chargeback" },
  { value: "payment_fraud", label: "Fraud pembayaran" },
  { value: "abuse", label: "Penyalahgunaan platform" },
  { value: "manual_hold", label: "Penahanan operasional" },
  { value: "other", label: "Lainnya" },
] as const

export type SuspensionReasonCategory =
  (typeof SUSPENSION_REASON_CATEGORIES)[number]["value"]

const CATEGORY_SET = new Set<string>(
  SUSPENSION_REASON_CATEGORIES.map((item) => item.value),
)

export function isSuspensionReasonCategory(
  value: string | null | undefined,
): value is SuspensionReasonCategory {
  return typeof value === "string" && CATEGORY_SET.has(value)
}

export function getSuspensionReasonCategoryLabel(
  value: string | null | undefined,
): string {
  if (!value) return "—"
  const match = SUSPENSION_REASON_CATEGORIES.find((item) => item.value === value)
  return match?.label ?? value
}
