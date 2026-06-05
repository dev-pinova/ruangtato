"use client"

import { UserPlus } from "lucide-react"
import { H2 } from "@/components/ui/typography"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { MOCK_TEAM } from "@/lib/mock-data"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const ROLE_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  owner: { label: "Owner", variant: "default" },
  admin: { label: "Admin", variant: "secondary" },
  member: { label: "Member", variant: "outline" },
}

function ProfilStudioTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Studio</CardTitle>
        <CardDescription>
          Informasi dasar studio yang ditampilkan di halaman landing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="studio-name">Nama Studio</Label>
            <Input
              id="studio-name"
              defaultValue="Ink & Iron Studio"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug URL</Label>
            <div className="flex items-center gap-0">
              <span className="flex h-11 items-center rounded-l-2xl border border-r-0 border-input bg-white/3 px-3 text-sm text-muted-foreground">
                ruangtato.com/app/studio/
              </span>
              <Input
                id="slug"
                defaultValue="ink-and-iron"
                className="rounded-l-none"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">Kota</Label>
            <Input id="city" defaultValue="Jakarta" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
            <Input
              id="whatsapp"
              defaultValue="6281234567890"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              defaultValue="Studio premium dengan fokus blackwork tajam dan realism detail untuk sleeve maupun custom piece."
              rows={3}
            />
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button>Simpan Perubahan</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TimTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Anggota Tim</CardTitle>
        <CardDescription>
          Kelola siapa saja yang memiliki akses ke studio ini
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger
              render={<Button size="sm" />}
            >
              <UserPlus className="size-4" data-icon="inline-start" />
              Undang Anggota
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Undang Anggota Baru</DialogTitle>
                <DialogDescription>
                  Kirim undangan melalui email untuk bergabung ke studio ini
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="nama@email.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Select defaultValue="member">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full sm:w-auto">Kirim Undangan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TEAM.map((member) => {
              const role = ROLE_CONFIG[member.role]
              return (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.variant}>{role.label}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(member.joinedAt)}
                  </TableCell>
                  <TableCell>
                    {member.role === "owner" ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <Select defaultValue={member.role}>
                        <SelectTrigger size="sm" className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function AkunTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Akun</CardTitle>
        <CardDescription>
          Ubah email dan kata sandi akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="bima@inkandiron.id"
            />
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">Kata Sandi Baru</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button>Simpan Perubahan</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BahayaTab() {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Hapus Studio</CardTitle>
        <CardDescription>
          Setelah studio dihapus, semua data termasuk landing page, lead, dan
          statistik akan hilang secara permanen. Tindakan ini tidak dapat
          dibatalkan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            Hapus Studio
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Semua data studio
                termasuk landing page, lead, dan statistik akan dihapus secara
                permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Ya, Hapus Studio
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl">
      <H2>Pengaturan</H2>

      <Tabs defaultValue={0}>
        <TabsList variant="line">
          <TabsTrigger value={0}>Profil Studio</TabsTrigger>
          <TabsTrigger value={1}>Tim</TabsTrigger>
          <TabsTrigger value={2}>Akun</TabsTrigger>
          <TabsTrigger value={3}>Bahaya</TabsTrigger>
        </TabsList>

        <TabsContent value={0}>
          <ProfilStudioTab />
        </TabsContent>
        <TabsContent value={1}>
          <TimTab />
        </TabsContent>
        <TabsContent value={2}>
          <AkunTab />
        </TabsContent>
        <TabsContent value={3}>
          <BahayaTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
