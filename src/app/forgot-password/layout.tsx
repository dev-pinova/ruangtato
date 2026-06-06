import type { Metadata } from "next"

import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Lupa Password",
  description: "Reset password akun Ruang Tato Anda.",
  path: "/forgot-password",
  noIndex: true,
})

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
