"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

import { PageHeading } from "@/components/design"
import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getSuspensionReasonCategoryLabel } from "@/lib/suspension-types"

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
      await loadData()
    } finally {
      setReactivateBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeading
        title="Suspensions"
        description="Studio yang dinonaktifkan dan riwayat suspend/reactivate."
      />

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Studio suspended</h2>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Studio</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Diperbarui</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Memuat...
                  </TableCell>
                </TableRow>
              ) : suspended.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="space-y-2 py-8 text-center">
                    <p className="text-muted-foreground">
                      Belum ada studio yang di-suspend.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Gunakan{" "}
                      <Link href="/admin/tenants" className="text-primary underline">
                        Tenants
                      </Link>{" "}
                      → buka detail studio → Suspend tenant.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                suspended.map((studio) => (
                  <TableRow key={studio.id}>
                    <TableCell>
                      <div className="font-medium">{studio.name}</div>
                      <div className="text-xs text-muted-foreground">{studio.slug}</div>
                    </TableCell>
                    <TableCell>
                      <div>{studio.ownerName ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">
                        {studio.ownerEmail ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell>{studio.city ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-red-500/30 bg-red-500/10 text-red-400"
                      >
                        {studio.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(studio.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReactivateTarget(studio)
                          setReactivateReason("")
                          setReactivateError(null)
                        }}
                      >
                        Reactivate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Riwayat</h2>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Studio</TableHead>
                <TableHead>Perubahan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Alasan</TableHead>
                <TableHead>Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Belum ada riwayat.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.studioName}</TableCell>
                    <TableCell>
                      {log.statusBefore} → {log.statusAfter}
                    </TableCell>
                    <TableCell>
                      {getSuspensionReasonCategoryLabel(log.reasonCategory)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{log.reason}</TableCell>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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
