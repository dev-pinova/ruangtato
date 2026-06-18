"use client"

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-provider"

export function PrintButton() {
  const { t } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 print:hidden"
      onClick={() => window.print()}
    >
      <Printer className="h-4 w-4" />
      {t.invoice.printBtn}
    </Button>
  )
}

