import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { getServerSession } from "@/lib/auth/session"
import { getStudioForUser } from "@/lib/studio/studio-service"
import AppLayoutClient from "./app-layout-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  const isPublicPath = pathname.startsWith("/studio/") || pathname === "/app" || pathname === "/app/"

  // Halaman publik studio (`/studio/[slug]`) dan halaman explore (`/app`) bisa diakses guest tanpa login
  // — ini target dari kartu showcase di beranda. Auth hanya untuk area dashboard.
  if (isPublicPath) {
    return <AppLayoutClient>{children}</AppLayoutClient>
  }

  const session = await getServerSession()
  if (!session) {
    redirect("/login")
  }

  if (db) {
    const studio = await getStudioForUser(session.user.id)
    if (!studio) {
      redirect("/register")
    }
  }

  return <AppLayoutClient>{children}</AppLayoutClient>
}
