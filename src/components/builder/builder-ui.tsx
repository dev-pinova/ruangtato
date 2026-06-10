"use client"

import { useCallback, useState, type CSSProperties } from "react"
import { type DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { STUDIO_URL_DISPLAY_PREFIX, studioPublicPath } from "@/lib/site"
import { H2, P, Small } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Save,
  MousePointerClick,
  Check,
  Link2,
  Layers,
  SlidersHorizontal,
  MoreHorizontal,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
} from "lucide-react"

import { BlockHeader } from "@/components/blocks/header"
import { BlockHeaderOverlay } from "@/components/blocks/header-overlay"
import { BlockHero } from "@/components/blocks/hero"
import { BlockHeroSlider } from "@/components/blocks/hero-slider"
import { BlockGoals } from "@/components/blocks/goals"
import { BlockGallery } from "@/components/blocks/gallery"
import { BlockOverview } from "@/components/blocks/overview"
import { BlockFeatures } from "@/components/blocks/features"
import { BlockServicesCards } from "@/components/blocks/services-cards"
import { BlockHowItWorks } from "@/components/blocks/how-it-works"
import { BlockCreatorBio } from "@/components/blocks/creator-bio"
import { BlockArtistsGrid } from "@/components/blocks/artists-grid"
import { BlockStatsCounter } from "@/components/blocks/stats-counter"
import { BlockTestimonials } from "@/components/blocks/testimonials"
import { BlockLatestNews } from "@/components/blocks/latest-news"
import { BlockNewsletter } from "@/components/blocks/newsletter"
import { BlockFAQ } from "@/components/blocks/faq"
import { BlockAppointmentForm } from "@/components/blocks/appointment-form"
import { BlockFinalCTA } from "@/components/blocks/final-cta"
import { BlockFooter } from "@/components/blocks/footer"
import { FloatingWhatsAppButton } from "@/components/studio/floating-whatsapp"

import { DEFAULT_BLOCK_DATA } from "@/lib/studio/default-page-config"
import type { AppointmentFormData, Block, BlockType, Studio } from "@/lib/types"

import { LayersList } from "./layers-list"
import { PropertyPanelContainer as PropertyPanel } from "./property-panel-container"

type PreviewDevice = "mobile" | "tablet" | "desktop"

