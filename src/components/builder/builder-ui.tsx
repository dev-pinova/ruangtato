"use client"

import { useCallback, useEffect, useState, type CSSProperties } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from "@/lib/utils"
import { STUDIO_URL_DISPLAY_PREFIX, studioPublicPath } from "@/lib/site"
import { H2, P, Small } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
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

import { DEFAULT_BLOCK_DATA } from "@/lib/default-page-config"
import type { AppointmentFormData, Block, BlockType, Studio } from "@/lib/types"

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

function LayerRow({
  type,
  isActive,
  visible,
  onSelect,
  onDelete,
  onToggleVisibility,
  setNodeRef,
  style,
  dragHandleProps,
}: {
  type: BlockType
  isActive: boolean
  visible: boolean
  onSelect: () => void
  onDelete: () => void
  onToggleVisibility: () => void
  setNodeRef?: (node: HTMLElement | null) => void
  style?: CSSProperties
  dragHandleProps?: {
    attributes: ReturnType<typeof useSortable>["attributes"]
    listeners: ReturnType<typeof useSortable>["listeners"]
  } | null
}) {
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/builder-item mb-1 flex items-center gap-1.5 rounded-md border px-2 py-1.5 transition-colors",
        isActive ? "border-primary/40 bg-primary/5" : "border-transparent",
        !visible && "opacity-50",
        "hover:bg-muted/60"
      )}
    >
      {dragHandleProps ? (
        <div
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
          className="cursor-grab p-1 text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="size-3.5" />
        </div>
      ) : (
        <div className="p-1 text-muted-foreground" aria-hidden>
          <GripVertical className="size-3.5" />
        </div>
      )}
      <div className="min-w-0 flex-1 cursor-pointer" onClick={onSelect}>
        <div className="truncate text-sm font-medium">{type}</div>
      </div>
      <Switch size="sm" checked={visible} onCheckedChange={onToggleVisibility} />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover/builder-item:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}

