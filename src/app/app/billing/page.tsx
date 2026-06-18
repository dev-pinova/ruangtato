import { redirect } from "next/navigation"
import Link from "next/link"
import { eq, desc } from "drizzle-orm"
import { CreditCard, AlertCircle } from "lucide-react"

import { db } from "@/db"
import { payments, subscriptions, invoices } from "@/db/schema"
import { getServerSession } from "@/lib/auth/session"
import { getStudioForUser } from "@/lib/studio/studio-service"
import { getSubscriptionPlanLabel } from "@/lib/billing/billing-plans"
import { getLocale } from "@/lib/i18n/actions"
import { getDictionary } from "@/lib/i18n/get-dictionary"

import { PageHeading } from "@/components/design"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PendingPaymentBanner } from "@/components/billing/pending-payment-banner"

function formatDate(date: Date | null, locale: string) {
  if (!date) return "—"
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function formatCurrency(amount: number, locale: string) {
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

export default async function BillingPage() {
  if (!process.env.DATABASE_URL || !db) {
    redirect("/app/dashboard")
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

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.studioId, studio.id))
    .limit(1)

  const studioPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.studioId, studio.id))
    .orderBy(desc(payments.createdAt))

  // Map orderId → invoiceId untuk link ke halaman detail
  const studioInvoices = await db
    .select({ id: invoices.id, midtransOrderId: invoices.midtransOrderId })
    .from(invoices)
    .where(eq(invoices.studioId, studio.id))

  const invoiceByOrderId = new Map(
    studioInvoices.map((inv) => [inv.midtransOrderId, inv.id])
  )

  const isActive = subscription?.status === "active"
  const isTrial = subscription?.planType === "trial"
  const planInfo = subscription
    ? getSubscriptionPlanLabel(subscription.planType)
    : null

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-6 lg:p-8">
      <PageHeading
        title={t.billing.title}
        description={t.billing.description}
      />

      {/* Banner jika ada pembayaran pending */}
      <PendingPaymentBanner />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t.billing.currentPlan.title}
            </CardTitle>
            <CardDescription>{t.billing.currentPlan.desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.billing.currentPlan.nameLabel}
                  </span>
                  <span className="font-semibold">{planInfo?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.billing.currentPlan.statusLabel}
                  </span>
                  <Badge
                    variant={isActive ? "default" : "destructive"}
                    className={
                      isActive
                        ? "bg-success/15 text-success hover:bg-success/25"
                        : ""
                    }
                  >
                    {isActive ? t.billing.currentPlan.statusActive : t.billing.currentPlan.statusInactive}
                  </Badge>
                </div>
                {subscription.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t.billing.currentPlan.expiresLabel}
                    </span>
                    <span className="text-sm">
                      {formatDate(subscription.expiresAt, locale)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">{t.billing.currentPlan.noPlanTitle}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.billing.currentPlan.noPlanDesc}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              render={<Link href="/checkout" />}
            >
              {isTrial || !isActive ? t.billing.currentPlan.btnSubscribe : t.billing.currentPlan.btnManage}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.billing.history.title}</CardTitle>
          <CardDescription>
            {t.billing.history.desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studioPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg border-dashed">
              <p className="text-sm font-medium text-muted-foreground">
                {t.billing.history.noTransactions}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.billing.history.table.orderId}</TableHead>
                    <TableHead>{t.billing.history.table.date}</TableHead>
                    <TableHead>{t.billing.history.table.method}</TableHead>
                    <TableHead>{t.billing.history.table.amount}</TableHead>
                    <TableHead>{t.billing.history.table.status}</TableHead>
                    <TableHead className="text-right">{t.billing.history.table.invoice}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studioPayments.map((payment) => {
                    const isSuccess =
                      payment.transactionStatus === "success" ||
                      payment.transactionStatus === "settlement" ||
                      payment.transactionStatus === "capture"
                    const isPending = payment.transactionStatus === "pending"

                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium font-mono text-xs">
                          {payment.orderId}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(payment.createdAt, locale)}
                        </TableCell>
                        <TableCell className="text-sm uppercase text-muted-foreground">
                          {payment.paymentMethod || "—"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(payment.amount, locale)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              isSuccess
                                ? "default"
                                : isPending
                                ? "secondary"
                                : "destructive"
                            }
                            className={
                              isSuccess
                                ? "bg-success/15 text-success hover:bg-success/25"
                                : ""
                            }
                          >
                            {isSuccess ? t.billing.history.statusSuccess : isPending ? t.billing.history.statusPending : t.billing.history.statusFailed}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {invoiceByOrderId.has(payment.orderId) ? (
                            <Link
                              href={`/app/billing/invoices/${invoiceByOrderId.get(payment.orderId)}`}
                              className="text-xs text-primary hover:underline underline-offset-4 font-medium"
                            >
                              {t.billing.history.viewInvoice}
                            </Link>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

