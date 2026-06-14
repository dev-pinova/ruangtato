"use client"

import { useEffect, useState } from "react"
import { UserPlus } from "lucide-react"

import { STUDIO_URL_DISPLAY_PREFIX } from "@/lib/site"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
import { PageHeading } from "@/components/design"
import type { Studio } from "@/lib/types"

type MeUser = {
  name: string
  email: string
}

function ProfilStudioTab({
  studio,
  onStudioUpdated,
}: {
  studio: Studio | null
  onStudioUpdated: (studio: Studio) => void
}) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [city, setCity] = useState("")
  const [waNumber, setWaNumber] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!studio) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync editable form fields when the studio prop loads/changes
    setName(studio.name)
    setSlug(studio.slug)
    setCity(studio.city)
    setWaNumber(studio.waNumber)
    setCoverImage(studio.image)
    setDescription(studio.description)
  }, [studio])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    const res = await fetch("/api/studios/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, slug, city, waNumber, description, image: coverImage }),
    })

    setSaving(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(
        typeof data.error === "string"
          ? data.error
          : "Gagal menyimpan perubahan. Coba lagi.",
      )
      return
    }

    const data = await res.json()
    if (data?.studio) {
      onStudioUpdated(data.studio)
      window.dispatchEvent(
        new CustomEvent("studio-profile-updated", {
          detail: {
            name: data.studio.name,
            slug: data.studio.slug,
            isPublished: data.studio.isPublished,
          },
        }),
      )
    }

    setSuccess(true)
  }

  if (!studio) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profil Studio</CardTitle>
          <CardDescription>
            Informasi dasar studio yang ditampilkan di halaman landing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Memuat profil studio…</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Studio</CardTitle>
        <CardDescription>
          Informasi dasar studio yang ditampilkan di halaman landing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="grid gap-5 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="studio-name">Nama Studio</Label>
            <Input
              id="studio-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug URL</Label>
            <div className="flex items-center gap-0">
              <span className="flex h-9 items-center rounded-l-md border border-r-0 border-input bg-muted/40 px-3 text-sm text-muted-foreground">
                {STUDIO_URL_DISPLAY_PREFIX}
              </span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="rounded-l-none"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">Kota</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
            <Input
              id="whatsapp"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="6281234567890"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cover-image">Foto Cover Studio</Label>
            <Input
              id="cover-image"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">
              Digunakan di direktori studio. Kosongkan untuk otomatis dari gambar Hero di builder.
            </p>
            {coverImage ? (
              <div className="overflow-hidden rounded-md border border-border bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Preview cover studio"
                  className="aspect-video w-full max-w-sm object-cover"
                />
              </div>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          {success ? (
            <p className="text-sm text-success">
              Profil studio berhasil disimpan.
            </p>
          ) : null}
          <Separator />
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
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

        <p className="rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          Manajemen tim multi-user segera hadir. Saat ini hanya owner utama
          yang memiliki akses ke studio.
        </p>
      </CardContent>
    </Card>
  )
}

function AkunTab({ user }: { user: MeUser | null }) {
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Akun</CardTitle>
          <CardDescription>
            Ubah email dan kata sandi akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Memuat data akun…</p>
        </CardContent>
      </Card>
    )
  }

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
              defaultValue={user.email}
              readOnly
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
  const [studio, setStudio] = useState<Studio | null>(null)
  const [user, setUser] = useState<MeUser | null>(null)

  useEffect(() => {
    fetch("/api/studios/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
          })
        }
        if (data?.studio) setStudio(data.studio)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeading
        title="Pengaturan"
        description="Kelola profil studio, tim, dan akun Anda."
      />

      <Tabs defaultValue={0}>
        <TabsList variant="line">
          <TabsTrigger value={0}>Profil Studio</TabsTrigger>
          <TabsTrigger value={1}>Tim</TabsTrigger>
          <TabsTrigger value={2}>Akun</TabsTrigger>
          <TabsTrigger value={3}>Bahaya</TabsTrigger>
        </TabsList>

        <TabsContent value={0}>
          <ProfilStudioTab
            studio={studio}
            onStudioUpdated={setStudio}
          />
        </TabsContent>
        <TabsContent value={1}>
          <TimTab />
        </TabsContent>
        <TabsContent value={2}>
          <AkunTab user={user} />
        </TabsContent>
        <TabsContent value={3}>
          <BahayaTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
