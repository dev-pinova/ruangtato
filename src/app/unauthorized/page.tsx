import Link from "next/link"
import { ShieldX } from "lucide-react"

import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"
import { getLocale } from "@/lib/i18n/actions"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function UnauthorizedPage() {
  const locale = await getLocale()
  const t = await getDictionary(locale)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-border bg-muted/40">
          <ShieldX className="size-7 text-muted-foreground" />
        </div>
        <PageHeading
          size="sm"
          align="center"
          title={t.unauthorized.title}
          description={t.unauthorized.description}
          className="mb-6"
        />
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button render={<Link href="/login" />}>{t.unauthorized.btnStudio}</Button>
          <Button variant="outline" render={<Link href="/admin/login" />}>
            {t.unauthorized.btnAdmin}
          </Button>
        </div>
      </div>
    </div>
  )
}

