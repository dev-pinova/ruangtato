"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { GripVertical, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import type { Block, BlockType } from "@/lib/types"

const BLOCK_NAMES: Record<BlockType, string> = {
  HeaderOverlay: "Header Overlay",
  Header: "Header / Nav",
  HeroSlider: "Hero Slider",
  Hero: "Hero Section",
  Goals: "Tentang Kami (About)",
  Gallery: "Galeri Portofolio",
  ArtistsGrid: "Daftar Artist",
  ServicesCards: "Layanan Tato",
  StatsCounter: "Angka Pencapaian",
  Overview: "Overview Studio",
  Features: "Gaya Tato (Features)",
  HowItWorks: "Cara Kerja",
  CreatorBio: "Profil Artist",
  Testimonials: "Review Klien",
  LatestNews: "Berita & Artikel",
  Newsletter: "Newsletter",
  FAQ: "Tanya Jawab (FAQ)",
  AppointmentForm: "Form Konsultasi",
  FinalCTA: "CTA Penutup",
  Footer: "Footer",
  LeadForm: "Form Kontak",
}

interface LayerRowProps {
  type: BlockType
  isActive: boolean
  visible: boolean
  onSelect: () => void
  onDelete: () => void
  onToggleVisibility: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  setNodeRef?: (node: HTMLElement | null) => void
  style?: CSSProperties
  dragHandleProps?: {
    attributes: ReturnType<typeof useSortable>["attributes"]
    listeners: ReturnType<typeof useSortable>["listeners"]
  } | null
}

function LayerRow({
  type,
  isActive,
  visible,
  onSelect,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  setNodeRef,
  style,
  dragHandleProps,
}: LayerRowProps) {
  const displayName = BLOCK_NAMES[type] || type

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/builder-item mb-1.5 flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-all",
        isActive
          ? "border-primary/50 bg-primary/10 shadow-sm"
          : "border-border/40 bg-card/60 hover:border-border hover:bg-muted/40",
        !visible && "opacity-45"
      )}
    >
      {dragHandleProps ? (
        <div
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
          className="cursor-grab p-1 text-muted-foreground/60 hover:text-foreground active:cursor-grabbing shrink-0"
          title="Drag untuk mengubah urutan"
        >
          <GripVertical className="size-4" />
        </div>
      ) : (
        <div className="p-1 text-muted-foreground/40 shrink-0" aria-hidden>
          <GripVertical className="size-4" />
        </div>
      )}

      <div className="min-w-0 flex-1 cursor-pointer select-none" onClick={onSelect}>
        <div className="truncate text-xs font-semibold text-foreground tracking-tight">
          {displayName}
        </div>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        {onMoveUp && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 text-muted-foreground transition-opacity",
              !canMoveUp
                ? "opacity-20 pointer-events-none"
                : "hover:text-foreground opacity-0 group-hover/builder-item:opacity-100"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onMoveUp()
            }}
            disabled={!canMoveUp}
            title="Pindah ke atas"
          >
            <ChevronUp className="size-3.5" />
          </Button>
        )}
        {onMoveDown && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 text-muted-foreground transition-opacity",
              !canMoveDown
                ? "opacity-20 pointer-events-none"
                : "hover:text-foreground opacity-0 group-hover/builder-item:opacity-100"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onMoveDown()
            }}
            disabled={!canMoveDown}
            title="Pindah ke bawah"
          >
            <ChevronDown className="size-3.5" />
          </Button>
        )}

        <div className="mx-1" onClick={(e) => e.stopPropagation()}>
          <Switch
            size="sm"
            checked={visible}
            onCheckedChange={onToggleVisibility}
            aria-label={`Toggle visibility ${displayName}`}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground/60 opacity-0 transition-opacity hover:text-destructive hover:bg-destructive/10 group-hover/builder-item:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          title="Hapus blok"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

interface SortableLayerItemProps {
  id: string
  type: BlockType
  isActive: boolean
  visible: boolean
  onSelect: () => void
  onDelete: () => void
  onToggleVisibility: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

function SortableLayerItem({
  id,
  type,
  isActive,
  visible,
  onSelect,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SortableLayerItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  return (
    <LayerRow
      type={type}
      isActive={isActive}
      visible={visible}
      onSelect={onSelect}
      onDelete={onDelete}
      onToggleVisibility={onToggleVisibility}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      setNodeRef={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      dragHandleProps={{ attributes, listeners }}
    />
  )
}

interface LayersListProps {
  blocks: Block[]
  activeBlockId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggleVisibility: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onDragEnd: (event: DragEndEvent) => void
}

export function LayersList({
  blocks,
  activeBlockId,
  onSelect,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onDragEnd,
}: LayersListProps) {
  const [dndReady, setDndReady] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only mount flag to defer DnD setup until after hydration
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
      <div className="flex flex-col">
        {blocks.map((block, i) => (
          <LayerRow
            key={block.id}
            type={block.type}
            isActive={activeBlockId === block.id}
            visible={block.visible}
            onSelect={() => onSelect(block.id)}
            onDelete={() => onDelete(block.id)}
            onToggleVisibility={() => onToggleVisibility(block.id)}
            onMoveUp={() => onMoveUp(block.id)}
            onMoveDown={() => onMoveDown(block.id)}
            canMoveUp={i > 0}
            canMoveDown={i < blocks.length - 1}
            dragHandleProps={null}
          />
        ))}
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col">
          {blocks.map((block, i) => (
            <SortableLayerItem
              key={block.id}
              id={block.id}
              type={block.type}
              isActive={activeBlockId === block.id}
              visible={block.visible}
              onSelect={() => onSelect(block.id)}
              onDelete={() => onDelete(block.id)}
              onToggleVisibility={() => onToggleVisibility(block.id)}
              onMoveUp={() => onMoveUp(block.id)}
              onMoveDown={() => onMoveDown(block.id)}
              canMoveUp={i > 0}
              canMoveDown={i < blocks.length - 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
