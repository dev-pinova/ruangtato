"use client"

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
  NewsletterData,
  FAQData,
  AppointmentFormData,
  FinalCTAData,
  FooterData,
} from "@/lib/types"
import * as Panels from "./property-panels"

interface PropertyPanelContainerProps {
  block: Block
  onChange: (key: string, value: unknown) => void
}

export function PropertyPanelContainer({ block, onChange }: PropertyPanelContainerProps) {
  const createHandler = <T,>() => {
    return <K extends keyof T>(key: K, value: T[K]) => {
      onChange(key as string, value)
    }
  }

  switch (block.type) {
    case 'Header':
      return <Panels.HeaderPanel data={block.data as HeaderData} onChange={createHandler<HeaderData>()} />
    case 'HeaderOverlay':
      return <Panels.HeaderOverlayPanel data={block.data as HeaderOverlayData} onChange={createHandler<HeaderOverlayData>()} />
    case 'Hero':
      return <Panels.HeroPanel data={block.data as HeroData} onChange={createHandler<HeroData>()} />
    case 'HeroSlider':
      return <Panels.HeroSliderPanel data={block.data as HeroSliderData} onChange={createHandler<HeroSliderData>()} />
    case 'Goals':
      return <Panels.GoalsPanel data={block.data as GoalsData} onChange={createHandler<GoalsData>()} />
    case 'Gallery':
      return <Panels.GalleryPanel data={block.data as GalleryData} onChange={createHandler<GalleryData>()} />
    case 'Overview':
      return <Panels.OverviewPanel data={block.data as OverviewData} onChange={createHandler<OverviewData>()} />
    case 'Features':
      return <Panels.FeaturesPanel data={block.data as FeaturesData} onChange={createHandler<FeaturesData>()} />
    case 'ServicesCards':
      return <Panels.ServicesCardsPanel data={block.data as ServicesCardsData} onChange={createHandler<ServicesCardsData>()} />
    case 'HowItWorks':
      return <Panels.HowItWorksPanel data={block.data as HowItWorksData} onChange={createHandler<HowItWorksData>()} />
    case 'CreatorBio':
      return <Panels.CreatorBioPanel data={block.data as CreatorBioData} onChange={createHandler<CreatorBioData>()} />
    case 'ArtistsGrid':
      return <Panels.ArtistsGridPanel data={block.data as ArtistsGridData} onChange={createHandler<ArtistsGridData>()} />
    case 'StatsCounter':
      return <Panels.StatsCounterPanel data={block.data as StatsCounterData} onChange={createHandler<StatsCounterData>()} />
    case 'Testimonials':
      return <Panels.TestimonialsPanel data={block.data as TestimonialsData} onChange={createHandler<TestimonialsData>()} />
    case 'LatestNews':
      return <Panels.LatestNewsPanel data={block.data as LatestNewsData} onChange={createHandler<LatestNewsData>()} />
    case 'Newsletter':
      return <Panels.NewsletterPanel data={block.data as NewsletterData} onChange={createHandler<NewsletterData>()} />
    case 'FAQ':
      return <Panels.FAQPanel data={block.data as FAQData} onChange={createHandler<FAQData>()} />
    case 'AppointmentForm':
      return <Panels.AppointmentFormPanel data={block.data as AppointmentFormData} onChange={createHandler<AppointmentFormData>()} />
    case 'FinalCTA':
      return <Panels.FinalCTAPanel data={block.data as FinalCTAData} onChange={createHandler<FinalCTAData>()} />
    case 'Footer':
      return <Panels.FooterPanel data={block.data as FooterData} onChange={createHandler<FooterData>()} />
    default:
      return null
  }
}
