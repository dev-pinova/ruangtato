"use client"

import { useEffect, useState } from "react"
import { ScrollText } from "lucide-react"

import {
  AdminDataTable,
  AdminPageHeader,
} from "@/components/admin/ui"

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
      <AdminPageHeader
        title="Audit Log"
        description="Riwayat aksi sensitif yang dilakukan admin."
      />

      <AdminDataTable
        columns={[
          {
            key: "time",
            header: "Waktu",
            cell: (row) => formatDate(row.createdAt),
          },
          {
            key: "action",
            header: "Aksi",
            cell: (row) => (
              <span className="font-mono text-xs">{row.action}</span>
            ),
          },
          {
            key: "target",
            header: "Target",
            cell: (row) => `${row.targetType}:${row.targetId.slice(0, 8)}`,
          },
          {
            key: "reason",
            header: "Alasan",
            cell: (row) => (
              <span className="max-w-xs truncate">{row.reason ?? "—"}</span>
            ),
          },
          {
            key: "actor",
            header: "Actor",
            cell: (row) => (
              <span className="font-mono text-xs">{row.actorUserId.slice(0, 8)}</span>
            ),
          },
        ]}
        rows={rows}
        rowKey={(row) => row.id}
        loading={loading}
        emptyIcon={ScrollText}
        emptyTitle="Belum ada entri audit log"
        mobileCard={(row) => (
          <div className="space-y-2 text-sm">
            <p className="font-mono text-xs">{row.action}</p>
            <p className="text-muted-foreground">
              {row.targetType}:{row.targetId.slice(0, 8)}
            </p>
            {row.reason ? (
              <p className="text-xs text-muted-foreground">{row.reason}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {formatDate(row.createdAt)}
            </p>
          </div>
        )}
      />
    </div>
  )
}
