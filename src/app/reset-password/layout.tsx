import type { Metadata } from "next"

import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Reset Password",
  description: "Atur ulang password akun Ruang Tato Anda.",
  path: "/reset-password",
  noIndex: true,
})

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