function SortableLayerItem({
  id,
  type,
  isActive,
  visible,
  onSelect,
  onDelete,
  onToggleVisibility,
}: {
  id: string
  type: BlockType
  isActive: boolean
  visible: boolean
  onSelect: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  return (
    <LayerRow
      type={type}
      isActive={isActive}
      visible={visible}
      onSelect={onSelect}
      onDelete={onDelete}
      onToggleVisibility={onToggleVisibility}
      setNodeRef={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      dragHandleProps={{ attributes, listeners }}
    />
  )
}

function LayersList({
  blocks,
  activeBlockId,
  onSelect,
  onDelete,
  onToggleVisibility,
  onDragEnd,
}: {
  blocks: Block[]
  activeBlockId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggleVisibility: (id: string) => void
  onDragEnd: (event: DragEndEvent) => void
}) {
  const [dndReady, setDndReady] = useState(false)

  useEffect(() => {
    setDndReady(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (!dndReady) {
    return (
      <>
        {blocks.map((block) => (
          <LayerRow
            key={block.id}
            type={block.type}
            isActive={activeBlockId === block.id}
            visible={block.visible}
            onSelect={() => onSelect(block.id)}
            onDelete={() => onDelete(block.id)}
            onToggleVisibility={() => onToggleVisibility(block.id)}
            dragHandleProps={null}
          />
        ))}
      </>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        {blocks.map((block) => (
          <SortableLayerItem
            key={block.id}
            id={block.id}
            type={block.type}
            isActive={activeBlockId === block.id}
            visible={block.visible}
            onSelect={() => onSelect(block.id)}
            onDelete={() => onDelete(block.id)}
            onToggleVisibility={() => onToggleVisibility(block.id)}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}

// --- Property Panels ---

const inputClass = ""
const textareaClass = "min-h-[80px]"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-muted-foreground">{children}</label>
}

function HeaderPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Title</FieldLabel>
        <Input className={inputClass} value={(data.title as string) || ''} onChange={(e) => onChange('title', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>CTA Text</FieldLabel>
        <Input className={inputClass} value={(data.ctaText as string) || ''} onChange={(e) => onChange('ctaText', e.target.value)} />
      </div>
    </>
  )
}

function HeroPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input className={inputClass} value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Subheadline</FieldLabel>
        <Textarea className={textareaClass} value={(data.subheadline as string) || ''} onChange={(e) => onChange('subheadline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>CTA Text</FieldLabel>
        <Input className={inputClass} value={(data.ctaText as string) || ''} onChange={(e) => onChange('ctaText', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Image URL</FieldLabel>
        <Input className={inputClass} value={(data.image as string) || ''} onChange={(e) => onChange('image', e.target.value)} />
      </div>
    </>
  )
}

function GoalsPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const features = (data.features as { title: string; desc: string }[]) || []
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Eyebrow (label kecil)</FieldLabel>
        <Input className={inputClass} value={(data.eyebrow as string) || ''} onChange={(e) => onChange('eyebrow', e.target.value)} placeholder="About Us" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input className={inputClass} value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Deskripsi</FieldLabel>
        <Textarea className={textareaClass} value={(data.description as string) || ''} onChange={(e) => onChange('description', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Image URL</FieldLabel>
        <Input className={inputClass} value={(data.image as string) || ''} onChange={(e) => onChange('image', e.target.value)} placeholder="https://..." />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Video URL (embed)</FieldLabel>
        <Input className={inputClass} value={(data.videoUrl as string) || ''} onChange={(e) => onChange('videoUrl', e.target.value)} placeholder="https://www.youtube.com/embed/..." />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Fitur ({features.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('features', [...features, { title: '', desc: '' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {features.map((f, i) => (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('features', features.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <Input className={inputClass} placeholder="Title" value={f.title} onChange={(e) => { const updated = [...features]; updated[i] = { ...updated[i], title: e.target.value }; onChange('features', updated) }} />
            <Textarea className={textareaClass} placeholder="Deskripsi" value={f.desc} onChange={(e) => { const updated = [...features]; updated[i] = { ...updated[i], desc: e.target.value }; onChange('features', updated) }} />
          </div>
        ))}
      </div>
    </>
  )
}

function HeaderOverlayPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const leftLinks = (data.leftLinks as { label: string; href: string }[]) || []
  const rightLinks = (data.rightLinks as { label: string; href: string }[]) || []

  function renderLinks(field: 'leftLinks' | 'rightLinks', items: { label: string; href: string }[]) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <FieldLabel>{field === 'leftLinks' ? 'Link Kiri' : 'Link Kanan'} ({items.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange(field, [...items, { label: '', href: '#' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {items.map((l, i) => (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange(field, items.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <Input placeholder="Label" value={l.label} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], label: e.target.value }; onChange(field, u) }} />
            <Input placeholder="Href (mis. #about)" value={l.href} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], href: e.target.value }; onChange(field, u) }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Logo Text</FieldLabel>
        <Input className={inputClass} value={(data.logoText as string) || ''} onChange={(e) => onChange('logoText', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Tagline (opsional)</FieldLabel>
        <Input className={inputClass} value={(data.tagline as string) || ''} onChange={(e) => onChange('tagline', e.target.value)} placeholder="Tattoo • Piercing • Art" />
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          className="h-3.5 w-3.5"
          checked={data.showCenterLogo !== false}
          onChange={(e) => onChange('showCenterLogo', e.target.checked)}
        />
        Tampilkan logo di tengah
      </label>
      {renderLinks('leftLinks', leftLinks)}
      {renderLinks('rightLinks', rightLinks)}
    </>
  )
}

function LatestNewsPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const articles = (data.articles as { title: string; category: string; date: string; image: string; href: string }[]) || []
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Eyebrow</FieldLabel>
        <Input value={(data.eyebrow as string) || ''} onChange={(e) => onChange('eyebrow', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>CTA Text (opsional)</FieldLabel>
        <Input value={(data.ctaText as string) || ''} onChange={(e) => onChange('ctaText', e.target.value)} placeholder="View All" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>CTA Href</FieldLabel>
        <Input value={(data.ctaHref as string) || ''} onChange={(e) => onChange('ctaHref', e.target.value)} placeholder="#news" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Articles ({articles.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('articles', [...articles, { title: '', category: '', date: '', image: '', href: '#' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {articles.map((a, i) => (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('articles', articles.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <Input placeholder="Title" value={a.title} onChange={(e) => { const u = [...articles]; u[i] = { ...u[i], title: e.target.value }; onChange('articles', u) }} />
            <Input placeholder="Category" value={a.category} onChange={(e) => { const u = [...articles]; u[i] = { ...u[i], category: e.target.value }; onChange('articles', u) }} />
            <Input placeholder="Date" value={a.date} onChange={(e) => { const u = [...articles]; u[i] = { ...u[i], date: e.target.value }; onChange('articles', u) }} />
            <Input placeholder="Image URL" value={a.image} onChange={(e) => { const u = [...articles]; u[i] = { ...u[i], image: e.target.value }; onChange('articles', u) }} />
            <Input placeholder="Href" value={a.href} onChange={(e) => { const u = [...articles]; u[i] = { ...u[i], href: e.target.value }; onChange('articles', u) }} />
          </div>
        ))}
      </div>
    </>
  )
}

function NewsletterPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Eyebrow</FieldLabel>
        <Input value={(data.eyebrow as string) || ''} onChange={(e) => onChange('eyebrow', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Description</FieldLabel>
        <Textarea value={(data.description as string) || ''} onChange={(e) => onChange('description', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Placeholder Email</FieldLabel>
        <Input value={(data.placeholder as string) || ''} onChange={(e) => onChange('placeholder', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>CTA Text</FieldLabel>
        <Input value={(data.ctaText as string) || ''} onChange={(e) => onChange('ctaText', e.target.value)} />
      </div>
    </>
  )
}

function OverviewPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input className={inputClass} value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Konten 1</FieldLabel>
        <Textarea className={textareaClass} value={(data.content1 as string) || ''} onChange={(e) => onChange('content1', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Konten 2</FieldLabel>
        <Textarea className={textareaClass} value={(data.content2 as string) || ''} onChange={(e) => onChange('content2', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Image 1 URL</FieldLabel>
        <Input className={inputClass} value={(data.image1 as string) || ''} onChange={(e) => onChange('image1', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Image 2 URL</FieldLabel>
        <Input className={inputClass} value={(data.image2 as string) || ''} onChange={(e) => onChange('image2', e.target.value)} />
      </div>
    </>
  )
}

function FeaturesPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const items = (data.items as { title: string; desc: string }[]) || []
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Section Title</FieldLabel>
        <Input className={inputClass} value={(data.title as string) || ''} onChange={(e) => onChange('title', e.target.value)} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Items ({items.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('items', [...items, { title: '', desc: '' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {items.map((item, i) => (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('items', items.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <Input className={inputClass} placeholder="Title" value={item.title} onChange={(e) => { const updated = [...items]; updated[i] = { ...updated[i], title: e.target.value }; onChange('items', updated) }} />
            <Textarea className={textareaClass} placeholder="Deskripsi" value={item.desc} onChange={(e) => { const updated = [...items]; updated[i] = { ...updated[i], desc: e.target.value }; onChange('items', updated) }} />
          </div>
        ))}
      </div>
    </>
  )
}

function HowItWorksPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const steps = (data.steps as { title: string; desc: string }[]) || []
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <FieldLabel>Steps ({steps.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('steps', [...steps, { title: '', desc: '' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {steps.map((step, i) => (
        <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground">Step #{i + 1}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('steps', steps.filter((_, idx) => idx !== i))}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <Input className={inputClass} placeholder="Title" value={step.title} onChange={(e) => { const updated = [...steps]; updated[i] = { ...updated[i], title: e.target.value }; onChange('steps', updated) }} />
          <Textarea className={textareaClass} placeholder="Deskripsi" value={step.desc} onChange={(e) => { const updated = [...steps]; updated[i] = { ...updated[i], desc: e.target.value }; onChange('steps', updated) }} />
        </div>
      ))}
    </div>
  )
}

function CreatorBioPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Nama</FieldLabel>
        <Input className={inputClass} value={(data.name as string) || ''} onChange={(e) => onChange('name', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Role</FieldLabel>
        <Input className={inputClass} value={(data.role as string) || ''} onChange={(e) => onChange('role', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Bio</FieldLabel>
        <Textarea className={textareaClass} value={(data.bio as string) || ''} onChange={(e) => onChange('bio', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Image URL</FieldLabel>
        <Input className={inputClass} value={(data.image as string) || ''} onChange={(e) => onChange('image', e.target.value)} />
      </div>
    </>
  )
}

function TestimonialsPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const reviews = (data.reviews as { text: string; name: string; type: string }[]) || []
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <FieldLabel>Eyebrow</FieldLabel>
        <Input value={(data.eyebrow as string) || ''} onChange={(e) => onChange('eyebrow', e.target.value)} placeholder="Testimonial" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} placeholder="What Clients Say" />
      </div>
      <div className="flex items-center justify-between">
        <FieldLabel>Reviews ({reviews.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('reviews', [...reviews, { text: '', name: '', type: '' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {reviews.map((review, i) => (
        <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('reviews', reviews.filter((_, idx) => idx !== i))}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <Textarea className={textareaClass} placeholder="Teks review" value={review.text} onChange={(e) => { const updated = [...reviews]; updated[i] = { ...updated[i], text: e.target.value }; onChange('reviews', updated) }} />
          <Input className={inputClass} placeholder="Nama klien" value={review.name} onChange={(e) => { const updated = [...reviews]; updated[i] = { ...updated[i], name: e.target.value }; onChange('reviews', updated) }} />
          <Input className={inputClass} placeholder="Tipe (e.g. First Tattoo)" value={review.type} onChange={(e) => { const updated = [...reviews]; updated[i] = { ...updated[i], type: e.target.value }; onChange('reviews', updated) }} />
        </div>
      ))}
    </div>
  )
}

function FAQPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const faqs = (data.faqs as { q: string; a: string }[]) || []
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <FieldLabel>FAQ Items ({faqs.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('faqs', [...faqs, { q: '', a: '' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {faqs.map((faq, i) => (
        <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground">Q#{i + 1}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('faqs', faqs.filter((_, idx) => idx !== i))}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <Input className={inputClass} placeholder="Pertanyaan" value={faq.q} onChange={(e) => { const updated = [...faqs]; updated[i] = { ...updated[i], q: e.target.value }; onChange('faqs', updated) }} />
          <Textarea className={textareaClass} placeholder="Jawaban" value={faq.a} onChange={(e) => { const updated = [...faqs]; updated[i] = { ...updated[i], a: e.target.value }; onChange('faqs', updated) }} />
        </div>
      ))}
    </div>
  )
}

function FinalCTAPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input className={inputClass} value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Subheadline</FieldLabel>
        <Textarea className={textareaClass} value={(data.subheadline as string) || ''} onChange={(e) => onChange('subheadline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>CTA Text</FieldLabel>
        <Input className={inputClass} value={(data.ctaText as string) || ''} onChange={(e) => onChange('ctaText', e.target.value)} />
      </div>
    </>
  )
}

function FooterPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const newsletterEnabled = data.showNewsletter !== false
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Title</FieldLabel>
        <Input className={inputClass} value={(data.title as string) || ''} onChange={(e) => onChange('title', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Alamat</FieldLabel>
        <Input className={inputClass} value={(data.address as string) || ''} onChange={(e) => onChange('address', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Instagram URL</FieldLabel>
        <Input className={inputClass} value={(data.instagram as string) || ''} onChange={(e) => onChange('instagram', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>WhatsApp</FieldLabel>
        <Input className={inputClass} value={(data.whatsapp as string) || ''} onChange={(e) => onChange('whatsapp', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Email</FieldLabel>
        <Input className={inputClass} value={(data.email as string) || ''} onChange={(e) => onChange('email', e.target.value)} />
      </div>

      <div className="mt-2 border-t border-border pt-3 flex flex-col gap-3">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            className="h-3.5 w-3.5"
            checked={newsletterEnabled}
            onChange={(e) => onChange('showNewsletter', e.target.checked)}
          />
          Tampilkan form newsletter di footer
        </label>
        {newsletterEnabled && (
          <>
            <div className="flex flex-col gap-2">
              <FieldLabel>Newsletter — Eyebrow</FieldLabel>
              <Input className={inputClass} value={(data.newsletterEyebrow as string) || ''} onChange={(e) => onChange('newsletterEyebrow', e.target.value)} placeholder="Newsletter" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel>Newsletter — Headline</FieldLabel>
              <Input className={inputClass} value={(data.newsletterHeadline as string) || ''} onChange={(e) => onChange('newsletterHeadline', e.target.value)} placeholder="Subscribe to our newsletter" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel>Placeholder Email</FieldLabel>
              <Input className={inputClass} value={(data.newsletterPlaceholder as string) || ''} onChange={(e) => onChange('newsletterPlaceholder', e.target.value)} placeholder="Enter your email" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel>CTA Text</FieldLabel>
              <Input className={inputClass} value={(data.newsletterCta as string) || ''} onChange={(e) => onChange('newsletterCta', e.target.value)} placeholder="Subscribe" />
            </div>
          </>
        )}
      </div>
    </>
  )
}

function GalleryPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const images = (data.images as { src: string; alt?: string }[]) || []
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Eyebrow</FieldLabel>
        <Input value={(data.eyebrow as string) || ''} onChange={(e) => onChange('eyebrow', e.target.value)} placeholder="Portfolio" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} placeholder="Our Gallery" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Subheadline (opsional)</FieldLabel>
        <Textarea value={(data.subheadline as string) || ''} onChange={(e) => onChange('subheadline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Images ({images.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('images', [...images, { src: '', alt: '' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {images.map((img, i) => (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('images', images.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <Input placeholder="Image URL" value={img.src} onChange={(e) => { const u = [...images]; u[i] = { ...u[i], src: e.target.value }; onChange('images', u) }} />
            <Input placeholder="Alt text (opsional)" value={img.alt || ''} onChange={(e) => { const u = [...images]; u[i] = { ...u[i], alt: e.target.value }; onChange('images', u) }} />
          </div>
        ))}
      </div>
    </>
  )
}

function HeroSliderPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const slides = (data.slides as { headline: string; subheadline: string; ctaText: string; image: string }[]) || []
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <FieldLabel>Slides ({slides.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('slides', [...slides, { headline: '', subheadline: '', ctaText: '', image: '' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {slides.map((slide, i) => (
        <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
          <Input placeholder="Headline" value={slide.headline} onChange={(e) => { const u = [...slides]; u[i] = { ...u[i], headline: e.target.value }; onChange('slides', u) }} />
          <Textarea placeholder="Subheadline" value={slide.subheadline} onChange={(e) => { const u = [...slides]; u[i] = { ...u[i], subheadline: e.target.value }; onChange('slides', u) }} />
          <Input placeholder="CTA Text" value={slide.ctaText} onChange={(e) => { const u = [...slides]; u[i] = { ...u[i], ctaText: e.target.value }; onChange('slides', u) }} />
          <Input placeholder="Image URL" value={slide.image} onChange={(e) => { const u = [...slides]; u[i] = { ...u[i], image: e.target.value }; onChange('slides', u) }} />
        </div>
      ))}
    </div>
  )
}

function ArtistsGridPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const artists = (data.artists as { name: string; role: string; image: string }[]) || []
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-3">
        <FieldLabel>Artists ({artists.length})</FieldLabel>
        {artists.map((a, i) => (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <Input placeholder="Nama" value={a.name} onChange={(e) => { const u = [...artists]; u[i] = { ...u[i], name: e.target.value }; onChange('artists', u) }} />
            <Input placeholder="Role" value={a.role} onChange={(e) => { const u = [...artists]; u[i] = { ...u[i], role: e.target.value }; onChange('artists', u) }} />
            <Input placeholder="Image URL" value={a.image} onChange={(e) => { const u = [...artists]; u[i] = { ...u[i], image: e.target.value }; onChange('artists', u) }} />
          </div>
        ))}
      </div>
    </>
  )
}

function StatsCounterPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const stats = (data.stats as { value: string; label: string }[]) || []
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      {stats.map((s, i) => (
        <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
          <Input placeholder="Value" value={s.value} onChange={(e) => { const u = [...stats]; u[i] = { ...u[i], value: e.target.value }; onChange('stats', u) }} />
          <Input placeholder="Label" value={s.label} onChange={(e) => { const u = [...stats]; u[i] = { ...u[i], label: e.target.value }; onChange('stats', u) }} />
        </div>
      ))}
    </>
  )
}

function ServicesCardsPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  const cards = (data.cards as { title: string; desc: string; image: string; ctaText?: string; ctaHref?: string }[]) || []
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Eyebrow</FieldLabel>
        <Input value={(data.eyebrow as string) || ''} onChange={(e) => onChange('eyebrow', e.target.value)} placeholder="What We Do" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex items-center justify-between">
        <FieldLabel>Cards ({cards.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('cards', [...cards, { title: '', desc: '', image: '', ctaText: 'Read More', ctaHref: '#' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {cards.map((c, i) => (
        <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('cards', cards.filter((_, idx) => idx !== i))}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <Input placeholder="Title" value={c.title} onChange={(e) => { const u = [...cards]; u[i] = { ...u[i], title: e.target.value }; onChange('cards', u) }} />
          <Textarea placeholder="Deskripsi" value={c.desc} onChange={(e) => { const u = [...cards]; u[i] = { ...u[i], desc: e.target.value }; onChange('cards', u) }} />
          <Input placeholder="Image URL" value={c.image} onChange={(e) => { const u = [...cards]; u[i] = { ...u[i], image: e.target.value }; onChange('cards', u) }} />
          <Input placeholder="CTA Text (mis. Read More)" value={c.ctaText || ''} onChange={(e) => { const u = [...cards]; u[i] = { ...u[i], ctaText: e.target.value }; onChange('cards', u) }} />
          <Input placeholder="CTA Href" value={c.ctaHref || ''} onChange={(e) => { const u = [...cards]; u[i] = { ...u[i], ctaHref: e.target.value }; onChange('cards', u) }} />
        </div>
      ))}
    </>
  )
}

function AppointmentFormPanel({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, value: unknown) => void }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel>Headline</FieldLabel>
        <Input value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Subheadline</FieldLabel>
        <Textarea value={(data.subheadline as string) || ''} onChange={(e) => onChange('subheadline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>CTA Text</FieldLabel>
        <Input value={(data.ctaText as string) || ''} onChange={(e) => onChange('ctaText', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Label Checkbox Usia</FieldLabel>
        <Input value={(data.ageLabel as string) || ''} onChange={(e) => onChange('ageLabel', e.target.value)} placeholder="Are you 18 years old?" />
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          className="h-3.5 w-3.5"
          checked={data.requireAge !== false}
          onChange={(e) => onChange('requireAge', e.target.checked)}
        />
        Wajibkan konfirmasi usia 18+
      </label>

      <div className="my-2 border-t border-border pt-4">
        <p className="mb-3 text-xs font-medium text-foreground">Google Maps</p>
        <label className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            className="h-3.5 w-3.5"
            checked={data.showMap === true}
            onChange={(e) => onChange('showMap', e.target.checked)}
          />
          Tampilkan Google Maps
        </label>
        <div className="flex flex-col gap-2">
          <FieldLabel>URL Embed Google Maps</FieldLabel>
          <Textarea
            value={(data.mapEmbedUrl as string) || ''}
            onChange={(e) => onChange('mapEmbedUrl', e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
            rows={3}
          />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Buka Google Maps → Share → Embed a map → salin URL dari atribut{" "}
            <code className="text-[10px]">src</code> iframe.
          </p>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <FieldLabel>Alamat (opsional)</FieldLabel>
          <Input
            value={(data.mapAddress as string) || ''}
            onChange={(e) => onChange('mapAddress', e.target.value)}
            placeholder="Jl. Contoh No. 1, Jakarta"
          />
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <FieldLabel>Tinggi Peta (px)</FieldLabel>
          <Input
            type="number"
            min={280}
            max={800}
            value={String((data.mapHeight as number) || 420)}
            onChange={(e) => onChange('mapHeight', Number(e.target.value) || 420)}
          />
        </div>
      </div>
    </>
  )
}

function PropertyPanel({ block, onChange }: { block: Block; onChange: (key: string, value: unknown) => void }) {
  const data = block.data as Record<string, unknown>

  switch (block.type) {
    case 'Header': return <HeaderPanel data={data} onChange={onChange} />
    case 'HeaderOverlay': return <HeaderOverlayPanel data={data} onChange={onChange} />
    case 'Hero': return <HeroPanel data={data} onChange={onChange} />
    case 'HeroSlider': return <HeroSliderPanel data={data} onChange={onChange} />
    case 'Goals': return <GoalsPanel data={data} onChange={onChange} />
    case 'Gallery': return <GalleryPanel data={data} onChange={onChange} />
    case 'Overview': return <OverviewPanel data={data} onChange={onChange} />
    case 'Features': return <FeaturesPanel data={data} onChange={onChange} />
    case 'ServicesCards': return <ServicesCardsPanel data={data} onChange={onChange} />
    case 'HowItWorks': return <HowItWorksPanel data={data} onChange={onChange} />
    case 'CreatorBio': return <CreatorBioPanel data={data} onChange={onChange} />
    case 'ArtistsGrid': return <ArtistsGridPanel data={data} onChange={onChange} />
    case 'StatsCounter': return <StatsCounterPanel data={data} onChange={onChange} />
    case 'Testimonials': return <TestimonialsPanel data={data} onChange={onChange} />
    case 'LatestNews': return <LatestNewsPanel data={data} onChange={onChange} />
    case 'Newsletter': return <NewsletterPanel data={data} onChange={onChange} />
    case 'FAQ': return <FAQPanel data={data} onChange={onChange} />
    case 'AppointmentForm': return <AppointmentFormPanel data={data} onChange={onChange} />
    case 'FinalCTA': return <FinalCTAPanel data={data} onChange={onChange} />
    case 'Footer': return <FooterPanel data={data} onChange={onChange} />
    default: return null
  }
}

// --- Main Builder UI ---

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
    await saveConfig()
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    setSaveError(null)

    const saved = await saveConfig({ showSavingState: false })
    if (!saved) {
      setIsPublishing(false)
      return
    }

    const res = await fetch(`/api/studios/${studioId}/publish`, {
      method: "POST",
    })

    setIsPublishing(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setSaveError(data.error ?? "Gagal mempublikasikan halaman.")
      return
    }

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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Toolbar — full width, always visible above panels */}
      <div className="sticky top-0 z-30 flex shrink-0 flex-col gap-2 border-b border-border bg-background px-2 py-2 md:h-auto md:flex-row md:items-center md:justify-between md:gap-2 md:px-4 lg:h-12 lg:py-0">
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
        "flex min-h-0 w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-background",
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

      {/* Main Canvas (Live Preview) — full bleed, no framed box */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/30">
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div
            className={cn(
              "mx-auto w-full",
              previewDevice !== "desktop" && "flex justify-center"
            )}
          >
            <div
              style={previewStyle}
              className={cn(
                "builder-preview studio-template bg-black font-body text-white",
                previewDevice === "desktop" ? "w-full" : "shrink-0"
              )}
            >
              {blocks.filter(b => b.visible).length === 0 && (
                <div className="flex min-h-[24rem] items-center justify-center text-muted-foreground/30">
                  <div className="text-center">
                    <H2 className="font-sans tracking-tight">Preview Kosong</H2>
                    <P>Tambahkan blok dari panel kiri</P>
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
                        return <Component data={b.data} />
                      })()
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className={cn(
        "flex min-h-0 w-72 shrink-0 flex-col overflow-hidden border-l border-border bg-background",
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
