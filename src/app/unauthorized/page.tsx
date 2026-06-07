import Link from "next/link"
import { ShieldX } from "lucide-react"

import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-border bg-muted/40">
          <ShieldX className="size-7 text-muted-foreground" />
        </div>
        <PageHeading
          size="sm"
          align="center"
          title="Akses ditolak"
          description="Anda tidak memiliki izin untuk membuka halaman ini."
          className="mb-6"
        />
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button render={<Link href="/login" />}>Login Studio</Button>
          <Button variant="outline" render={<Link href="/admin/login" />}>
            Login Admin
          </Button>
        </div>
      </div>
    </div>
  )
}
