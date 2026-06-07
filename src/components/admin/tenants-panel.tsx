"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ExternalLink, Search } from "lucide-react"

import { PageHeading } from "@/components/design"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { AdminTenantDetail, AdminTenantRow } from "@/lib/admin-service"
import { getSubscriptionPlanLabel } from "@/lib/billing-plans"
import {
  SUSPENSION_REASON_CATEGORIES,
  type SuspensionReasonCategory,
} from "@/lib/suspension-types"

type TenantsResponse = {
  data: AdminTenantRow[]
  total: number
  page: number
  limit: number
  cities?: string[]
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    suspended: "border-red-500/30 bg-red-500/10 text-red-400",
    expired: "border-red-500/30 bg-red-500/10 text-red-400",
    pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  }

  return (
    <Badge variant="outline" className={styles[status] ?? ""}>
      {status}
    </Badge>
  )
}

export function TenantsPanel({ canSuspend = false }: { canSuspend?: boolean }) {
  const [rows, setRows] = useState<AdminTenantRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [cities, setCities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<AdminTenantDetail | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const [q, setQ] = useState("")
  const [studioStatus, setStudioStatus] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState("")
  const [planType, setPlanType] = useState("")
  const [city, setCity] = useState("")
  const [sort, setSort] = useState("newest")

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 20)), [total])

  const loadTenants = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
      sort,
      includeCities: page === 1 ? "1" : "0",
    })

    if (q.trim()) params.set("q", q.trim())
    if (studioStatus) params.set("studioStatus", studioStatus)
    if (subscriptionStatus) params.set("subscriptionStatus", subscriptionStatus)
    if (planType) params.set("planType", planType)
    if (city) params.set("city", city)

    try {
      const response = await fetch(`/api/admin/tenants?${params}`)
      if (!response.ok) return
      const json = (await response.json()) as TenantsResponse
      setRows(json.data ?? [])
      setTotal(json.total ?? 0)
      if (json.cities) setCities(json.cities)
    } finally {
      setLoading(false)
    }
  }, [page, q, studioStatus, subscriptionStatus, planType, city, sort])

  useEffect(() => {
    void loadTenants()
  }, [loadTenants])

  async function openDetail(studioId: string) {
    setDetailOpen(true)
    setDetailLoading(true)
    setDetail(null)

    try {
      const response = await fetch(`/api/admin/tenants/${studioId}`)
      if (!response.ok) return
      const json = await response.json()
      setDetail(json.data as AdminTenantDetail)
    } finally {
      setDetailLoading(false)
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    void loadTenants()
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeading
        title="Tenants"
        description="Monitoring seluruh studio terdaftar di platform."
      />

      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row md:flex-wrap md:items-end"
      >
        <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Cari</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Studio, owner, email, WA..."
              className="pl-8"
            />
          </div>
        </div>

        <FilterSelect
          label="Status studio"
          value={studioStatus || "all"}
          onChange={(v) => {
            setStudioStatus(v === "all" ? "" : v)
            setPage(1)
          }}
          options={[
            { value: "all", label: "Semua" },
            { value: "active", label: "Active" },
            { value: "suspended", label: "Suspended" },
          ]}
        />

        <FilterSelect
          label="Subscription"
          value={subscriptionStatus || "all"}
          onChange={(v) => {
            setSubscriptionStatus(v === "all" ? "" : v)
            setPage(1)
          }}
          options={[
            { value: "all", label: "Semua" },
            { value: "active", label: "Active" },
            { value: "expired", label: "Expired" },
            { value: "pending", label: "Pending" },
          ]}
        />

        <FilterSelect
          label="Paket"
          value={planType || "all"}
          onChange={(v) => {
            setPlanType(v === "all" ? "" : v)
            setPage(1)
          }}
          options={[
            { value: "all", label: "Semua" },
            { value: "trial", label: "Trial" },
            { value: "1month", label: "1 Bulan" },
            { value: "3months", label: "3 Bulan" },
            { value: "6months", label: "6 Bulan" },
            { value: "12months", label: "12 Bulan" },
          ]}
        />

        <FilterSelect
          label="Kota"
          value={city || "all"}
          onChange={(v) => {
            setCity(v === "all" ? "" : v)
            setPage(1)
          }}
          options={[
            { value: "all", label: "Semua kota" },
            ...cities.map((item) => ({ value: item, label: item })),
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
            { value: "expiry_asc", label: "Expiry terdekat" },
            { value: "expiry_desc", label: "Expiry terjauh" },
            { value: "status", label: "Status" },
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
              <TableHead>Studio</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>WA</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registrasi</TableHead>
              <TableHead>Expiry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Tidak ada tenant ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => void openDetail(row.id)}
                >
                  <TableCell>
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.slug}
                      {row.city ? ` · ${row.city}` : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{row.ownerName ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.ownerEmail ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell>{row.waNumber ?? "—"}</TableCell>
                  <TableCell>
                    {row.planLabel ?? row.planType ?? "—"}
                    {row.subscriptionStatus ? (
                      <div className="mt-1">{statusBadge(row.subscriptionStatus)}</div>
                    ) : null}
                  </TableCell>
                  <TableCell>{statusBadge(row.status)}</TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell>{formatDate(row.expiresAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} tenant · halaman {page} dari {totalPages}
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
            <SheetTitle>{detail?.name ?? "Detail Tenant"}</SheetTitle>
            <SheetDescription>
              {detail?.slug ?? (detailLoading ? "Memuat..." : "")}
            </SheetDescription>
          </SheetHeader>

          {detailLoading ? (
            <p className="mt-6 text-sm text-muted-foreground">Memuat detail...</p>
          ) : detail ? (
            <div className="mt-6 space-y-6 text-sm">
              <DetailSection title="Profil">
                <DetailRow label="Owner" value={detail.ownerName ?? "—"} />
                <DetailRow label="Email" value={detail.ownerEmail ?? "—"} />
                <DetailRow label="WhatsApp" value={detail.waNumber ?? "—"} />
                <DetailRow label="Kota" value={detail.city ?? "—"} />
                <DetailRow label="Status studio" value={detail.status} />
                <DetailRow
                  label="Publikasi"
                  value={detail.isPublished ? "Published" : "Draft"}
                />
              </DetailSection>

              <DetailSection title="Langganan">
                <DetailRow
                  label="Paket"
                  value={
                    detail.planType
                      ? getSubscriptionPlanLabel(detail.planType).name
                      : "—"
                  }
                />
                <DetailRow label="Status" value={detail.subscriptionStatus ?? "—"} />
                <DetailRow label="Registrasi" value={formatDate(detail.createdAt)} />
                <DetailRow label="Berakhir" value={formatDate(detail.expiresAt)} />
              </DetailSection>

              <DetailSection title="Metrik">
                <DetailRow label="Views" value={String(detail.viewCount)} />
                <DetailRow label="Clicks" value={String(detail.clickCount)} />
              </DetailSection>

              {detail.lastPayment ? (
                <DetailSection title="Pembayaran terakhir">
                  <DetailRow label="Order ID" value={detail.lastPayment.orderId} />
                  <DetailRow label="Nominal" value={formatIDR(detail.lastPayment.amount)} />
                  <DetailRow label="Status" value={detail.lastPayment.status} />
                  <DetailRow label="Tanggal" value={formatDate(detail.lastPayment.paidAt ?? detail.lastPayment.createdAt)} />
                </DetailSection>
              ) : null}

              {detail.isPublished ? (
                <Button
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                  render={
                    <a
                      href={`/app/studio/${detail.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <ExternalLink className="size-4" />
                  Lihat halaman publik
                </Button>
              ) : null}

              {canSuspend ? (
                <TenantStatusActions
                  studioId={detail.id}
                  studioName={detail.name}
                  ownerEmail={detail.ownerEmail}
                  status={detail.status}
                  onUpdated={() => {
                    void loadTenants()
                    void openDetail(detail.id)
                  }}
                />
              ) : (
                <p className="rounded-md border border-border p-3 text-xs text-muted-foreground">
                  Suspend/reactivate hanya tersedia untuk super_admin. Buka drawer
                  ini setelah login sebagai super_admin.
                </p>
              )}
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

function DetailSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1.5 rounded-md border border-border p-3">{children}</div>
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

function TenantStatusActions({
  studioId,
  studioName,
  ownerEmail,
  status,
  onUpdated,
}: {
  studioId: string
  studioName: string
  ownerEmail: string | null
  status: string
  onUpdated: () => void
}) {
  const [reasonCategory, setReasonCategory] =
    useState<SuspensionReasonCategory>("policy_violation")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function submit(action: "suspend" | "reactivate") {
    setError(null)
    if (reason.trim().length < 10) {
      setError("Alasan minimal 10 karakter.")
      return
    }
    setLoading(true)
    try {
      const endpoint =
        action === "suspend"
          ? `/api/admin/tenants/${studioId}/suspend`
          : `/api/admin/tenants/${studioId}/reactivate`
      const body =
        action === "suspend"
          ? { reason: reason.trim(), reasonCategory }
          : { reason: reason.trim() }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const json = await response.json().catch(() => null)
        setError(json?.error ?? "Gagal memperbarui status.")
        return
      }
      setReason("")
      setConfirmOpen(false)
      onUpdated()
    } finally {
      setLoading(false)
    }
  }

  function openSuspendConfirm() {
    setError(null)
    if (reason.trim().length < 10) {
      setError("Alasan minimal 10 karakter.")
      return
    }
    setConfirmOpen(true)
  }

  return (
    <div className="space-y-3 rounded-md border border-border p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Aksi admin
      </p>

      {status !== "suspended" ? (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Kategori alasan
          </label>
          <Select
            value={reasonCategory}
            onValueChange={(value: string | null) => {
              if (value) setReasonCategory(value as SuspensionReasonCategory)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUSPENSION_REASON_CATEGORIES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <Textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Catatan suspend/reactivate (min. 10 karakter)"
        rows={3}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {status === "suspended" ? (
        <Button
          size="sm"
          disabled={loading}
          onClick={() => void submit("reactivate")}
        >
          Reactivate tenant
        </Button>
      ) : (
        <>
          <Button
            size="sm"
            variant="destructive"
            disabled={loading}
            onClick={openSuspendConfirm}
          >
            Suspend tenant
          </Button>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Nonaktifkan tenant?</AlertDialogTitle>
                <AlertDialogDescription>
                  Studio <strong>{studioName}</strong>
                  {ownerEmail ? (
                    <>
                      {" "}
                      dan akun owner <strong>{ownerEmail}</strong>
                    </>
                  ) : null}{" "}
                  akan dinonaktifkan. Halaman publik dan login dashboard akan
                  diblokir. Subscription tetap tersimpan sebagai histori.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault()
                    void submit("suspend")
                  }}
                >
                  Ya, suspend
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
