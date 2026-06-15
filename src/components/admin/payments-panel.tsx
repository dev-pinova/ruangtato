"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AlertCircle, CheckCircle2, Clock, CreditCard } from "lucide-react"

import {
  AdminDataTable,
  AdminFilterBar,
  AdminFilterField,
  AdminMetricStrip,
  AdminPageHeaderV2,
  AdminPageToolbar,
  AdminPagination,
  AdminPanel,
  AdminPanelInset,
  AdminStatusBadge,
} from "@/components/admin/ui"
import { ADMIN_PAGE_SIZE } from "@/lib/admin/admin-constants"
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
import type { AdminPaymentRow } from "@/lib/billing/payment-service"

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

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)), [total])

  const statusCounts = useMemo(() => {
    const pending = rows.filter((r) => r.transactionStatus === "pending").length
    const failed = rows.filter(
      (r) => r.transactionStatus === "failed" || r.transactionStatus === "expired",
    ).length
    const success = rows.filter((r) => r.transactionStatus === "success").length
    return { pending, failed, success, all: total }
  }, [rows, total])

  const loadPayments = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(ADMIN_PAGE_SIZE), sort })
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data fetch on mount; loader sets loading state before fetching
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

  function applyStatusFilter(next: string) {
    setStatus(next)
    setPage(1)
  }

  const filterFields = (
    <>
      <AdminFilterField label="Urutkan">
        <Select
          value={sort}
          onValueChange={(v: string | null) => {
            if (v) {
              setSort(v)
              setPage(1)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
            <SelectItem value="amount_desc">Nominal tertinggi</SelectItem>
            <SelectItem value="amount_asc">Nominal terendah</SelectItem>
          </SelectContent>
        </Select>
      </AdminFilterField>
    </>
  )

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeaderV2
        title="Payments"
        description="Monitoring transaksi Midtrans di seluruh platform."
      />

      <AdminMetricStrip
        items={[
          {
            id: "all",
            label: "Semua transaksi",
            count: statusCounts.all,
            icon: CreditCard,
            tone: "neutral",
            active: !status,
            onClick: () => applyStatusFilter(""),
          },
          {
            id: "pending",
            label: "Pending",
            count: statusCounts.pending,
            icon: Clock,
            tone: "warning",
            active: status === "pending",
            onClick: () => applyStatusFilter("pending"),
          },
          {
            id: "failed",
            label: "Failed / Expired",
            count: statusCounts.failed,
            icon: AlertCircle,
            tone: "error",
            active: status === "failed",
            onClick: () => applyStatusFilter("failed"),
          },
          {
            id: "success",
            label: "Success",
            count: statusCounts.success,
            icon: CheckCircle2,
            tone: "success",
            active: status === "success",
            onClick: () => applyStatusFilter("success"),
          },
        ]}
      />

      <AdminPanel>
        <AdminPageToolbar
          search={
            <AdminFilterBar
              searchValue={q}
              onSearchChange={setQ}
              searchPlaceholder="Order ID, studio..."
              onSubmit={() => {
                setPage(1)
                void loadPayments()
              }}
            />
          }
          filters={filterFields}
          onRefresh={() => void loadPayments()}
          refreshLoading={loading}
        />

        <AdminDataTable
          className="border-0 md:rounded-none md:border-0"
          columns={[
            {
              key: "order",
              header: "Order ID",
              cell: (row) => (
                <span className="font-mono text-xs">{row.orderId}</span>
              ),
            },
            {
              key: "studio",
              header: "Studio",
              cell: (row) => (
                <div className="min-w-0">
                  <div>{row.studioName}</div>
                  <div className="text-xs text-muted-foreground">{row.studioSlug}</div>
                </div>
              ),
            },
            {
              key: "plan",
              header: "Paket",
              cell: (row) => row.planLabel ?? row.planType ?? "—",
            },
            {
              key: "amount",
              header: "Nominal",
              numeric: true,
              cell: (row) => formatIDR(row.amount),
            },
            {
              key: "status",
              header: "Status",
              cell: (row) => (
                <AdminStatusBadge status={row.transactionStatus} />
              ),
            },
            {
              key: "date",
              header: "Tanggal",
              cell: (row) => formatDate(row.paidAt ?? row.createdAt),
            },
          ]}
          rows={rows}
          rowKey={(row) => row.id}
          loading={loading}
          onRowClick={(row) => void openDetail(row.id)}
          emptyIcon={CreditCard}
          emptyTitle="Belum ada transaksi"
          emptyDescription="Jalankan admin:backfill-payments untuk histori invoice."
          mobileCard={(row) => (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs">{row.orderId}</p>
                  <p className="font-medium">{row.studioName}</p>
                </div>
                <AdminStatusBadge status={row.transactionStatus} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {row.planLabel ?? row.planType ?? "—"}
                </span>
                <span className="font-medium tabular-nums">
                  {formatIDR(row.amount)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(row.paidAt ?? row.createdAt)}
              </p>
            </div>
          )}
        />
      </AdminPanel>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={total}
        totalLabel="transaksi"
        loading={loading}
        onPageChange={setPage}
      />

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent
          side="right"
          className="w-full overscroll-contain sm:max-w-lg"
        >
          <SheetHeader>
            <SheetTitle>Detail Transaksi</SheetTitle>
            <SheetDescription>{detail?.orderId ?? ""}</SheetDescription>
          </SheetHeader>
          {detailLoading ? (
            <p className="mt-6 text-sm text-muted-foreground">Memuat...</p>
          ) : detail ? (
            <AdminPanelInset className="mt-6 space-y-4 rounded-lg border border-border bg-muted/30 text-sm">
              <DetailRow label="Studio" value={detail.studioName} />
              <DetailRow
                label="Nominal"
                value={formatIDR(detail.amount)}
                numeric
              />
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
            </AdminPanelInset>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function DetailRow({
  label,
  value,
  numeric,
}: {
  label: string
  value: string
  numeric?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`min-w-0 text-right font-medium ${numeric ? "tabular-nums" : ""}`}
      >
        {value}
      </span>
    </div>
  )
}
