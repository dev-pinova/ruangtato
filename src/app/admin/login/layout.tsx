import type { Metadata } from "next"

import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Admin Login",
  description: "Login ke panel admin internal Ruang Tato.",
  path: "/admin/login",
  noIndex: true,
})

import "@/app/admin/admin-ops.css"

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="dark admin-ops min-h-dvh">{children}</div>
}
