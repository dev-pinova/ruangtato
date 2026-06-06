import type { Metadata } from "next"

import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Masuk",
  description: "Login ke dashboard studio Ruang Tato.",
  path: "/login",
  noIndex: true,
})

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
