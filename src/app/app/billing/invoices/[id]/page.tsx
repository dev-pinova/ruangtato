import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { eq } from "drizzle-orm"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"

import { db } from "@/db"
import { invoices, studios } from "@/db/schema"
import { getServerSession } from "@/lib/auth/session"
import { getStudioForUser } from "@/lib/studio/studio-service"
import { getSubscriptionPlanLabel, getPlanByType } from "@/lib/billing/billing-plans"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SITE_URL, SITE_DOMAIN } from "@/lib/site"
import { PrintButton } from "./print-button"
import { getLocale } from "@/lib/i18n/actions"
import { getDictionary } from "@/lib/i18n/get-dictionary"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(date: Date | null, locale: string): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date)
}

function formatIDR(amount: number, locale: string): string {
  if (locale === "en") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function InvoiceStatusBadge({ status, t }: { status: string; t: any }) {
  if (status === "paid") {
    return (
      <Badge className="bg-success/15 text-success hover:bg-success/25 gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {t.invoice.status.paid}
      </Badge>
    )
  }
  if (status === "pending") {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        {t.invoice.status.pending}
      </Badge>
    )
  }
  return (
    <Badge variant="destructive" className="gap-1.5">
      <XCircle className="h-3.5 w-3.5" />
      {t.invoice.status.failed}
    </Badge>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (!process.env.DATABASE_URL || !db) {
    redirect("/app/billing")
  }

  const session = await getServerSession()
  if (!session) {
    redirect("/login")
  }

  const studio = await getStudioForUser(session.user.id)
  if (!studio) {
    redirect("/register")
  }

  const locale = await getLocale()
  const t = await getDictionary(locale)

  const { id } = await params

  // Fetch invoice — pastikan milik studio yang login
  const [invoice] = await db
    .select({
      invoice: invoices,
      studioName: studios.name,
    })
    .from(invoices)
    .innerJoin(studios, eq(invoices.studioId, studios.id))
    .where(eq(invoices.id, id))
    .limit(1)

  if (!invoice || invoice.invoice.studioId !== studio.id) {
    notFound()
  }

  const inv = invoice.invoice
  const planInfo = getSubscriptionPlanLabel(inv.planType)
  const plan = getPlanByType(inv.planType)
  const planDuration = plan
    ? t.pendingPayment.durationLabel.replace("{duration}", String(plan.months))
    : "—"

  // Nomor invoice human-readable: INV-YYYYMM-XXXX (6 char dari UUID)
  const invoiceNumber = `INV-${inv.createdAt.getFullYear()}${String(inv.createdAt.getMonth() + 1).padStart(2, "0")}-${inv.id.slice(0, 6).toUpperCase()}`

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6 lg:p-8">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          render={<Link href="/app/billing" />}
        >
          <ArrowLeft className="h-4 w-4" />
          {t.invoice.backBtn}
        </Button>

        {/* Tombol print — client component */}
        <PrintButton />
      </div>

      {/* Invoice Card */}
      <div
        id="invoice-print-area"
        className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm print:shadow-none print:border-0"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 px-8 pt-8 pb-6 border-b border-border">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {SITE_DOMAIN}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t.invoice.title}
            </h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {invoiceNumber}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <InvoiceStatusBadge status={inv.status} t={t} />
            <p className="mt-2 text-sm text-muted-foreground">
              {t.invoice.issuedLabel}: {formatDate(inv.createdAt, locale)}
            </p>
            {inv.paidAt && (
              <p className="text-sm text-muted-foreground">
                {t.invoice.paidLabel}: {formatDate(inv.paidAt, locale)}
              </p>
            )}
          </div>
        </div>

        {/* Billing info */}
        <div className="grid gap-6 sm:grid-cols-2 px-8 py-6 border-b border-border">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t.invoice.fromLabel}
            </p>
            <p className="font-semibold text-foreground">Ruang Tato</p>
            <p className="text-sm text-muted-foreground">{SITE_URL}</p>
            <p className="text-sm text-muted-foreground">billing@ruangtato.com</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t.invoice.toLabel}
            </p>
            <p className="font-semibold text-foreground">{invoice.studioName}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
        </div>

        {/* Line items */}
        <div className="px-8 py-6 border-b border-border">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="text-left pb-3">{t.invoice.table.desc}</th>
                <th className="text-right pb-3">{t.invoice.table.amount}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="py-4">
                  <p className="font-medium text-foreground">
                    {t.invoice.table.subscription.replace("{name}", planInfo.name)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t.invoice.table.duration.replace("{duration}", planDuration)}
                  </p>
                </td>
                <td className="py-4 text-right font-semibold text-foreground">
                  {formatIDR(inv.amount, locale)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border">
                <td className="pt-4 font-bold text-foreground">{t.invoice.table.total}</td>
                <td className="pt-4 text-right text-lg font-bold text-foreground">
                  {formatIDR(inv.amount, locale)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Meta */}
        <div className="px-8 py-6 space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.invoice.meta.orderId}</span>
            <span className="font-mono text-xs text-foreground bg-muted/50 px-2 py-0.5 rounded">
              {inv.midtransOrderId}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.invoice.meta.method}</span>
            <span className="text-foreground">Midtrans Payment Gateway</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.invoice.meta.currency}</span>
            <span className="text-foreground">{t.invoice.meta.currencyVal}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-8 py-5 bg-muted/20">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            {t.invoice.footer.replace("{email}", "billing@ruangtato.com")}
          </p>
        </div>
      </div>
    </div>
  )
}

