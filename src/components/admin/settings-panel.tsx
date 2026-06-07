"use client"

import { useCallback, useEffect, useState } from "react"
import { Search, ShieldCheck, UserCog } from "lucide-react"

import {
  AdminDataTable,
  AdminFeedbackBanner,
  AdminPageHeader,
  AdminSectionCard,
} from "@/components/admin/ui"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { AdminStaffRow } from "@/lib/admin-staff-service"
import type { PlatformRole } from "@/lib/admin-auth"

const ROLES: PlatformRole[] = ["super_admin", "admin", "support", "finance"]

type StudioSearchRow = {
  id: string
  slug: string
  name: string
  isTrusted: boolean
}

function roleBadge(role: PlatformRole) {
  const styles: Record<PlatformRole, string> = {
    super_admin: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    admin: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    support: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    finance: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  }

  return (
    <Badge variant="outline" className={styles[role]}>
      {role}
    </Badge>
  )
}

export function SettingsPanel() {
  const [staff, setStaff] = useState<AdminStaffRow[]>([])
  const [loading, setLoading] = useState(true)
  const [assignEmail, setAssignEmail] = useState("")
  const [assignRole, setAssignRole] = useState<PlatformRole>("admin")
  const [assignBusy, setAssignBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [studioQuery, setStudioQuery] = useState("")
  const [studioResults, setStudioResults] = useState<StudioSearchRow[]>([])
  const [studioBusy, setStudioBusy] = useState(false)

  const loadStaff = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/staff")
      if (!res.ok) throw new Error("Gagal memuat staff")
      const json = (await res.json()) as { data: AdminStaffRow[] }
      setStaff(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat staff")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadStaff()
  }, [loadStaff])

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault()
    setAssignBusy(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch("/api/admin/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: assignEmail, platformRole: assignRole }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Assign gagal")
      setMessage(`Role ${assignRole} di-assign ke ${assignEmail}`)
      setAssignEmail("")
      await loadStaff()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assign gagal")
    } finally {
      setAssignBusy(false)
    }
  }

  async function handleRevoke(email: string) {
    if (!confirm(`Cabut akses platform untuk ${email}?`)) return
    setMessage(null)
    setError(null)
    try {
      const res = await fetch("/api/admin/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, platformRole: null }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Revoke gagal")
      setMessage(`Akses platform dicabut dari ${email}`)
      await loadStaff()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revoke gagal")
    }
  }

  async function searchStudios() {
    if (!studioQuery.trim()) return
    setStudioBusy(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/tenants?q=${encodeURIComponent(studioQuery)}&limit=10`,
      )
      if (!res.ok) throw new Error("Gagal mencari studio")
      const json = (await res.json()) as {
        data: Array<{ id: string; slug: string; name: string; isTrusted: boolean }>
      }
      setStudioResults(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mencari studio")
    } finally {
      setStudioBusy(false)
    }
  }

  async function toggleTrusted(studio: StudioSearchRow, next: boolean) {
    setStudioBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/tenants/${studio.id}/trusted`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTrusted: next }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Update trusted gagal")
      setStudioResults((rows) =>
        rows.map((row) =>
          row.id === studio.id ? { ...row, isTrusted: next } : row,
        ),
      )
      setMessage(
        next
          ? `${studio.name} ditandai sebagai trusted`
          : `Trusted badge dicabut dari ${studio.name}`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update trusted gagal")
    } finally {
      setStudioBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Kelola staff internal dan verifikasi trusted badge studio."
      />

      {message ? (
        <AdminFeedbackBanner
          message={message}
          variant="success"
          onDismiss={() => setMessage(null)}
        />
      ) : null}
      {error ? (
        <AdminFeedbackBanner
          message={error}
          variant="error"
          onDismiss={() => setError(null)}
        />
      ) : null}

      <AdminSectionCard className="space-y-4">
        <div className="flex items-center gap-2">
          <UserCog className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Staff internal</h2>
        </div>

        <form
          onSubmit={handleAssign}
          className="grid gap-4 md:grid-cols-[1fr_auto_auto]"
        >
          <div className="space-y-2">
            <Label htmlFor="assign-email">Email user</Label>
            <Input
              id="assign-email"
              type="email"
              placeholder="admin@ruangtato.com"
              value={assignEmail}
              onChange={(e) => setAssignEmail(e.target.value)}
              required
              className="min-h-11 md:min-h-9"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={assignRole}
              onValueChange={(v) => setAssignRole(v as PlatformRole)}
            >
              <SelectTrigger className="w-full min-h-11 md:w-[180px] md:min-h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              disabled={assignBusy}
              className="min-h-11 w-full md:min-h-0 md:w-auto"
            >
              Assign role
            </Button>
          </div>
        </form>

        <AdminDataTable
          columns={[
            { key: "name", header: "Nama", cell: (row) => row.name },
            { key: "email", header: "Email", cell: (row) => row.email },
            {
              key: "role",
              header: "Role",
              cell: (row) => roleBadge(row.platformRole),
            },
            { key: "status", header: "Status", cell: (row) => row.status },
            {
              key: "action",
              header: "Aksi",
              className: "text-right",
              cell: (row) => (
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-11 sm:min-h-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    void handleRevoke(row.email)
                  }}
                >
                  Revoke
                </Button>
              ),
            },
          ]}
          rows={staff}
          rowKey={(row) => row.id}
          loading={loading}
          emptyIcon={UserCog}
          emptyTitle="Belum ada staff internal"
          mobileCard={(row) => (
            <div className="space-y-3">
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-muted-foreground">{row.email}</p>
              </div>
              <div className="flex items-center justify-between">
                {roleBadge(row.platformRole)}
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-11"
                  onClick={() => void handleRevoke(row.email)}
                >
                  Revoke
                </Button>
              </div>
            </div>
          )}
        />
      </AdminSectionCard>

      <AdminSectionCard className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Trusted badge studio</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Cari studio lalu toggle trusted badge untuk verifikasi di showcase.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Nama atau slug studio"
            value={studioQuery}
            onChange={(e) => setStudioQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                void searchStudios()
              }
            }}
            className="min-h-11 sm:min-h-9"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => void searchStudios()}
            disabled={studioBusy}
            className="min-h-11 sm:min-h-0"
          >
            <Search className="size-4" />
            Cari
          </Button>
        </div>

        {studioResults.length > 0 ? (
          <AdminDataTable
            columns={[
              { key: "name", header: "Studio", cell: (row) => row.name },
              {
                key: "slug",
                header: "Slug",
                cell: (row) => (
                  <span className="font-mono text-sm">{row.slug}</span>
                ),
              },
              {
                key: "trusted",
                header: "Trusted",
                cell: (row) => (
                  <Switch
                    checked={row.isTrusted}
                    disabled={studioBusy}
                    onCheckedChange={(checked) =>
                      void toggleTrusted(row, checked)
                    }
                  />
                ),
              },
            ]}
            rows={studioResults}
            rowKey={(row) => row.id}
            emptyIcon={ShieldCheck}
            emptyTitle="Tidak ada hasil"
            mobileCard={(row) => (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {row.slug}
                  </p>
                </div>
                <Switch
                  checked={row.isTrusted}
                  disabled={studioBusy}
                  onCheckedChange={(checked) => void toggleTrusted(row, checked)}
                />
              </div>
            )}
          />
        ) : null}
      </AdminSectionCard>
    </div>
  )
}
