"use client"

import { useCallback, useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from "@/lib/utils"
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
import { GripVertical, Plus, Trash2, Eye, Save, MousePointerClick, Check, Link2, Layers, SlidersHorizontal } from "lucide-react"

import { BlockHeader } from "@/components/blocks/header"
import { BlockHero } from "@/components/blocks/hero"
import { BlockGoals } from "@/components/blocks/goals"
import { BlockOverview } from "@/components/blocks/overview"
import { BlockFeatures } from "@/components/blocks/features"
import { BlockHowItWorks } from "@/components/blocks/how-it-works"
import { BlockCreatorBio } from "@/components/blocks/creator-bio"
import { BlockTestimonials } from "@/components/blocks/testimonials"
import { BlockFAQ } from "@/components/blocks/faq"
import { BlockFinalCTA } from "@/components/blocks/final-cta"
import { BlockFooter } from "@/components/blocks/footer"

import type { Block, BlockType, BlockData } from "@/lib/types"
import { CURRENT_STUDIO } from "@/lib/mock-data"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BLOCK_COMPONENTS: Record<BlockType, React.ComponentType<{ data: any }>> = {
  Header: BlockHeader,
  Hero: BlockHero,
  Goals: BlockGoals,
  Overview: BlockOverview,
  Features: BlockFeatures,
  HowItWorks: BlockHowItWorks,
  CreatorBio: BlockCreatorBio,
  Testimonials: BlockTestimonials,
  FAQ: BlockFAQ,
  FinalCTA: BlockFinalCTA,
  Footer: BlockFooter,
}

const AVAILABLE_BLOCKS: { type: BlockType; name: string; desc: string }[] = [
  { type: 'Header', name: 'Header/Nav', desc: 'Navigasi atas' },
  { type: 'Hero', name: 'Hero Section', desc: 'Bagian utama' },
  { type: 'Goals', name: 'Goals', desc: 'Keunggulan studio' },
  { type: 'Overview', name: 'Overview', desc: 'Deskripsi dan foto' },
  { type: 'Features', name: 'Features', desc: 'Grid layanan' },
  { type: 'HowItWorks', name: 'How It Works', desc: 'Langkah kerja' },
  { type: 'CreatorBio', name: 'Creator Bio', desc: 'Profil artist' },
  { type: 'Testimonials', name: 'Testimonials', desc: 'Review klien' },
  { type: 'FAQ', name: 'FAQ', desc: 'Tanya jawab' },
  { type: 'FinalCTA', name: 'Final CTA', desc: 'Tombol kontak akhir' },
  { type: 'Footer', name: 'Footer', desc: 'Bagian bawah' },
]

const DEFAULT_BLOCK_DATA: Record<BlockType, BlockData> = {
  Header: { title: 'Studio Name', ctaText: 'Book Now' },
  Hero: { headline: 'Headline Utama', subheadline: 'Subheadline deskripsi.', ctaText: 'Hubungi Kami' },
  Goals: { headline: 'Mengapa Memilih Kami?', description: 'Deskripsi keunggulan.', features: [{ title: 'Fitur 1', desc: 'Deskripsi fitur.' }] },
  Overview: { headline: 'Overview Studio', content1: 'Konten paragraf pertama.', content2: 'Konten paragraf kedua.' },
  Features: { title: 'Layanan Kami', items: [{ title: 'Layanan 1', desc: 'Deskripsi layanan.' }] },
  HowItWorks: { steps: [{ title: 'Langkah 1', desc: 'Deskripsi langkah.' }] },
  CreatorBio: { name: 'Nama Artist', role: 'Lead Artist', bio: 'Bio singkat.' },
  Testimonials: { reviews: [{ text: 'Review positif.', name: 'Klien', type: 'First Tattoo' }] },
  FAQ: { faqs: [{ q: 'Pertanyaan?', a: 'Jawaban.' }] },
  FinalCTA: { headline: 'Siap Mulai?', subheadline: 'Hubungi kami sekarang.', ctaText: 'Booking via WA' },
  Footer: { title: 'Studio Name', address: 'Alamat Studio' },
}

function SortableItem({ id, type, isActive, visible, onSelect, onDelete, onToggleVisibility }: {
  id: string
  type: BlockType
  isActive: boolean
  visible: boolean
  onSelect: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={cn(
      "flex items-center gap-2 mb-2 p-2 border transition-colors",
      isActive ? 'border-foreground/40 bg-muted/50' : 'border-foreground/10',
      !visible && 'opacity-40',
      'hover:border-foreground/30'
    )}>
      <div {...attributes} {...listeners} className="cursor-grab p-1 text-muted-foreground hover:text-foreground">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="flex-1 cursor-pointer" onClick={onSelect}>
        <div className="font-semibold text-sm">{type}</div>
        <div className="text-xs text-muted-foreground">ID: {id}</div>
      </div>
      <Switch
        size="sm"
        checked={visible}
        onCheckedChange={onToggleVisibility}
      />
      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

// --- Property Panels ---

const inputClass = "rounded-xl bg-zinc-900 border-white/10 focus-visible:ring-primary"
const textareaClass = "rounded-xl bg-zinc-900 border-white/10 focus-visible:ring-primary min-h-[80px]"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-muted-foreground">{children}</label>
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
        <FieldLabel>Headline</FieldLabel>
        <Input className={inputClass} value={(data.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>Deskripsi</FieldLabel>
        <Textarea className={textareaClass} value={(data.description as string) || ''} onChange={(e) => onChange('description', e.target.value)} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Fitur ({features.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('features', [...features, { title: '', desc: '' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {features.map((f, i) => (
          <div key={i} className="p-3 border border-white/10 rounded-xl bg-zinc-900/50 flex flex-col gap-2">
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
          <div key={i} className="p-3 border border-white/10 rounded-xl bg-zinc-900/50 flex flex-col gap-2">
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
        <div key={i} className="p-3 border border-white/10 rounded-xl bg-zinc-900/50 flex flex-col gap-2">
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
      <div className="flex items-center justify-between">
        <FieldLabel>Reviews ({reviews.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('reviews', [...reviews, { text: '', name: '', type: '' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {reviews.map((review, i) => (
        <div key={i} className="p-3 border border-white/10 rounded-xl bg-zinc-900/50 flex flex-col gap-2">
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
        <div key={i} className="p-3 border border-white/10 rounded-xl bg-zinc-900/50 flex flex-col gap-2">
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
    </>
  )
}

function PropertyPanel({ block, onChange }: { block: Block; onChange: (key: string, value: unknown) => void }) {
  const data = block.data as Record<string, unknown>

  switch (block.type) {
    case 'Header': return <HeaderPanel data={data} onChange={onChange} />
    case 'Hero': return <HeroPanel data={data} onChange={onChange} />
    case 'Goals': return <GoalsPanel data={data} onChange={onChange} />
    case 'Overview': return <OverviewPanel data={data} onChange={onChange} />
    case 'Features': return <FeaturesPanel data={data} onChange={onChange} />
    case 'HowItWorks': return <HowItWorksPanel data={data} onChange={onChange} />
    case 'CreatorBio': return <CreatorBioPanel data={data} onChange={onChange} />
    case 'Testimonials': return <TestimonialsPanel data={data} onChange={onChange} />
    case 'FAQ': return <FAQPanel data={data} onChange={onChange} />
    case 'FinalCTA': return <FinalCTAPanel data={data} onChange={onChange} />
    case 'Footer': return <FooterPanel data={data} onChange={onChange} />
    default: return null
  }
}

// --- Main Builder UI ---

export function BuilderUI() {
  const [blocks, setBlocks] = useState<Block[]>(CURRENT_STUDIO.blocks)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(CURRENT_STUDIO.blocks[0]?.id ?? null)
  const [slug, setSlug] = useState(CURRENT_STUDIO.slug)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  const activeBlock = blocks.find(b => b.id === activeBlockId)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addBlock = useCallback((type: BlockType) => {
    const newBlock: Block = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      data: DEFAULT_BLOCK_DATA[type],
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
    setBlocks(CURRENT_STUDIO.blocks)
    setActiveBlockId(CURRENT_STUDIO.blocks[0]?.id ?? null)
    setSlug(CURRENT_STUDIO.slug)
  }

  const handlePublish = () => {
    setPublishSuccess(true)
    setTimeout(() => {
      setPublishSuccess(false)
      setPublishDialogOpen(false)
    }, 1500)
  }

  const publishUrl = `ruangtato.com/app/studio/${slug}`
  const [showMobileLeft, setShowMobileLeft] = useState(false)
  const [showMobileRight, setShowMobileRight] = useState(false)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-zinc-950 relative">
      {/* Mobile overlay panels */}
      {showMobileLeft && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={() => setShowMobileLeft(false)} />
      )}
      {showMobileRight && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={() => setShowMobileRight(false)} />
      )}

      {/* Sidebar: Layer & Components */}
      <div className={cn(
        "w-64 border-r border-white/5 bg-background flex flex-col shrink-0",
        "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:transition-transform max-md:duration-300",
        showMobileLeft ? "max-md:translate-x-0" : "max-md:-translate-x-full"
      )}>
        <Tabs defaultValue="layers" className="w-full flex-1 flex flex-col">
          <TabsList className="w-full rounded-none border-b border-white/5 h-12 bg-transparent p-0">
            <TabsTrigger value="layers" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Layers</TabsTrigger>
            <TabsTrigger value="add" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Add Block</TabsTrigger>
          </TabsList>

          <TabsContent value="layers" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full p-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map((block) => (
                    <SortableItem
                      key={block.id}
                      id={block.id}
                      type={block.type}
                      isActive={activeBlockId === block.id}
                      visible={block.visible}
                      onSelect={() => setActiveBlockId(block.id)}
                      onDelete={() => deleteBlock(block.id)}
                      onToggleVisibility={() => toggleBlockVisibility(block.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="add" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full p-4">
              <div className="flex flex-col gap-2">
                {AVAILABLE_BLOCKS.map(block => (
                  <div key={block.type} className="bg-white/5 border border-white/10 p-3 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group flex items-center justify-between" onClick={() => addBlock(block.type)}>
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

      {/* Main Canvas (Live Preview) */}
      <div className="flex-1 bg-zinc-950 flex flex-col">
        <div className="h-12 border-b border-white/5 bg-background flex items-center px-2 md:px-4 justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 text-sm text-muted-foreground font-medium">
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setShowMobileLeft(true)}>
              <Layers className="w-4 h-4" />
            </Button>
            <Eye className="w-4 h-4 hidden md:block" />
            <span className="hidden sm:inline">Preview</span>
            <Badge variant="outline" className="text-[10px] border-white/10 hidden sm:inline-flex">Mode: OWNER</Badge>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">ruangtato.com/app/studio/</span>
              <Input
                className="h-7 w-28 rounded-lg bg-zinc-900 border-white/10 text-xs px-2 focus-visible:ring-primary"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="slug"
              />
            </div>
          </div>
          <div className="flex gap-2 md:gap-3 items-center">
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setShowMobileRight(true)}>
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger render={
                <Button variant="outline" size="sm" className="rounded-full border-white/10 text-xs hover:bg-white/5">Discard</Button>
              } />
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

            <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
              <Button size="sm" className="rounded-full text-xs flex items-center gap-2 bg-primary hover:bg-primary/90 text-white" onClick={() => setPublishDialogOpen(true)}>
                <Save className="w-4 h-4" /> Save & Publish
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
                    <div className="rounded-xl bg-zinc-900 border border-white/10 p-3 text-xs text-muted-foreground flex items-center gap-2">
                      <Link2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{publishUrl}</span>
                    </div>
                    <DialogFooter>
                      <DialogClose render={<Button variant="outline">Batal</Button>} />
                      <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handlePublish}>
                        Publikasikan
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Live Preview Canvas */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto bg-background min-h-[600px] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
            {blocks.filter(b => b.visible).length === 0 && (
              <div className="flex items-center justify-center h-[600px] text-muted-foreground/30">
                <div className="text-center">
                  <H2 className="font-sans tracking-tight">Preview Kosong</H2>
                  <P>Tambahkan blok dari panel kiri</P>
                </div>
              </div>
            )}
            {blocks.map(b => {
              if (!b.visible) return null
              const Component = BLOCK_COMPONENTS[b.type]
              if (!Component) return null
              return (
                <div
                  key={b.id}
                  className={cn(
                    "relative cursor-pointer transition-all",
                    activeBlockId === b.id && "ring-2 ring-primary ring-inset"
                  )}
                  onClick={() => setActiveBlockId(b.id)}
                >
                  <Component data={b.data} />
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Properties Panel */}
      <div className={cn(
        "w-72 border-l border-white/5 bg-background flex flex-col shrink-0",
        "max-md:fixed max-md:inset-y-0 max-md:right-0 max-md:z-50 max-md:transition-transform max-md:duration-300",
        showMobileRight ? "max-md:translate-x-0" : "max-md:translate-x-full"
      )}>
        <div className="h-12 border-b border-white/5 flex items-center px-4 font-semibold text-sm tracking-wide text-foreground">
          Properties
        </div>
        <ScrollArea className="flex-1 p-4">
          {activeBlock ? (
            <div className="flex flex-col gap-4 border border-white/10 rounded-2xl p-4 bg-white/5">
              <div className="flex items-center justify-between mb-2 pb-4 border-b border-white/10">
                <Badge variant="default" className="rounded-full bg-primary text-primary-foreground hover:bg-primary">{activeBlock.type}</Badge>
                <Small className="font-mono text-[10px] text-muted-foreground">{activeBlock.id}</Small>
              </div>
              <PropertyPanel block={activeBlock} onChange={updateActiveBlockData} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
              <MousePointerClick className="w-8 h-8 mb-4 opacity-20" />
              <P className="text-sm">Pilih blok di panel Layers atau Canvas untuk mengedit propertinya.</P>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
