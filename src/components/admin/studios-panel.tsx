"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Building2, ExternalLink } from "lucide-react"
import { toast } from "sonner"

import {
  AdminDataTable,
  AdminFilterBar,
  AdminFilterField,
  AdminPageHeaderV2,
  AdminPageToolbar,
  AdminPagination,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/admin/ui"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import type { AdminStudioRow } from "@/lib/admin/admin-service"
import { ADMIN_PAGE_SIZE } from "@/lib/admin/admin-constants"
import {
  SUSPENSION_REASON_CATEGORIES,
  type SuspensionReasonCategory,
} from "@/lib/admin/suspension-types"

type StudiosResponse = {
  data: AdminStudioRow[]
  total: number
  page: number
  limit: number
}

function formatNumber(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  }
  return String(num)
}

export function StudiosPanel({
  canSuspend = false,
  isSuperAdmin = false,
}: {
  canSuspend?: boolean
  isSuperAdmin?: boolean
}) {
  const [rows, setRows] = useState<AdminStudioRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  // Filters State
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState("newest")

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"suspend" | "reactivate" | null>(null)
  const [selectedStudio, setSelectedStudio] = useState<AdminStudioRow | null>(null)
  const [reasonCategory, setReasonCategory] = useState<SuspensionReasonCategory>("policy_violation")
  const [reason, setReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)), [total])

  const loadStudios = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: String(ADMIN_PAGE_SIZE),
      sort,
    })

    if (q.trim()) params.set("q", q.trim())
    if (status && status !== "all") params.set("status", status)

    try {
      const response = await fetch(`/api/admin/studios?${params}`)
      if (!response.ok) {
        toast.error("Gagal mengambil data studio.")
        return
      }
      const json = (await response.json()) as StudiosResponse
      setRows(json.data ?? [])
      setTotal(json.total ?? 0)
    } catch (err) {
      console.error(err)
      toast.error("Terjadi kesalahan sistem saat mengambil data.")
    } finally {
      setLoading(false)
    }
  }, [page, q, status, sort])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data fetch on mount; loader sets loading state before fetching
    void loadStudios()
  }, [loadStudios])

  const handleToggleTrusted = async (studioId: string, isTrusted: boolean) => {
    setTogglingIds((prev) => {
      const next = new Set(prev)
      next.add(studioId)
      return next
    })

    try {
      const response = await fetch(`/api/admin/tenants/${studioId}/trusted`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTrusted }),
      })

      if (!response.ok) {
        const json = await response.json().catch(() => null)
        throw new Error(json?.error ?? "Gagal mengubah status verifikasi.")
      }

      setRows((prev) =>
        prev.map((row) => (row.id === studioId ? { ...row, isTrusted } : row))
      )
      toast.success(
        isTrusted
          ? "Studio berhasil ditandai sebagai terverifikasi (Trusted)."
          : "Status terverifikasi studio telah dicabut."
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah status verifikasi.")
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(studioId)
        return next
      })
    }
  }

  const handleTogglePublished = async (studioId: string, isPublished: boolean) => {
    setTogglingIds((prev) => {
      const next = new Set(prev)
      next.add(studioId)
      return next
    })

    try {
      const response = await fetch(`/api/admin/tenants/${studioId}/published`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished }),
      })

      if (!response.ok) {
        const json = await response.json().catch(() => null)
        throw new Error(json?.error ?? "Gagal mengubah status publikasi.")
      }

      setRows((prev) =>
        prev.map((row) => (row.id === studioId ? { ...row, isPublished } : row))
      )
      toast.success(
        isPublished
          ? "Studio berhasil ditayangkan (Live)."
          : "Studio berhasil disembunyikan (Draft)."
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah status publikasi.")
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(studioId)
        return next
      })
    }
  }

  const openActionDialog = (studio: AdminStudioRow, type: "suspend" | "reactivate") => {
    setSelectedStudio(studio)
    setDialogType(type)
    setReason("")
    setReasonCategory("policy_violation")
    setActionError(null)
    setDialogOpen(true)
  }

  const handleStatusAction = async () => {
    if (!selectedStudio || !dialogType) return

    setActionError(null)
    const trimmedReason = reason.trim()

    if (trimmedReason.length < 10) {
      setActionError("Alasan minimal 10 karakter.")
      return
    }

    setActionLoading(true)

    try {
      const endpoint =
        dialogType === "suspend"
          ? `/api/admin/tenants/${selectedStudio.id}/suspend`
          : `/api/admin/tenants/${selectedStudio.id}/reactivate`

      const body =
        dialogType === "suspend"
          ? { reason: trimmedReason, reasonCategory }
          : { reason: trimmedReason }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const json = await response.json().catch(() => null)
        throw new Error(json?.error ?? "Gagal mengubah status akun studio.")
      }

      toast.success(
        dialogType === "suspend"
          ? `Studio ${selectedStudio.name} berhasil ditangguhkan.`
          : `Studio ${selectedStudio.name} berhasil diaktifkan kembali.`
      )

      setDialogOpen(false)
      setSelectedStudio(null)
      setDialogType(null)
      void loadStudios()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Terjadi kesalahan sistem.")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeaderV2
        title="Daftar Studio"
        description="Kelola tenant studio tato terdaftar, status publikasi, verifikasi, dan suspensi."
      />

      <AdminPanel>
        <AdminPageToolbar
          search={
            <AdminFilterBar
              searchValue={q}
              onSearchChange={setQ}
              searchPlaceholder="Cari nama, slug, kota, artis..."
              onSubmit={() => {
                setPage(1)
                void loadStudios()
              }}
            />
          }
          filters={
            <>
              <AdminFilterField label="Status">
                <Select
                  value={status}
                  onValueChange={(v) => {
                    setStatus(v || "all")
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[140px] bg-card border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="suspended">Ditangguhkan</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFilterField>

              <AdminFilterField label="Urutkan">
                <Select
                  value={sort}
                  onValueChange={(v) => {
                    setSort(v || "newest")
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[150px] bg-card border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="oldest">Terlama</SelectItem>
                    <SelectItem value="views">Views Tertinggi</SelectItem>
                    <SelectItem value="clicks">Clicks Tertinggi</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFilterField>
            </>
          }
          onRefresh={() => void loadStudios()}
          refreshLoading={loading}
        />

        <AdminDataTable
          columns={[
            {
              key: "studio",
              header: "Nama Studio",
              cell: (row) => {
                const tagsArray = Array.isArray(row.tags) ? row.tags : []
                return (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">{row.name}</span>
                      <a
                        href={`/app/studio/${row.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Buka landing page"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">/{row.slug}</div>
                    {tagsArray.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {tagsArray.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] py-0 px-1.5 font-normal border-border bg-background text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )
              },
            },
            {
              key: "city",
              header: "Kota",
              cell: (row) => (
                <span className="text-sm font-medium text-muted-foreground">{row.city ?? "—"}</span>
              ),
            },
            {
              key: "artist",
              header: "Artis",
              cell: (row) => (
                <span className="text-sm font-medium text-muted-foreground">{row.artist ?? "—"}</span>
              ),
            },
            {
              key: "metrics",
              header: "Metrik (Views / Clicks)",
              cell: (row) => (
                <span className="text-xs font-mono text-muted-foreground bg-card border border-border/60 rounded px-2 py-1 select-none">
                  👁️ {formatNumber(row.viewCount)} / 🔗 {formatNumber(row.clickCount)}
                </span>
              ),
            },
            {
              key: "status_toggles",
              header: "Status & Kelayakan",
              cell: (row) => (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AdminStatusBadge status={row.status} />
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1.5 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={row.isTrusted}
                        onCheckedChange={(checked) => handleToggleTrusted(row.id, checked)}
                        disabled={!isSuperAdmin || togglingIds.has(row.id)}
                      />
                      <span className="text-[11px] font-medium text-muted-foreground">Trusted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={row.isPublished}
                        onCheckedChange={(checked) => handleTogglePublished(row.id, checked)}
                        disabled={!isSuperAdmin || togglingIds.has(row.id)}
                      />
                      <span className="text-[11px] font-medium text-muted-foreground">Live (Tayang)</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "actions",
              header: "Aksi",
              cell: (row) => {
                if (row.status === "active") {
                  return (
                    <Button
                      size="sm"
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium"
                      disabled={!canSuspend}
                      onClick={() => openActionDialog(row, "suspend")}
                    >
                      Suspend
                    </Button>
                  )
                } else {
                  return (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border bg-card hover:bg-accent text-foreground font-medium"
                      disabled={!canSuspend}
                      onClick={() => openActionDialog(row, "reactivate")}
                    >
                      Reactivate
                    </Button>
                  )
                }
              },
            },
          ]}
          rows={rows}
          rowKey={(row) => row.id}
          loading={loading}
          emptyIcon={Building2}
          emptyTitle="Tidak ada studio ditemukan"
          emptyDescription="Coba ubah filter atau kata kunci pencarian."
        />
      </AdminPanel>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={total}
        totalLabel="studio"
        loading={loading}
        onPageChange={setPage}
      />

      {/* Suspend / Reactivate Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-background border border-border text-foreground max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogType === "suspend" ? "Tangguhkan Akun Studio" : "Aktifkan Kembali Studio"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              {dialogType === "suspend" ? (
                <>
                  Apakah Anda yakin ingin menangguhkan studio <strong>{selectedStudio?.name}</strong>?
                  Halaman landing page publik akan disembunyikan dan akses masuk studio akan diblokir.
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin mengaktifkan kembali studio <strong>{selectedStudio?.name}</strong>?
                  Akses masuk studio akan dipulihkan.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-2">
            {dialogType === "suspend" && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Kategori Alasan</label>
                <Select
                  value={reasonCategory}
                  onValueChange={(v) => setReasonCategory(v as SuspensionReasonCategory)}
                >
                  <SelectTrigger className="w-full bg-card border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    {SUSPENSION_REASON_CATEGORIES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Catatan Alasan {dialogType === "suspend" ? "Penangguhan" : "Pengaktifan"} (Min. 10 Karakter)
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Masukkan catatan audit penangguhan/pengaktifan..."
                rows={3}
                className="bg-card border-border text-foreground placeholder-muted-foreground focus-visible:ring-ring"
              />
            </div>

            {actionError && (
              <p className="text-sm font-medium text-destructive">{actionError}</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={actionLoading}
              className="bg-card border-border text-foreground hover:bg-accent"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={actionLoading}
              onClick={(e) => {
                e.preventDefault()
                void handleStatusAction()
              }}
              className={
                dialogType === "suspend"
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium"
                  : "bg-foreground hover:bg-foreground/90 text-background font-medium"
              }
            >
              {actionLoading ? "Memproses..." : dialogType === "suspend" ? "Ya, Suspend" : "Ya, Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
