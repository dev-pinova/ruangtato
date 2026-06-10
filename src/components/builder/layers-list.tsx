"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { GripVertical, Trash2 } from "lucide-react"
import type { Block, BlockType } from "@/lib/types"

interface LayerRowProps {
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
}

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
}: LayerRowProps) {
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

interface SortableLayerItemProps {
  id: string
  type: BlockType
  isActive: boolean
  visible: boolean
  onSelect: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}

function SortableLayerItem({
  id,
  type,
  isActive,
  visible,
  onSelect,
  onDelete,
  onToggleVisibility,
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
  onDragEnd: (event: DragEndEvent) => void
}

export function LayersList({
  blocks,
  activeBlockId,
  onSelect,
  onDelete,
  onToggleVisibility,
  onDragEnd,
}: LayersListProps) {
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
