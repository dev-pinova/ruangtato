import type { Metadata } from "next"

import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Daftar Studio",
  description: "Buat akun studio dan mulai landing page tattoo Anda di Ruang Tato.",
  path: "/register",
  noIndex: true,
})

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
