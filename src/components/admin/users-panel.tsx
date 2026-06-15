"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { CheckCircle2, User as UserIcon } from "lucide-react"
import { toast } from "sonner"

import {
  AdminDataTable,
  AdminFilterBar,
  AdminFilterField,
  AdminPageHeaderV2,
  AdminPageToolbar,
  AdminPagination,
  AdminPanel,
  AdminRoleBadge,
  AdminStatusBadge,
} from "@/components/admin/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import type { AdminUserRow } from "@/lib/admin/admin-service"
import { ADMIN_PAGE_SIZE } from "@/lib/admin/admin-constants"

type UsersResponse = {
  data: AdminUserRow[]
  total: number
  page: number
  limit: number
}

function getInitials(name: string) {
  if (!name?.trim()) return "?"
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  )
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function UsersPanel({
  currentUserId,
}: {
  currentUserId: string
}) {
  const [rows, setRows] = useState<AdminUserRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Filters State
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")
  const [platformRole, setPlatformRole] = useState("all")

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)), [total])

  const loadUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: String(ADMIN_PAGE_SIZE),
    })

    if (q.trim()) params.set("q", q.trim())
    if (status && status !== "all") params.set("status", status)
    if (platformRole && platformRole !== "all") params.set("platformRole", platformRole)

    try {
      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) {
        toast.error("Gagal mengambil data pengguna.")
        return
      }
      const json = (await response.json()) as UsersResponse
      setRows(json.data ?? [])
      setTotal(json.total ?? 0)
    } catch (err) {
      console.error(err)
      toast.error("Terjadi kesalahan sistem saat mengambil data.")
    } finally {
      setLoading(false)
    }
  }, [page, q, status, platformRole])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data fetch on mount; loader sets loading state before fetching
    void loadUsers()
  }, [loadUsers])

  const handleRoleChange = async (userId: string, newRole: string | null) => {
    setUpdatingId(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platformRole: newRole }),
      })

      if (!response.ok) {
        const json = await response.json().catch(() => null)
        throw new Error(json?.error ?? "Gagal memperbarui hak akses.")
      }

      setRows((prev) =>
        prev.map((row) => (row.id === userId ? { ...row, platformRole: newRole } : row))
      )
      toast.success("Hak akses pengguna berhasil diperbarui.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses.")
    } finally {
      setUpdatingId(null)
    }
  }

  const openStatusConfirm = (userRow: AdminUserRow) => {
    setSelectedUser(userRow)
    setDialogOpen(true)
  }

  const handleToggleStatus = async () => {
    if (!selectedUser) return

    setActionLoading(true)
    const isSuspended = selectedUser.status === "suspended"
    const nextStatus = isSuspended ? "active" : "suspended"

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!response.ok) {
        const json = await response.json().catch(() => null)
        throw new Error(json?.error ?? "Gagal memperbarui status akun.")
      }

      toast.success(
        nextStatus === "suspended"
          ? `Akun ${selectedUser.name} berhasil ditangguhkan dan seluruh sesi aktifnya telah dicabut.`
          : `Akun ${selectedUser.name} berhasil diaktifkan kembali.`
      )

      setRows((prev) =>
        prev.map((row) => (row.id === selectedUser.id ? { ...row, status: nextStatus } : row))
      )
      setDialogOpen(false)
      setSelectedUser(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan.")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeaderV2
        title="Manajemen Hak Akses & Akun"
        description="Kelola hak akses role platform staf dan penangguhan status login pengguna."
      />

      <AdminPanel>
        <AdminPageToolbar
          search={
            <AdminFilterBar
              searchValue={q}
              onSearchChange={setQ}
              searchPlaceholder="Cari nama atau email..."
              onSubmit={() => {
                setPage(1)
                void loadUsers()
              }}
            />
          }
          filters={
            <>
              <AdminFilterField label="Role">
                <Select
                  value={platformRole}
                  onValueChange={(v) => {
                    setPlatformRole(v || "all")
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[140px] bg-card border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="all">Semua Role</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="user">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFilterField>

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
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="suspended">Ditangguhkan</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFilterField>
            </>
          }
          onRefresh={() => void loadUsers()}
          refreshLoading={loading}
        />

        <AdminDataTable
          columns={[
            {
              key: "user",
              header: "Avatar & Nama",
              cell: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 border border-border bg-background">
                    {row.image && <AvatarImage src={row.image} alt={row.name} />}
                    <AvatarFallback className="bg-card text-muted-foreground text-xs font-semibold select-none">
                      {getInitials(row.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {row.name}
                  </span>
                </div>
              ),
            },
            {
              key: "email",
              header: "Email",
              cell: (row) => (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]" title={row.email}>
                    {row.email}
                  </span>
                  {row.emailVerified && (
                    <span title="Email Terverifikasi">
                      <CheckCircle2 className="size-4 text-success shrink-0" />
                    </span>
                  )}
                </div>
              ),
            },
            {
              key: "role",
              header: "Platform Role",
              cell: (row) => <AdminRoleBadge role={row.platformRole} />,
            },
            {
              key: "manage_role",
              header: "Ubah Role",
              cell: (row) => {
                const isSelf = row.id === currentUserId
                return (
                  <Select
                    value={row.platformRole || "user"}
                    onValueChange={(val) => handleRoleChange(row.id, val === "user" ? null : val)}
                    disabled={isSelf || updatingId === row.id}
                  >
                    <SelectTrigger className="w-[130px] h-8 bg-card border-border text-foreground text-xs focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="user">Regular User</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="support">Support Staff</SelectItem>
                      <SelectItem value="finance">Finance Staff</SelectItem>
                    </SelectContent>
                  </Select>
                )
              },
            },
            {
              key: "status",
              header: "Status",
              cell: (row) => <AdminStatusBadge status={row.status} />,
            },
            {
              key: "registered",
              header: "Terdaftar",
              cell: (row) => (
                <span className="text-xs text-muted-foreground font-medium">{formatDate(row.createdAt)}</span>
              ),
            },
            {
              key: "actions",
              header: "Aksi Penguncian",
              cell: (row) => {
                const isSelf = row.id === currentUserId
                if (row.status === "active") {
                  return (
                    <Button
                      size="sm"
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium h-8"
                      disabled={isSelf}
                      onClick={() => openStatusConfirm(row)}
                    >
                      Suspend
                    </Button>
                  )
                } else {
                  return (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border bg-card hover:bg-accent text-foreground font-medium h-8"
                      disabled={isSelf}
                      onClick={() => openStatusConfirm(row)}
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
          emptyIcon={UserIcon}
          emptyTitle="Tidak ada pengguna ditemukan"
          emptyDescription="Coba ubah filter atau kata kunci pencarian."
        />
      </AdminPanel>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={total}
        totalLabel="pengguna"
        loading={loading}
        onPageChange={setPage}
      />

      {/* Status Toggle Confirmation */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-background border border-border text-foreground max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "active" ? "Tangguhkan Akun Pengguna" : "Aktifkan Kembali Akun"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              {selectedUser?.status === "active" ? (
                <>
                  Apakah Anda yakin ingin menangguhkan akun milik <strong>{selectedUser?.name}</strong> ({selectedUser?.email})?
                  <br />
                  <span className="text-destructive font-semibold block mt-2">
                    ⚠️ Pengguna ini akan didepak seketika dari sesi aktif mereka dan dilarang masuk ke sistem!
                  </span>
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin mengaktifkan kembali akun milik <strong>{selectedUser?.name}</strong> ({selectedUser?.email})?
                  Akses login mereka akan dipulihkan secara normal.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
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
                void handleToggleStatus()
              }}
              className={
                selectedUser?.status === "active"
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium"
                  : "bg-foreground hover:bg-foreground/90 text-background font-medium"
              }
            >
              {actionLoading ? "Memproses..." : selectedUser?.status === "active" ? "Ya, Suspend" : "Ya, Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
