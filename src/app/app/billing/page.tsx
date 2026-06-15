import { redirect } from "next/navigation"
import Link from "next/link"
import { eq, desc } from "drizzle-orm"
import { CreditCard, AlertCircle } from "lucide-react"

import { db } from "@/db"
import { payments, subscriptions } from "@/db/schema"
import { getServerSession } from "@/lib/auth/session"
import { getStudioForUser } from "@/lib/studio/studio-service"
import { getSubscriptionPlanLabel } from "@/lib/billing/billing-plans"

import { PageHeading, EmptyState } from "@/components/design"
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

const SUCCESS_BADGE = "bg-success/15 text-success hover:bg-success/25"

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function formatCurrency(amount: number) {
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

  const isActive = subscription?.status === "active"
  const isTrial = subscription?.planType === "trial"
  const planInfo = subscription
    ? getSubscriptionPlanLabel(subscription.planType)
    : null

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-6 lg:p-8">
      <PageHeading
        title="Billing & Langganan"
        description="Kelola paket langganan studio Anda dan lihat riwayat pembayaran."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Paket Saat Ini
            </CardTitle>
            <CardDescription>Status langganan studio Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Nama Paket
                  </span>
                  <span className="font-semibold">{planInfo?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Status
                  </span>
                  <Badge
                    variant={isActive ? "default" : "destructive"}
                    className={isActive ? SUCCESS_BADGE : ""}
                  >
                    {isActive ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>
                {subscription.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Berakhir Pada
                    </span>
                    <span className="text-sm">
                      {formatDate(subscription.expiresAt)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={AlertCircle}
                title="Belum ada paket langganan"
                description="Anda belum pernah berlangganan paket apapun. Pilih paket di bawah untuk mulai menggunakan semua fitur studio."
              />
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              render={<Link href="/checkout" />}
            >
              {isTrial || !isActive ? "Berlangganan Sekarang" : "Perpanjang / Kelola Paket"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>
            Riwayat pembayaran tagihan dari Midtrans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studioPayments.length === 0 ? (
            <EmptyState
              bordered
              icon={CreditCard}
              title="Belum ada transaksi"
              description="Riwayat pembayaran Anda akan muncul di sini setelah transaksi pertama berhasil diproses."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
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
                          {formatDate(payment.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm uppercase text-muted-foreground">
                          {payment.paymentMethod || "—"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(payment.amount)}
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
                            className={isSuccess ? SUCCESS_BADGE : ""}
                          >
                            {isSuccess ? "Berhasil" : isPending ? "Pending" : "Gagal"}
                          </Badge>
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
