import Link from "next/link"
import { ShieldBan } from "lucide-react"

import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"

export default function AccountSuspendedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-border bg-muted/40">
          <ShieldBan className="size-7 text-muted-foreground" />
        </div>
        <PageHeading
          size="sm"
          align="center"
          title="Akun dinonaktifkan"
          description="Akses dashboard studio Anda ditangguhkan. Hubungi tim Ruang Tato untuk informasi lebih lanjut."
          className="mb-6"
        />
        <Button variant="outline" render={<Link href="/login" />}>
          Kembali ke login
        </Button>
      </div>
    </div>
  )
}
