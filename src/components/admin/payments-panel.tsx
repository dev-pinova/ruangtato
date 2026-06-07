"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"

import { PageHeading } from "@/components/design"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminPaymentRow } from "@/lib/payment-service"

type PaymentDetail = AdminPaymentRow & {
  fraudStatus: string | null
  rawPayload: Record<string, unknown> | null
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    failed: "border-red-500/30 bg-red-500/10 text-red-400",
    expired: "border-red-500/30 bg-red-500/10 text-red-400",
  }
  return (
    <Badge variant="outline" className={styles[status] ?? ""}>
      {status}
    </Badge>
  )
}

export function PaymentsPanel() {
  const [rows, setRows] = useState<AdminPaymentRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("")
  const [sort, setSort] = useState("newest")
  const [detail, setDetail] = useState<PaymentDetail | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 20)), [total])

  const loadPayments = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "20", sort })
    if (q.trim()) params.set("q", q.trim())
    if (status) params.set("status", status)

    try {
      const response = await fetch(`/api/admin/payments?${params}`)
      if (!response.ok) return
      const json = await response.json()
      setRows(json.data ?? [])
      setTotal(json.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [page, q, status, sort])

  useEffect(() => {
    void loadPayments()
  }, [loadPayments])

  async function openDetail(paymentId: string) {
    setDetailOpen(true)
    setDetailLoading(true)
    setDetail(null)
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`)
      if (!response.ok) return
      const json = await response.json()
      setDetail(json.data as PaymentDetail)
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeading
        title="Payments"
        description="Monitoring transaksi Midtrans di seluruh platform."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setPage(1)
          void loadPayments()
        }}
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row md:flex-wrap md:items-end"
      >
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Order ID, studio..."
            className="pl-8"
          />
        </div>
        <FilterSelect
          label="Status"
          value={status || "all"}
          onChange={(v) => {
            setStatus(v === "all" ? "" : v)
            setPage(1)
          }}
          options={[
            { value: "all", label: "Semua" },
            { value: "pending", label: "Pending" },
            { value: "success", label: "Success" },
            { value: "failed", label: "Failed" },
            { value: "expired", label: "Expired" },
          ]}
        />
        <FilterSelect
          label="Urutkan"
          value={sort}
          onChange={(v) => {
            setSort(v)
            setPage(1)
          }}
          options={[
            { value: "newest", label: "Terbaru" },
            { value: "oldest", label: "Terlama" },
            { value: "amount_desc", label: "Nominal tertinggi" },
            { value: "amount_asc", label: "Nominal terendah" },
          ]}
        />
        <Button type="submit" variant="secondary">
          Terapkan
        </Button>
      </form>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Studio</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Belum ada transaksi. Jalankan `npm run admin:backfill-payments` untuk histori invoice.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => void openDetail(row.id)}
                >
                  <TableCell className="font-mono text-xs">{row.orderId}</TableCell>
                  <TableCell>
                    <div>{row.studioName}</div>
                    <div className="text-xs text-muted-foreground">{row.studioSlug}</div>
                  </TableCell>
                  <TableCell>{row.planLabel ?? row.planType ?? "—"}</TableCell>
                  <TableCell>{formatIDR(row.amount)}</TableCell>
                  <TableCell>{statusBadge(row.transactionStatus)}</TableCell>
                  <TableCell>{formatDate(row.paidAt ?? row.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} transaksi · halaman {page} dari {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Berikutnya
          </Button>
        </div>
      </div>

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Detail Transaksi</SheetTitle>
            <SheetDescription>{detail?.orderId ?? ""}</SheetDescription>
          </SheetHeader>
          {detailLoading ? (
            <p className="mt-6 text-sm text-muted-foreground">Memuat...</p>
          ) : detail ? (
            <div className="mt-6 space-y-4 text-sm">
              <DetailRow label="Studio" value={detail.studioName} />
              <DetailRow label="Nominal" value={formatIDR(detail.amount)} />
              <DetailRow label="Status" value={detail.transactionStatus} />
              <DetailRow label="Metode" value={detail.paymentMethod ?? "—"} />
              <DetailRow label="Transaction ID" value={detail.transactionId ?? "—"} />
              <DetailRow label="Fraud status" value={detail.fraudStatus ?? "—"} />
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Raw payload
                </p>
                <pre className="max-h-80 overflow-auto rounded-md border border-border bg-muted/30 p-3 text-xs">
                  {JSON.stringify(detail.rawPayload, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex min-w-[140px] flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={(v: string | null) => onChange(v ?? "all")}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}
