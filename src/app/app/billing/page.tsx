"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { H2 } from "@/components/ui/typography"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  MOCK_SUBSCRIPTION,
  MOCK_PLANS,
  MOCK_INVOICES,
} from "@/lib/mock-data"

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const SUBSCRIPTION_STATUS: Record<
  string,
  { label: string; className: string }
> = {
  active: {
    label: "Aktif",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  expired: {
    label: "Kedaluwarsa",
    className: "border-red-500/30 bg-red-500/10 text-red-400",
  },
  pending: {
    label: "Menunggu",
    className:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  },
}

const INVOICE_STATUS: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  paid: { label: "Lunas", variant: "outline" },
  pending: { label: "Menunggu", variant: "secondary" },
  failed: { label: "Gagal", variant: "destructive" },
}

export default function BillingPage() {
  const activePlanMonths = parseInt(MOCK_SUBSCRIPTION.planType)
  const activePlan = MOCK_PLANS.find((p) => p.months === activePlanMonths)
  const subStatus = SUBSCRIPTION_STATUS[MOCK_SUBSCRIPTION.status]

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl">
      <H2>Billing</H2>

      {/* Current plan */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Saat Ini</CardTitle>
          <CardDescription>
            Kelola langganan dan riwayat pembayaran Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {activePlan?.name ?? "—"} ({activePlan?.duration})
                </span>
                <Badge variant="outline" className={subStatus?.className}>
                  {subStatus?.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Berlaku hingga{" "}
                <span className="text-foreground font-medium">
                  {formatDate(MOCK_SUBSCRIPTION.expiresAt)}
                </span>
              </p>
            </div>
            <Button variant="outline">Kelola Langganan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Pilih Plan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_PLANS.map((plan) => {
            const isActive = plan.months === activePlanMonths
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative",
                  plan.popular && "ring-2 ring-primary",
                  isActive && "ring-2 ring-emerald-500/50"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Paling Populer
                    </Badge>
                  </div>
                )}
                <CardHeader className="pt-6">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.duration}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-2xl font-bold tracking-tight">
                      {formatIDR(plan.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      / {plan.duration.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatIDR(plan.pricePerMonth)} / bulan
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="size-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isActive ? (
                    <Badge
                      variant="outline"
                      className="w-full justify-center border-emerald-500/30 bg-emerald-500/10 text-emerald-400 py-1.5"
                    >
                      Plan Aktif
                    </Badge>
                  ) : (
                    <Button
                      variant={plan.popular ? "default" : "outline"}
                      className="w-full"
                    >
                      Pilih Plan
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Invoice</CardTitle>
          <CardDescription>
            Daftar pembayaran yang telah dilakukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVOICES.map((invoice) => {
                const status = INVOICE_STATUS[invoice.status]
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-xs">
                      {invoice.id.toUpperCase()}
                    </TableCell>
                    <TableCell>{invoice.planType}</TableCell>
                    <TableCell className="font-medium">
                      {formatIDR(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={status.variant}
                        className={
                          invoice.status === "paid"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : undefined
                        }
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.createdAt)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
