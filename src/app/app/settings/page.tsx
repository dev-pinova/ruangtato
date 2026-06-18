"use client"

import { useEffect, useState } from "react"
import { UserPlus, Upload } from "lucide-react"

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
import { useLanguage } from "@/lib/i18n/language-provider"

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
  const { t } = useLanguage()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [city, setCity] = useState("")
  const [waNumber, setWaNumber] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (!studio) return
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
          : t.settings.profile.errorMsg,
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
          <CardTitle>{t.settings.profile.title}</CardTitle>
          <CardDescription>
            {t.settings.profile.desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t.settings.profile.loading}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.settings.profile.title}</CardTitle>
        <CardDescription>
          {t.settings.profile.desc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="grid gap-5 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="studio-name">{t.settings.profile.nameLabel}</Label>
            <Input
              id="studio-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">{t.settings.profile.slugLabel}</Label>
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
            <Label htmlFor="city">{t.settings.profile.cityLabel}</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">{t.settings.profile.waLabel}</Label>
            <Input
              id="whatsapp"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="6281234567890"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cover-image">{t.settings.profile.coverLabel}</Label>
            <div className="flex items-center gap-3">
              <Input
                id="cover-image"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                disabled={uploadingImage}
                onClick={() => document.getElementById("cover-image-upload")?.click()}
                className="shrink-0 gap-2"
              >
                <Upload className="size-4" />
                {uploadingImage ? t.settings.profile.uploading : t.settings.profile.uploadBtn}
              </Button>
              <input
                id="cover-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  
                  setUploadingImage(true)
                  try {
                    const fd = new FormData()
                    fd.append("file", file)
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: fd,
                    })
                    
                    if (!res.ok) {
                      const data = await res.json().catch(() => ({}))
                      throw new Error(data.error || t.settings.profile.imageUploadError)
                    }
                    
                    const data = await res.json()
                    if (data.url) {
                      setCoverImage(data.url)
                    }
                  } catch (err: any) {
                    alert(err.message || t.settings.profile.imageUploadError)
                  } finally {
                    setUploadingImage(false)
                    // reset input
                    e.target.value = ""
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t.settings.profile.coverNote}
            </p>
            {coverImage ? (
              <div className="overflow-hidden rounded-md border border-border bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt={t.settings.profile.coverPreviewAlt}
                  className="aspect-video w-full max-w-sm object-cover"
                />
              </div>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t.settings.profile.descLabel}</Label>
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
              {t.settings.profile.successMsg}
            </p>
          ) : null}
          <Separator />
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? t.settings.profile.saving : t.settings.profile.saveBtn}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function TimTab() {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.settings.team.title}</CardTitle>
        <CardDescription>
          {t.settings.team.desc}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger
              render={<Button size="sm" />}
            >
              <UserPlus className="size-4" data-icon="inline-start" />
              {t.settings.team.inviteBtn}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.settings.team.inviteTitle}</DialogTitle>
                <DialogDescription>
                  {t.settings.team.inviteDesc}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="invite-email">{t.settings.team.emailLabel}</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="nama@email.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t.settings.team.roleLabel}</Label>
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
                <Button className="w-full sm:w-auto">{t.settings.team.sendInviteBtn}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <p className="rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          {t.settings.team.comingSoon}
        </p>
      </CardContent>
    </Card>
  )
}

function AkunTab({ user }: { user: MeUser | null }) {
  const { t } = useLanguage()

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.account.title}</CardTitle>
          <CardDescription>
            {t.settings.account.desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t.settings.account.loading}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.settings.account.title}</CardTitle>
        <CardDescription>
          {t.settings.account.desc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="email">{t.settings.account.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user.email}
              readOnly
            />
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label htmlFor="current-password">{t.settings.account.currentPassword}</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">{t.settings.account.newPassword}</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">{t.settings.account.confirmPassword}</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button>{t.settings.account.saveBtn}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BahayaTab() {
  const { t } = useLanguage()

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">{t.settings.danger.title}</CardTitle>
        <CardDescription>
          {t.settings.danger.desc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            {t.settings.danger.deleteBtn}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.settings.danger.confirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.settings.danger.confirmDesc}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.settings.danger.cancelBtn}</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                {t.settings.danger.confirmBtn}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  const { t } = useLanguage()
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
        title={t.settings.title}
        description={t.settings.description}
      />

      <Tabs defaultValue={0}>
        <TabsList variant="line">
          <TabsTrigger value={0}>{t.settings.tabs.profile}</TabsTrigger>
          <TabsTrigger value={1}>{t.settings.tabs.team}</TabsTrigger>
          <TabsTrigger value={2}>{t.settings.tabs.account}</TabsTrigger>
          <TabsTrigger value={3}>{t.settings.tabs.danger}</TabsTrigger>
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
