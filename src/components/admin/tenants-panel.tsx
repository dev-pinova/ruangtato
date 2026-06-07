"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Building2, ExternalLink, RefreshCw } from "lucide-react"

import {
  AdminDataTable,
  AdminFeedbackBanner,
  AdminFilterBar,
  AdminFilterField,
  AdminPageHeader,
  AdminPagination,
  AdminSectionCard,
  AdminStatusBadge,
} from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
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

export function TenantsPanel({ canSuspend = false }: { canSuspend?: boolean }) {
  const [rows, setRows] = useState<AdminTenantRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [cities, setCities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<AdminTenantDetail | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [feedback, setFeedback] = useState<{
    message: string
    variant: "success" | "error"
  } | null>(null)

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

  const filterFields = (
    <>
      <AdminFilterField label="Status studio">
        <Select
          value={studioStatus || "all"}
          onValueChange={(v: string | null) => {
            setStudioStatus(v === "all" ? "" : (v ?? ""))
            setPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </AdminFilterField>

      <AdminFilterField label="Subscription">
        <Select
          value={subscriptionStatus || "all"}
          onValueChange={(v: string | null) => {
            setSubscriptionStatus(v === "all" ? "" : (v ?? ""))
            setPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </AdminFilterField>

      <AdminFilterField label="Paket">
        <Select
          value={planType || "all"}
          onValueChange={(v: string | null) => {
            setPlanType(v === "all" ? "" : (v ?? ""))
            setPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="1month">1 Bulan</SelectItem>
            <SelectItem value="3months">3 Bulan</SelectItem>
            <SelectItem value="6months">6 Bulan</SelectItem>
            <SelectItem value="12months">12 Bulan</SelectItem>
          </SelectContent>
        </Select>
      </AdminFilterField>

      <AdminFilterField label="Kota">
        <Select
          value={city || "all"}
          onValueChange={(v: string | null) => {
            setCity(v === "all" ? "" : (v ?? ""))
            setPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua kota</SelectItem>
            {cities.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminFilterField>

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
            <SelectItem value="expiry_asc">Expiry terdekat</SelectItem>
            <SelectItem value="expiry_desc">Expiry terjauh</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </AdminFilterField>
    </>
  )

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Tenants"
        description="Monitoring seluruh studio terdaftar di platform."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 sm:min-h-0"
            disabled={loading}
            onClick={() => void loadTenants()}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        }
      />

      {feedback ? (
        <AdminFeedbackBanner
          message={feedback.message}
          variant={feedback.variant}
          onDismiss={() => setFeedback(null)}
        />
      ) : null}

      <AdminFilterBar
        searchValue={q}
        onSearchChange={setQ}
        searchPlaceholder="Studio, owner, email, WA..."
        onSubmit={() => {
          setPage(1)
          void loadTenants()
        }}
        filters={filterFields}
      />

      <AdminDataTable
        columns={[
          {
            key: "studio",
            header: "Studio",
            cell: (row) => (
              <div>
                <div className="font-medium">{row.name}</div>
                <div className="text-xs text-muted-foreground">
                  {row.slug}
                  {row.city ? ` · ${row.city}` : ""}
                </div>
              </div>
            ),
          },
          {
            key: "owner",
            header: "Owner",
            cell: (row) => (
              <div>
                <div>{row.ownerName ?? "—"}</div>
                <div className="text-xs text-muted-foreground">
                  {row.ownerEmail ?? "—"}
                </div>
              </div>
            ),
          },
          { key: "wa", header: "WA", cell: (row) => row.waNumber ?? "—" },
          {
            key: "plan",
            header: "Paket",
            cell: (row) => (
              <div>
                {row.planLabel ?? row.planType ?? "—"}
                {row.subscriptionStatus ? (
                  <div className="mt-1">
                    <AdminStatusBadge status={row.subscriptionStatus} />
                  </div>
                ) : null}
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            cell: (row) => <AdminStatusBadge status={row.status} />,
          },
          {
            key: "created",
            header: "Registrasi",
            cell: (row) => formatDate(row.createdAt),
          },
          {
            key: "expiry",
            header: "Expiry",
            cell: (row) => formatDate(row.expiresAt),
          },
        ]}
        rows={rows}
        rowKey={(row) => row.id}
        loading={loading}
        onRowClick={(row) => void openDetail(row.id)}
        emptyIcon={Building2}
        emptyTitle="Tidak ada tenant ditemukan"
        emptyDescription="Coba ubah filter atau kata kunci pencarian."
        mobileCard={(row) => (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.slug}</p>
              </div>
              <AdminStatusBadge status={row.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Owner</p>
                <p>{row.ownerName ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paket</p>
                <p>{row.planLabel ?? row.planType ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expiry</p>
                <p>{formatDate(row.expiresAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">WA</p>
                <p>{row.waNumber ?? "—"}</p>
              </div>
            </div>
          </div>
        )}
      />

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={total}
        totalLabel="tenant"
        loading={loading}
        onPageChange={setPage}
      />

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{detail?.name ?? "Detail Tenant"}</SheetTitle>
            <SheetDescription>
              {detail?.slug ?? (detailLoading ? "Memuat..." : "")}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
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
                    <DetailRow
                      label="Nominal"
                      value={formatIDR(detail.lastPayment.amount)}
                    />
                    <DetailRow label="Status" value={detail.lastPayment.status} />
                    <DetailRow
                      label="Tanggal"
                      value={formatDate(
                        detail.lastPayment.paidAt ?? detail.lastPayment.createdAt,
                      )}
                    />
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
              </div>
            ) : null}
          </div>

          {detail && !detailLoading ? (
            <div className="sticky bottom-0 -mx-6 border-t border-border bg-background px-6 py-4">
              {canSuspend ? (
                <TenantStatusActions
                  studioId={detail.id}
                  studioName={detail.name}
                  ownerEmail={detail.ownerEmail}
                  status={detail.status}
                  onUpdated={(message) => {
                    setFeedback({ message, variant: "success" })
                    void loadTenants()
                    void openDetail(detail.id)
                  }}
                  onError={(message) => {
                    setFeedback({ message, variant: "error" })
                  }}
                />
              ) : (
                <p className="text-xs text-muted-foreground">
                  Suspend/reactivate hanya tersedia untuk super_admin.
                </p>
              )}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
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
    <AdminSectionCard className="space-y-2 p-3">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </AdminSectionCard>
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
  onError,
}: {
  studioId: string
  studioName: string
  ownerEmail: string | null
  status: string
  onUpdated: (message: string) => void
  onError: (message: string) => void
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
        const msg = json?.error ?? "Gagal memperbarui status."
        setError(msg)
        onError(msg)
        return
      }
      setReason("")
      setConfirmOpen(false)
      onUpdated(
        action === "suspend"
          ? `Tenant ${studioName} berhasil di-suspend.`
          : `Tenant ${studioName} berhasil di-reactivate.`,
      )
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
    <div className="space-y-3">
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
          className="min-h-11 w-full sm:min-h-0"
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
            className="min-h-11 w-full sm:min-h-0"
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