const PREVIEW_DEVICE_WIDTH: Record<PreviewDevice, number | null> = {
  mobile: 375,
  tablet: 768,
  desktop: null,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BLOCK_COMPONENTS: Record<BlockType, React.ComponentType<{ data: any }>> = {
  Header: BlockHeader,
  HeaderOverlay: BlockHeaderOverlay,
  Hero: BlockHero,
  HeroSlider: BlockHeroSlider,
  Goals: BlockGoals,
  Gallery: BlockGallery,
  Overview: BlockOverview,
  Features: BlockFeatures,
  ServicesCards: BlockServicesCards,
  HowItWorks: BlockHowItWorks,
  CreatorBio: BlockCreatorBio,
  ArtistsGrid: BlockArtistsGrid,
  StatsCounter: BlockStatsCounter,
  Testimonials: BlockTestimonials,
  LatestNews: BlockLatestNews,
  Newsletter: BlockNewsletter,
  FAQ: BlockFAQ,
  AppointmentForm: BlockAppointmentForm,
  FinalCTA: BlockFinalCTA,
  Footer: BlockFooter,
}

const AVAILABLE_BLOCKS: { type: BlockType; name: string; desc: string }[] = [
  { type: 'HeaderOverlay', name: 'Header Overlay', desc: 'Nav transparan + logo center' },
  { type: 'Header', name: 'Header/Nav', desc: 'Navigasi atas standar' },
  { type: 'HeroSlider', name: 'Hero Slider', desc: 'Slider hero full-bleed' },
  { type: 'Hero', name: 'Hero Section', desc: 'Bagian utama statis' },
  { type: 'Goals', name: 'About Us', desc: 'About + video play button' },
  { type: 'Gallery', name: 'Gallery', desc: 'Grid foto portfolio 3 kolom' },
  { type: 'ArtistsGrid', name: 'Artists Grid', desc: 'Grid tim artist' },
  { type: 'ServicesCards', name: 'Services Cards', desc: 'Kartu layanan 3 kolom' },
  { type: 'StatsCounter', name: 'Stats Counter', desc: 'Angka pencapaian' },
  { type: 'Overview', name: 'Overview', desc: 'Deskripsi dan foto' },
  { type: 'Features', name: 'Features', desc: 'Grid gaya tattoo' },
  { type: 'HowItWorks', name: 'How It Works', desc: 'Langkah kerja' },
  { type: 'CreatorBio', name: 'Creator Bio', desc: 'Profil artist tunggal' },
  { type: 'Testimonials', name: 'Testimonials', desc: 'Review klien dgn quote' },
  { type: 'LatestNews', name: 'Latest News', desc: 'Grid artikel/blog' },
  { type: 'Newsletter', name: 'Newsletter', desc: 'Form subscribe email' },
  { type: 'FAQ', name: 'FAQ', desc: 'Tanya jawab' },
  { type: 'AppointmentForm', name: 'Appointment Form', desc: 'Form konsultasi + peta lokasi (opsional)' },
  { type: 'FinalCTA', name: 'Final CTA', desc: 'Tombol kontak akhir' },
  { type: 'Footer', name: 'Footer', desc: 'Bagian bawah' },
]

interface BuilderUIProps {
  studioId: string
  initialStudio: Studio
}

export function BuilderUI({ studioId, initialStudio }: BuilderUIProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialStudio.blocks)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(initialStudio.blocks[0]?.id ?? null)
  const [slug, setSlug] = useState(initialStudio.slug)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const activeBlock = blocks.find(b => b.id === activeBlockId)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setBlocks((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  const addBlock = useCallback((type: BlockType) => {
    const newBlock: Block = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      data: structuredClone(DEFAULT_BLOCK_DATA[type]),
      visible: true,
    }
    setBlocks(prev => [...prev, newBlock])
    setActiveBlockId(newBlock.id)
  }, [])

  const updateActiveBlockData = (key: string, value: unknown) => {
    setBlocks(blocks.map(b => {
      if (b.id === activeBlockId) {
        return { ...b, data: { ...b.data, [key]: value } }
      }
      return b
    }))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id))
    if (activeBlockId === id) setActiveBlockId(null)
  }

  const toggleBlockVisibility = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, visible: !b.visible } : b))
  }

  const handleDiscard = () => {
    setBlocks(initialStudio.blocks)
    setActiveBlockId(initialStudio.blocks[0]?.id ?? null)
    setSlug(initialStudio.slug)
    setSaveError(null)
  }

  const saveConfig = async (options?: { showSavingState?: boolean }) => {
    if (options?.showSavingState !== false) {
      setIsSaving(true)
    }
    setSaveError(null)

    const res = await fetch(`/api/studios/${studioId}/config`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks, slug }),
    })

    if (options?.showSavingState !== false) {
      setIsSaving(false)
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setSaveError(data.error ?? "Gagal menyimpan perubahan.")
      return false
    }

    return true
  }

  const handleSaveDraft = async () => {
    const toastId = toast.loading("Menyimpan draft...")
    const success = await saveConfig()
    toast.dismiss(toastId)
    if (success) {
      toast.success("Draft berhasil disimpan!")
    } else {
      toast.error("Gagal menyimpan draft.")
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    setSaveError(null)
    const toastId = toast.loading("Mempublikasikan halaman...")

    const saved = await saveConfig({ showSavingState: false })
    if (!saved) {
      setIsPublishing(false)
      toast.dismiss(toastId)
      toast.error("Gagal menyimpan perubahan sebelum publikasi.")
      return
    }

    const res = await fetch(`/api/studios/${studioId}/publish`, {
      method: "POST",
    })

    setIsPublishing(false)
    toast.dismiss(toastId)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setSaveError(data.error ?? "Gagal mempublikasikan halaman.")
      toast.error(data.error ?? "Gagal mempublikasikan halaman.")
      return
    }

    toast.success("Halaman berhasil dipublikasikan!")
    setPublishSuccess(true)
    setTimeout(() => {
      setPublishSuccess(false)
      setPublishDialogOpen(false)
    }, 1500)
  }

  const publishUrl = studioPublicPath(slug)
  const [showMobileLeft, setShowMobileLeft] = useState(false)
  const [showMobileRight, setShowMobileRight] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop")

  const previewWidth = PREVIEW_DEVICE_WIDTH[previewDevice]
  const previewStyle: CSSProperties | undefined = previewWidth
    ? { width: previewWidth, maxWidth: "100%" }
    : undefined

  const selectBlock = (id: string) => {
    setActiveBlockId(id)
    setShowMobileLeft(false)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-950">
      {/* Toolbar — full width, always visible above panels */}
      <div className="sticky top-0 z-30 flex shrink-0 flex-col gap-2 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur px-2 py-2 md:h-auto md:flex-row md:items-center md:justify-between md:gap-2 md:px-4 lg:h-12 lg:py-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground md:gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setShowMobileLeft(true)}>
              <Layers className="w-4 h-4" />
            </Button>
            <Eye className="hidden h-4 w-4 md:block" />
            <span className="hidden sm:inline">Preview</span>
            <Badge variant="outline" className="hidden border-border text-[10px] sm:inline-flex">Mode: OWNER</Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setShowMobileRight(true)}>
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div
          className="flex items-center gap-1 rounded-md border border-border bg-muted/30 p-0.5"
          role="group"
          aria-label="Ukuran preview"
        >
          {(
            [
              { id: "mobile" as const, label: "Mobile", icon: Smartphone },
              { id: "tablet" as const, label: "Tablet", icon: Tablet },
              { id: "desktop" as const, label: "Desktop", icon: Monitor },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              type="button"
              variant={previewDevice === id ? "default" : "ghost"}
              size="sm"
              className="h-7 gap-1 px-2 text-[10px] max-sm:px-1.5"
              onClick={() => setPreviewDevice(id)}
              title={`${label}${PREVIEW_DEVICE_WIDTH[id] ? ` (${PREVIEW_DEVICE_WIDTH[id]}px)` : ""}`}
            >
              <Icon className="size-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>

        <div className="flex w-full items-center gap-2 text-xs text-muted-foreground md:hidden">
          <Link2 className="h-3.5 w-3.5 shrink-0" />
          <span className="shrink-0">{STUDIO_URL_DISPLAY_PREFIX}</span>
          <Input
            className="h-7 min-w-0 flex-1 px-2 text-xs"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="slug"
          />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link2 className="h-3.5 w-3.5" />
            <span>{STUDIO_URL_DISPLAY_PREFIX}</span>
            <Input
              className="h-7 w-32 px-2 text-xs"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="slug"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-3">
          {saveError && (
            <span className="hidden max-w-40 truncate text-xs text-destructive md:inline">{saveError}</span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-xs max-sm:px-2"
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing}
          >
            <Save className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">{isSaving ? "Menyimpan..." : "Simpan"}</span>
          </Button>

          <AlertDialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
            <AlertDialogTrigger
              render={
                <Button variant="outline" size="sm" className="hidden text-xs sm:inline-flex">
                  Discard
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Buang Perubahan?</AlertDialogTitle>
                <AlertDialogDescription>
                  Semua perubahan yang belum disimpan akan hilang. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white" onClick={handleDiscard}>
                  Ya, Buang
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon" className="h-8 w-8 sm:hidden">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDiscardDialogOpen(true)}>
                Discard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
            <Button size="sm" className="flex items-center gap-2 text-xs max-sm:px-2" onClick={() => setPublishDialogOpen(true)}>
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save & Publish</span>
            </Button>
            <DialogContent>
              {publishSuccess ? (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-500" />
                  </div>
                  <P className="text-sm font-semibold text-center">Berhasil dipublikasikan!</P>
                  <P className="text-xs text-muted-foreground text-center">{publishUrl}</P>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Publikasikan Landing Page?</DialogTitle>
                    <DialogDescription>
                      Landing page Anda akan aktif dan dapat diakses publik.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="rounded-md bg-muted/50 border border-border p-3 text-xs text-muted-foreground flex items-center gap-2">
                    <Link2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{publishUrl}</span>
                  </div>
                  <DialogFooter>
                    <DialogClose render={<Button variant="outline">Batal</Button>} />
                    {saveError && (
                      <p className="text-sm text-destructive">{saveError}</p>
                    )}
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={handlePublish}
                      disabled={isPublishing || isSaving}
                    >
                      {isPublishing ? "Mempublikasikan..." : "Publikasikan"}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {saveError ? (
        <div className="shrink-0 border-b border-destructive/20 bg-destructive/5 px-3 py-1.5 md:hidden">
          <p className="truncate text-xs text-destructive">{saveError}</p>
        </div>
      ) : null}

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
      {/* Tablet/mobile overlay panels — scoped below toolbar */}
      {showMobileLeft && (
        <div className="absolute inset-0 z-40 bg-black/60 md:hidden" onClick={() => setShowMobileLeft(false)} />
      )}
      {showMobileRight && (
        <div className="absolute inset-0 z-40 bg-black/60 md:hidden" onClick={() => setShowMobileRight(false)} />
      )}

      {/* Sidebar: Layer & Components */}
      <div className={cn(
        "flex min-h-0 w-64 shrink-0 flex-col overflow-hidden border-r border-zinc-900 bg-zinc-950/90 backdrop-blur-md",
        "max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-[min(100vw-2rem,20rem)] max-md:transition-transform max-md:duration-300",
        showMobileLeft ? "max-md:translate-x-0" : "max-md:-translate-x-full"
      )}>
        <Tabs defaultValue="layers" className="flex min-h-0 w-full flex-1 flex-col">
          <TabsList className="w-full rounded-none border-b border-border h-12 bg-transparent p-0">
            <TabsTrigger value="layers" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Layers</TabsTrigger>
            <TabsTrigger value="add" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Add Block</TabsTrigger>
          </TabsList>

          <TabsContent value="layers" className="m-0 min-h-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full min-h-0 p-4">
              <LayersList
                blocks={blocks}
                activeBlockId={activeBlockId}
                onSelect={selectBlock}
                onDelete={deleteBlock}
                onToggleVisibility={toggleBlockVisibility}
                onDragEnd={handleDragEnd}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="add" className="m-0 min-h-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full min-h-0 p-4">
              <div className="flex flex-col gap-2">
                {AVAILABLE_BLOCKS.map(block => (
                  <div key={block.type} className="bg-card border border-border p-2.5 rounded-md hover:border-foreground/30 transition-colors cursor-pointer group flex items-center justify-between" onClick={() => addBlock(block.type)}>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{block.name}</div>
                      <div className="text-xs text-muted-foreground">{block.desc}</div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-primary">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas (Live Preview) — Static Preview Panel */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#09090b]">
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div
            className={cn(
              "mx-auto w-full",
              previewDevice !== "desktop" && "flex justify-center p-6 md:p-10"
            )}
          >
            <div
              style={previewStyle}
              className={cn(
                "builder-preview studio-template relative bg-black font-body text-white w-full shadow-lg border border-zinc-900/60",
                previewDevice !== "desktop" ? "shrink-0 rounded-md overflow-hidden" : ""
              )}
            >
              {blocks.filter(b => b.visible).length === 0 && (
                <div className="flex min-h-[24rem] items-center justify-center text-muted-foreground/30 bg-black">
                  <div className="text-center p-6">
                    <H2 className="font-sans tracking-tight text-zinc-600">Preview Kosong</H2>
                    <P className="text-zinc-700 text-xs font-sans">Tambahkan blok dari panel kiri untuk mulai mendesain</P>
                  </div>
                </div>
              )}
              {blocks.map(b => {
                if (!b.visible) return null
                return (
                  <div
                    key={b.id}
                    className={cn(
                      "relative cursor-pointer transition-all",
                      activeBlockId === b.id && "ring-2 ring-primary ring-inset"
                    )}
                    onClick={() => selectBlock(b.id)}
                  >
                    {b.type === "AppointmentForm" ? (
                      <BlockAppointmentForm
                        data={b.data as AppointmentFormData}
                        studioName={initialStudio.name}
                      />
                    ) : (
                      (() => {
                        const Component = BLOCK_COMPONENTS[b.type]
                        if (!Component) return null
                        const usesWaNumber =
                          b.type === "Hero" ||
                          b.type === "HeroSlider" ||
                          b.type === "FinalCTA"
                        return (
                          <Component
                            data={b.data}
                            {...(usesWaNumber
                              ? { waNumber: initialStudio.waNumber }
                              : {})}
                          />
                        )
                      })()
                    )}
                  </div>
                )
              })}
              <FloatingWhatsAppButton
                waNumber={initialStudio.waNumber}
                position="absolute"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className={cn(
        "flex min-h-0 w-72 shrink-0 flex-col overflow-hidden border-l border-zinc-900 bg-zinc-950/90 backdrop-blur-md",
        "max-md:absolute max-md:inset-y-0 max-md:right-0 max-md:z-50 max-md:w-[min(100vw-2rem,20rem)] max-md:transition-transform max-md:duration-300",
        showMobileRight ? "max-md:translate-x-0" : "max-md:translate-x-full"
      )}>
        <div className="flex h-12 shrink-0 items-center border-b border-border px-4 text-sm font-semibold tracking-wide text-foreground">
          Properties
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="p-4 pb-6">
            {activeBlock ? (
              <div className="flex flex-col gap-4 rounded-md border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between border-b border-border pb-4">
                  <Badge variant="default" className="rounded-md bg-primary text-primary-foreground hover:bg-primary">{activeBlock.type}</Badge>
                  <Small className="font-mono text-[10px] text-muted-foreground">{activeBlock.id}</Small>
                </div>
                <PropertyPanel block={activeBlock} onChange={updateActiveBlockData} />
              </div>
            ) : (
              <div className="flex min-h-[12rem] flex-col items-center justify-center p-4 text-center text-muted-foreground">
                <MousePointerClick className="mb-4 h-8 w-8 opacity-20" />
                <P className="text-sm">Pilih blok di panel Layers atau Canvas untuk mengedit propertinya.</P>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      </div>
    </div>
  )
}
