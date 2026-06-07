"use client"

import { useEffect, useState } from "react"

import { PageHeading } from "@/components/design"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type SuspendedStudio = {
  id: string
  name: string
  slug: string
  city: string | null
  status: string
  updatedAt: string
}

type SuspensionLog = {
  id: string
  studioName: string
  studioSlug: string
  statusBefore: string
  statusAfter: string
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

  useEffect(() => {
    fetch("/api/admin/suspensions")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.data) {
          setSuspended(json.data.suspended ?? [])
          setLogs(json.data.logs ?? [])
        }
      })
      .finally(() => setLoading(false))
  }, [])

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
                <TableHead>Kota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Diperbarui</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Memuat...
                  </TableCell>
                </TableRow>
              ) : suspended.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Tidak ada studio yang di-suspend.
                  </TableCell>
                </TableRow>
              ) : (
                suspended.map((studio) => (
                  <TableRow key={studio.id}>
                    <TableCell>
                      <div className="font-medium">{studio.name}</div>
                      <div className="text-xs text-muted-foreground">{studio.slug}</div>
                    </TableCell>
                    <TableCell>{studio.city ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400">
                        {studio.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(studio.updatedAt)}</TableCell>
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
                <TableHead>Alasan</TableHead>
                <TableHead>Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
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
                    <TableCell className="max-w-xs truncate">{log.reason}</TableCell>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
