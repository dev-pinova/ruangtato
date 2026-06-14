"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { History, ShieldBan } from "lucide-react"
import { toast } from "sonner"

import {
  AdminDataTable,
  AdminMetricStrip,
  AdminPageHeaderV2,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/admin/ui"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
import { getSuspensionReasonCategoryLabel } from "@/lib/admin/suspension-types"

type SuspendedStudio = {
  id: string
  name: string
  slug: string
  city: string | null
  status: string
  ownerEmail: string | null
  ownerName: string | null
  updatedAt: string
}

type SuspensionLog = {
  id: string
  studioName: string
  studioSlug: string
  statusBefore: string
  statusAfter: string
  reasonCategory: string | null
  reason: string
  createdAt: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function SuspensionsPanel() {
  const [suspended, setSuspended] = useState<SuspendedStudio[]>([])
  const [logs, setLogs] = useState<SuspensionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [reactivateTarget, setReactivateTarget] = useState<SuspendedStudio | null>(
    null,
  )
  const [reactivateReason, setReactivateReason] = useState("")
  const [reactivateError, setReactivateError] = useState<string | null>(null)
  const [reactivateBusy, setReactivateBusy] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/suspensions")
      if (!response.ok) return
      const json = await response.json()
      if (json?.data) {
        setSuspended(json.data.suspended ?? [])
        setLogs(json.data.logs ?? [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data fetch on mount; loader sets loading state before fetching
    void loadData()
  }, [loadData])

  async function submitReactivate() {
    if (!reactivateTarget) return
    setReactivateError(null)
    if (reactivateReason.trim().length < 10) {
      setReactivateError("Alasan minimal 10 karakter.")
      return
    }

    setReactivateBusy(true)
    try {
      const response = await fetch(
        `/api/admin/tenants/${reactivateTarget.id}/reactivate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: reactivateReason.trim() }),
        },
      )
      const json = await response.json().catch(() => null)
      if (!response.ok) {
        setReactivateError(json?.error ?? "Gagal reactivate.")
        return
      }
      setReactivateTarget(null)
      setReactivateReason("")
      toast.success(`${reactivateTarget.name} berhasil di-reactivate.`)
      await loadData()
    } finally {
      setReactivateBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <AdminPageHeaderV2
        title="Suspensions"
        description="Studio yang dinonaktifkan dan riwayat suspend/reactivate."
      />

      <AdminMetricStrip
        items={[
          {
            id: "suspended",
            label: "Studio suspended",
            count: suspended.length,
            icon: ShieldBan,
            tone: suspended.length > 0 ? "error" : "success",
          },
          {
            id: "history",
            label: "Riwayat log",
            count: logs.length,
            icon: History,
            tone: "info",
          },
        ]}
      />

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Studio suspended</h2>
        <AdminPanel>
          <AdminDataTable
            className="border-0 md:rounded-none md:border-0"
            columns={[
              {
                key: "studio",
                header: "Studio",
                cell: (row) => (
                  <div className="min-w-0">
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-muted-foreground">{row.slug}</div>
                  </div>
                ),
              },
              {
                key: "owner",
                header: "Owner",
                cell: (row) => (
                  <div className="min-w-0">
                    <div>{row.ownerName ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.ownerEmail ?? "—"}
                    </div>
                  </div>
                ),
              },
              { key: "city", header: "Kota", cell: (row) => row.city ?? "—" },
              {
                key: "status",
                header: "Status",
                cell: (row) => <AdminStatusBadge status={row.status} />,
              },
              {
                key: "updated",
                header: "Diperbarui",
                cell: (row) => formatDate(row.updatedAt),
              },
              {
                key: "action",
                header: "Aksi",
                className: "text-right",
                cell: (row) => (
                  <Button
                    size="sm"
                    variant="outline"
                    className="min-h-11 sm:min-h-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      setReactivateTarget(row)
                      setReactivateReason("")
                      setReactivateError(null)
                    }}
                  >
                    Reactivate
                  </Button>
                ),
              },
            ]}
            rows={suspended}
            rowKey={(row) => row.id}
            loading={loading}
            emptyIcon={ShieldBan}
            emptyTitle="Belum ada studio yang di-suspend"
            emptyDescription="Semua tenant aktif — tidak ada yang perlu ditinjau."
            emptyCelebratory
            mobileCard={(row) => (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.slug}</p>
                  </div>
                  <AdminStatusBadge status={row.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {row.ownerName ?? "—"} · {formatDate(row.updatedAt)}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-11 w-full"
                  onClick={() => {
                    setReactivateTarget(row)
                    setReactivateReason("")
                    setReactivateError(null)
                  }}
                >
                  Reactivate
                </Button>
              </div>
            )}
          />
        </AdminPanel>
        {!loading && suspended.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Gunakan{" "}
            <Link href="/admin/tenants" className="text-primary underline">
              Tenants
            </Link>{" "}
            → buka detail studio → Suspend tenant.
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Riwayat</h2>
        <AdminPanel>
          <AdminDataTable
            className="border-0 md:rounded-none md:border-0"
            columns={[
              { key: "studio", header: "Studio", cell: (row) => row.studioName },
              {
                key: "change",
                header: "Perubahan",
                cell: (row) => `${row.statusBefore} → ${row.statusAfter}`,
              },
              {
                key: "category",
                header: "Kategori",
                cell: (row) => getSuspensionReasonCategoryLabel(row.reasonCategory),
              },
              {
                key: "reason",
                header: "Alasan",
                cell: (row) => (
                  <span className="max-w-xs truncate">{row.reason}</span>
                ),
              },
              {
                key: "time",
                header: "Waktu",
                cell: (row) => formatDate(row.createdAt),
              },
            ]}
            rows={logs}
            rowKey={(row) => row.id}
            loading={loading}
            emptyIcon={History}
            emptyTitle="Belum ada riwayat"
            mobileCard={(row) => (
              <div className="space-y-2 text-sm">
                <p className="font-medium">{row.studioName}</p>
                <p className="text-muted-foreground">
                  {row.statusBefore} → {row.statusAfter}
                </p>
                <p className="text-xs text-muted-foreground">{row.reason}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(row.createdAt)}
                </p>
              </div>
            )}
          />
        </AdminPanel>
      </section>

      <AlertDialog
        open={Boolean(reactivateTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setReactivateTarget(null)
            setReactivateReason("")
            setReactivateError(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate tenant?</AlertDialogTitle>
            <AlertDialogDescription>
              Studio <strong>{reactivateTarget?.name}</strong>
              {reactivateTarget?.ownerEmail ? (
                <>
                  {" "}
                  dan akun <strong>{reactivateTarget.ownerEmail}</strong>
                </>
              ) : null}{" "}
              akan diaktifkan kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={reactivateReason}
            onChange={(e) => setReactivateReason(e.target.value)}
            placeholder="Alasan reactivate (min. 10 karakter)"
            rows={3}
          />
          {reactivateError ? (
            <p className="text-sm text-destructive">{reactivateError}</p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={reactivateBusy}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={reactivateBusy}
              onClick={(e) => {
                e.preventDefault()
                void submitReactivate()
              }}
            >
              Ya, reactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
