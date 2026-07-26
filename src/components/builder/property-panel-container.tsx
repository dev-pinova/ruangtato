"use client"

import { useState } from "react"
import { Sparkles, Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import type {
  Block,
  HeaderData,
  HeaderOverlayData,
  HeroData,
  HeroSliderData,
  GoalsData,
  GalleryData,
  OverviewData,
  FeaturesData,
  ServicesCardsData,
  HowItWorksData,
  CreatorBioData,
  ArtistsGridData,
  StatsCounterData,
  TestimonialsData,
  LatestNewsData,
  FAQData,
  AppointmentFormData,
  FinalCTAData,
  FooterData,
  LeadFormData,
} from "@/lib/types"
import * as Panels from "./property-panels"

interface PropertyPanelContainerProps {
  block: Block
  onChange: (key: string, value: unknown) => void
}

const TEXT_KEYS = new Set([
  "title",
  "headline",
  "subheadline",
  "description",
  "ctaText",
  "eyebrow",
  "tagline",
  "logoText",
  "creator",
  "name",
  "role",
  "bio",
  "category",
  "address",
  "mapAddress",
  "content1",
  "content2",
])

export function PropertyPanelContainer({ block, onChange }: PropertyPanelContainerProps) {
  const [editLang, setEditLang] = useState<"id" | "en">("id")
  const [translating, setTranslating] = useState(false)

  const createHandler = <T,>() => {
    return <K extends keyof T>(key: K, value: T[K]) => {
      const keyStr = key as string
      if (editLang === "en" && TEXT_KEYS.has(keyStr)) {
        onChange(`${keyStr}_en`, value)
      } else {
        onChange(keyStr, value)
      }
    }
  }

  // Auto-translate text fields from ID to EN
  const handleAutoTranslate = async () => {
    setTranslating(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (block.data || {}) as Record<string, any>
      let count = 0

      // Translate simple string properties
      for (const key of Object.keys(data)) {
        if (TEXT_KEYS.has(key) && typeof data[key] === "string" && data[key].trim() !== "") {
          const res = await fetch("/api/builder/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: data[key], from: "id", to: "en" }),
          })
          if (res.ok) {
            const { translatedText } = await res.json()
            if (translatedText) {
              onChange(`${key}_en`, translatedText)
              count++
            }
          }
        }
      }

      if (count > 0) {
        toast.success(`Berhasil menerjemahkan ${count} bidang teks ke Bahasa Inggris!`)
        setEditLang("en")
      } else {
        toast.info("Tidak ada teks Bahasa Indonesia yang ditemukan untuk diterjemahkan.")
      }
    } catch {
      toast.error("Gagal menerjemahkan teks.")
    } finally {
      setTranslating(false)
    }
  }

  const renderPanel = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blockData = (block.data || {}) as Record<string, any>
    // Proxy data object so property panels read key_en when editLang is 'en'
    const displayData = new Proxy(blockData, {
      get(target, prop: string) {
        if (editLang === "en" && TEXT_KEYS.has(prop)) {
          return target[`${prop}_en`] !== undefined ? target[`${prop}_en`] : ""
        }
        return target[prop]
      },
    })

    switch (block.type) {
      case "Header":
        return <Panels.HeaderPanel data={displayData as HeaderData} onChange={createHandler<HeaderData>()} />
      case "HeaderOverlay":
        return <Panels.HeaderOverlayPanel data={displayData as HeaderOverlayData} onChange={createHandler<HeaderOverlayData>()} />
      case "Hero":
        return <Panels.HeroPanel data={displayData as HeroData} onChange={createHandler<HeroData>()} />
      case "HeroSlider":
        return <Panels.HeroSliderPanel data={displayData as HeroSliderData} onChange={createHandler<HeroSliderData>()} />
      case "Goals":
        return <Panels.GoalsPanel data={displayData as GoalsData} onChange={createHandler<GoalsData>()} />
      case "Gallery":
        return <Panels.GalleryPanel data={displayData as GalleryData} onChange={createHandler<GalleryData>()} />
      case "Overview":
        return <Panels.OverviewPanel data={displayData as OverviewData} onChange={createHandler<OverviewData>()} />
      case "Features":
        return <Panels.FeaturesPanel data={displayData as FeaturesData} onChange={createHandler<FeaturesData>()} />
      case "ServicesCards":
        return <Panels.ServicesCardsPanel data={displayData as ServicesCardsData} onChange={createHandler<ServicesCardsData>()} />
      case "HowItWorks":
        return <Panels.HowItWorksPanel data={displayData as HowItWorksData} onChange={createHandler<HowItWorksData>()} />
      case "CreatorBio":
        return <Panels.CreatorBioPanel data={displayData as CreatorBioData} onChange={createHandler<CreatorBioData>()} />
      case "ArtistsGrid":
        return <Panels.ArtistsGridPanel data={displayData as ArtistsGridData} onChange={createHandler<ArtistsGridData>()} />
      case "StatsCounter":
        return <Panels.StatsCounterPanel data={displayData as StatsCounterData} onChange={createHandler<StatsCounterData>()} />
      case "Testimonials":
        return <Panels.TestimonialsPanel data={displayData as TestimonialsData} onChange={createHandler<TestimonialsData>()} />
      case "LatestNews":
        return <Panels.LatestNewsPanel data={displayData as LatestNewsData} onChange={createHandler<LatestNewsData>()} />
      case "FAQ":
        return <Panels.FAQPanel data={displayData as FAQData} onChange={createHandler<FAQData>()} />
      case "AppointmentForm":
        return <Panels.AppointmentFormPanel data={displayData as AppointmentFormData} onChange={createHandler<AppointmentFormData>()} />
      case "LeadForm":
        return <Panels.LeadFormPanel data={displayData as LeadFormData} onChange={createHandler<LeadFormData>()} />
      case "FinalCTA":
        return <Panels.FinalCTAPanel data={displayData as FinalCTAData} onChange={createHandler<FinalCTAData>()} />
      case "Footer":
        return <Panels.FooterPanel data={displayData as FooterData} onChange={createHandler<FooterData>()} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Language Selector Header */}
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 p-2 text-xs">
        <div className="flex items-center gap-1 font-medium">
          <Globe className="size-3.5 text-muted-foreground" />
          <span>Bahasa Pengeditan:</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={editLang === "id" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-[11px] px-2.5"
            onClick={() => setEditLang("id")}
          >
            🇮🇩 ID
          </Button>
          <Button
            type="button"
            variant={editLang === "en" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-[11px] px-2.5"
            onClick={() => setEditLang("en")}
          >
            🇬🇧 EN
          </Button>
        </div>
      </div>

      {/* Auto-Translate Assistant Banner */}
      <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-xs text-primary">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-primary" />
          <span>Terjemahkan blok ini ke EN otomatis?</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={translating}
          onClick={handleAutoTranslate}
          className="h-7 shrink-0 text-[10px] gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
        >
          {translating ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
          Auto-Translate
        </Button>
      </div>

      {renderPanel()}
    </div>
  )
}

