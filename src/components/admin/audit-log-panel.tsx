"use client"

import { useEffect, useState } from "react"

import { PageHeading } from "@/components/design"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type AuditRow = {
  id: string
  actorUserId: string
  action: string
  targetType: string
  targetId: string
  reason: string | null
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

export function AuditLogPanel() {
  const [rows, setRows] = useState<AuditRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/audit-logs")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setRows(json?.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeading
        title="Audit Log"
        description="Riwayat aksi sensitif yang dilakukan admin."
      />

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Alasan</TableHead>
              <TableHead>Actor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Belum ada entri audit log.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell className="font-mono text-xs">{row.action}</TableCell>
                  <TableCell>
                    {row.targetType}:{row.targetId.slice(0, 8)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{row.reason ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{row.actorUserId.slice(0, 8)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
