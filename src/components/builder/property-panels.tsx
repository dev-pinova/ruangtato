"use client"

import { useId } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./image-upload"
import type {
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
  HeaderOverlayLink,
} from "@/lib/types"

const inputClass = ""
const textareaClass = "min-h-[80px]"

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
      {children}
    </label>
  )
}

interface PanelProps<T> {
  data: T
  onChange: <K extends keyof T>(key: K, value: T[K]) => void
}

export function HeaderPanel({ data, onChange }: PanelProps<HeaderData>) {
  const titleId = useId()
  const ctaTextId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={titleId}>Title</FieldLabel>
        <Input id={titleId} className={inputClass} value={data.title || ''} onChange={(e) => onChange('title', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={ctaTextId}>CTA Text</FieldLabel>
        <Input id={ctaTextId} className={inputClass} value={data.ctaText || ''} onChange={(e) => onChange('ctaText', e.target.value)} />
      </div>
    </>
  )
}

export function HeroPanel({ data, onChange }: PanelProps<HeroData>) {
  const headlineId = useId()
  const subheadlineId = useId()
  const ctaTextId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} className={inputClass} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={subheadlineId}>Subheadline</FieldLabel>
        <Textarea id={subheadlineId} className={textareaClass} value={data.subheadline || ''} onChange={(e) => onChange('subheadline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={ctaTextId}>CTA Text</FieldLabel>
        <Input id={ctaTextId} className={inputClass} value={data.ctaText || ''} onChange={(e) => onChange('ctaText', e.target.value)} />
      </div>
      <ImageUpload value={data.image || ''} onChange={(url) => onChange('image', url)} label="Gambar Hero" />
    </>
  )
}

export function GoalsPanel({ data, onChange }: PanelProps<GoalsData>) {
  const eyebrowId = useId()
  const headlineId = useId()
  const descriptionId = useId()
  const videoUrlId = useId()
  const features = data.features || []
  const baseId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={eyebrowId}>Eyebrow (label kecil)</FieldLabel>
        <Input id={eyebrowId} className={inputClass} value={data.eyebrow || ''} onChange={(e) => onChange('eyebrow', e.target.value)} placeholder="About Us" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} className={inputClass} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={descriptionId}>Deskripsi</FieldLabel>
        <Textarea id={descriptionId} className={textareaClass} value={data.description || ''} onChange={(e) => onChange('description', e.target.value)} />
      </div>
      <ImageUpload value={data.image || ''} onChange={(url) => onChange('image', url)} label="Gambar Utama" />
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={videoUrlId}>Video URL (embed)</FieldLabel>
        <Input id={videoUrlId} className={inputClass} value={data.videoUrl || ''} onChange={(e) => onChange('videoUrl', e.target.value)} placeholder="https://www.youtube.com/embed/..." />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Fitur ({features.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('features', [...features, { title: '', desc: '' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {features.map((f, i) => {
          const featureTitleId = `${baseId}-feature-${i}-title`
          const featureDescId = `${baseId}-feature-${i}-desc`
          return (
            <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('features', features.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={featureTitleId}>Judul</FieldLabel>
                <Input id={featureTitleId} className={inputClass} placeholder="Title" value={f.title} onChange={(e) => { const updated = [...features]; updated[i] = { ...updated[i], title: e.target.value }; onChange('features', updated) }} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={featureDescId}>Deskripsi</FieldLabel>
                <Textarea id={featureDescId} className={textareaClass} placeholder="Deskripsi" value={f.desc} onChange={(e) => { const updated = [...features]; updated[i] = { ...updated[i], desc: e.target.value }; onChange('features', updated) }} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export function HeaderOverlayPanel({ data, onChange }: PanelProps<HeaderOverlayData>) {
  const logoTextId = useId()
  const taglineId = useId()
  const showCenterLogoId = useId()
  const leftLinks = data.leftLinks || []
  const rightLinks = data.rightLinks || []
  const baseId = useId()

  function renderLinks(field: 'leftLinks' | 'rightLinks', items: HeaderOverlayLink[]) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <FieldLabel>{field === 'leftLinks' ? 'Link Kiri' : 'Link Kanan'} ({items.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange(field, [...items, { label: '', href: '#' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {items.map((l, i) => {
          const labelId = `${baseId}-${field}-${i}-label`
          const hrefId = `${baseId}-${field}-${i}-href`
          return (
            <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange(field, items.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={labelId}>Label</FieldLabel>
                <Input id={labelId} placeholder="Label" value={l.label || ''} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], label: e.target.value }; onChange(field, u) }} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={hrefId}>Href (Tujuan Link)</FieldLabel>
                <Input id={hrefId} placeholder="Href (mis. #about)" value={l.href || ''} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], href: e.target.value }; onChange(field, u) }} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={logoTextId}>Logo Text</FieldLabel>
        <Input id={logoTextId} className={inputClass} value={data.logoText || ''} onChange={(e) => onChange('logoText', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={taglineId}>Tagline (opsional)</FieldLabel>
        <Input id={taglineId} className={inputClass} value={data.tagline || ''} onChange={(e) => onChange('tagline', e.target.value)} placeholder="Tato • Piercing • Art" />
      </div>
      <label htmlFor={showCenterLogoId} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
        <input
          id={showCenterLogoId}
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

export function LatestNewsPanel({ data, onChange }: PanelProps<LatestNewsData>) {
  const eyebrowId = useId()
  const headlineId = useId()
  const ctaTextId = useId()
  const ctaHrefId = useId()
  const articles = data.articles || []
  const baseId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={eyebrowId}>Eyebrow</FieldLabel>
        <Input id={eyebrowId} value={data.eyebrow || ''} onChange={(e) => onChange('eyebrow', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={ctaTextId}>CTA Text (opsional)</FieldLabel>
        <Input id={ctaTextId} value={data.ctaText || ''} onChange={(e) => onChange('ctaText', e.target.value)} placeholder="View All" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={ctaHrefId}>CTA Href</FieldLabel>
        <Input id={ctaHrefId} value={data.ctaHref || ''} onChange={(e) => onChange('ctaHref', e.target.value)} placeholder="#news" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Articles ({articles.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('articles', [...articles, { title: '', category: '', date: '', image: '', href: '#' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {articles.map((a, i) => {
          const titleId = `${baseId}-article-${i}-title`
          const categoryId = `${baseId}-article-${i}-category`
          const dateId = `${baseId}-article-${i}-date`
          const hrefId = `${baseId}-article-${i}-href`
          return (
            <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('articles', articles.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={titleId}>Title</FieldLabel>
                <Input id={titleId} placeholder="Title" value={a.title || ''} onChange={(e) => { const u = [...articles]; u[i] = { ...u[i], title: e.target.value }; onChange('articles', u) }} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={categoryId}>Category</FieldLabel>
                <Input id={categoryId} placeholder="Category" value={a.category || ''} onChange={(e) => { const u = [...articles]; u[i] = { ...u[i], category: e.target.value }; onChange('articles', u) }} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={dateId}>Date</FieldLabel>
                <Input id={dateId} placeholder="Date" value={a.date || ''} onChange={(e) => { const u = [...articles]; u[i] = { ...u[i], date: e.target.value }; onChange('articles', u) }} />
              </div>
              <ImageUpload value={a.image || ''} onChange={(url) => { const u = [...articles]; u[i] = { ...u[i], image: url }; onChange('articles', u) }} label="Gambar Artikel" />
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={hrefId}>Href</FieldLabel>
                <Input id={hrefId} placeholder="Href" value={a.href || ''} onChange={(e) => { const u = [...articles]; u[i] = { ...u[i], href: e.target.value }; onChange('articles', u) }} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export function NewsletterPanel({ data, onChange }: PanelProps<NewsletterData>) {
  const eyebrowId = useId()
  const headlineId = useId()
  const descriptionId = useId()
  const placeholderId = useId()
  const ctaTextId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={eyebrowId}>Eyebrow</FieldLabel>
        <Input id={eyebrowId} value={data.eyebrow || ''} onChange={(e) => onChange('eyebrow', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={descriptionId}>Description</FieldLabel>
        <Textarea id={descriptionId} value={data.description || ''} onChange={(e) => onChange('description', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={placeholderId}>Placeholder Email</FieldLabel>
        <Input id={placeholderId} value={data.placeholder || ''} onChange={(e) => onChange('placeholder', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={ctaTextId}>CTA Text</FieldLabel>
        <Input id={ctaTextId} value={data.ctaText || ''} onChange={(e) => onChange('ctaText', e.target.value)} />
      </div>
    </>
  )
}

export function OverviewPanel({ data, onChange }: PanelProps<OverviewData>) {
  const headlineId = useId()
  const content1Id = useId()
  const content2Id = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} className={inputClass} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={content1Id}>Konten 1</FieldLabel>
        <Textarea id={content1Id} className={textareaClass} value={data.content1 || ''} onChange={(e) => onChange('content1', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={content2Id}>Konten 2</FieldLabel>
        <Textarea id={content2Id} className={textareaClass} value={data.content2 || ''} onChange={(e) => onChange('content2', e.target.value)} />
      </div>
      <ImageUpload value={data.image1 || ''} onChange={(url) => onChange('image1', url)} label="Gambar 1" />
      <ImageUpload value={data.image2 || ''} onChange={(url) => onChange('image2', url)} label="Gambar 2" />
    </>
  )
}

export function FeaturesPanel({ data, onChange }: PanelProps<FeaturesData>) {
  const titleId = useId()
  const items = data.items || []
  const baseId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={titleId}>Section Title</FieldLabel>
        <Input id={titleId} className={inputClass} value={data.title || ''} onChange={(e) => onChange('title', e.target.value)} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Items ({items.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('items', [...items, { title: '', desc: '' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {items.map((item, i) => {
          const itemTitleId = `${baseId}-item-${i}-title`
          const itemDescId = `${baseId}-item-${i}-desc`
          return (
            <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('items', items.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={itemTitleId}>Title</FieldLabel>
                <Input id={itemTitleId} className={inputClass} placeholder="Title" value={item.title} onChange={(e) => { const updated = [...items]; updated[i] = { ...updated[i], title: e.target.value }; onChange('items', updated) }} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={itemDescId}>Deskripsi</FieldLabel>
                <Textarea id={itemDescId} className={textareaClass} placeholder="Deskripsi" value={item.desc} onChange={(e) => { const updated = [...items]; updated[i] = { ...updated[i], desc: e.target.value }; onChange('items', updated) }} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export function HowItWorksPanel({ data, onChange }: PanelProps<HowItWorksData>) {
  const steps = data.steps || []
  const baseId = useId()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <FieldLabel>Steps ({steps.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('steps', [...steps, { title: '', desc: '' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {steps.map((step, i) => {
        const stepTitleId = `${baseId}-step-${i}-title`
        const stepDescId = `${baseId}-step-${i}-desc`
        return (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">Step #{i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('steps', steps.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={stepTitleId}>Title</FieldLabel>
              <Input id={stepTitleId} className={inputClass} placeholder="Title" value={step.title} onChange={(e) => { const updated = [...steps]; updated[i] = { ...updated[i], title: e.target.value }; onChange('steps', updated) }} />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={stepDescId}>Deskripsi</FieldLabel>
              <Textarea id={stepDescId} className={textareaClass} placeholder="Deskripsi" value={step.desc} onChange={(e) => { const updated = [...steps]; updated[i] = { ...updated[i], desc: e.target.value }; onChange('steps', updated) }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function CreatorBioPanel({ data, onChange }: PanelProps<CreatorBioData>) {
  const nameId = useId()
  const roleId = useId()
  const bioId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={nameId}>Nama</FieldLabel>
        <Input id={nameId} className={inputClass} value={data.name || ''} onChange={(e) => onChange('name', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={roleId}>Role</FieldLabel>
        <Input id={roleId} className={inputClass} value={data.role || ''} onChange={(e) => onChange('role', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={bioId}>Bio</FieldLabel>
        <Textarea id={bioId} className={textareaClass} value={data.bio || ''} onChange={(e) => onChange('bio', e.target.value)} />
      </div>
      <ImageUpload value={data.image || ''} onChange={(url) => onChange('image', url)} label="Foto Profil" />
    </>
  )
}

export function TestimonialsPanel({ data, onChange }: PanelProps<TestimonialsData>) {
  const eyebrowId = useId()
  const headlineId = useId()
  const reviews = data.reviews || []
  const baseId = useId()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={eyebrowId}>Eyebrow</FieldLabel>
        <Input id={eyebrowId} value={data.eyebrow || ''} onChange={(e) => onChange('eyebrow', e.target.value)} placeholder="Testimonial" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} placeholder="What Clients Say" />
      </div>
      <div className="flex items-center justify-between">
        <FieldLabel>Reviews ({reviews.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('reviews', [...reviews, { text: '', name: '', type: '' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {reviews.map((review, i) => {
        const reviewTextId = `${baseId}-review-${i}-text`
        const reviewNameId = `${baseId}-review-${i}-name`
        const reviewTypeId = `${baseId}-review-${i}-type`
        return (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('reviews', reviews.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={reviewTextId}>Teks Review</FieldLabel>
              <Textarea id={reviewTextId} className={textareaClass} placeholder="Teks review" value={review.text} onChange={(e) => { const updated = [...reviews]; updated[i] = { ...updated[i], text: e.target.value }; onChange('reviews', updated) }} />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={reviewNameId}>Nama Klien</FieldLabel>
              <Input id={reviewNameId} className={inputClass} placeholder="Nama klien" value={review.name} onChange={(e) => { const updated = [...reviews]; updated[i] = { ...updated[i], name: e.target.value }; onChange('reviews', updated) }} />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={reviewTypeId}>Tipe</FieldLabel>
              <Input id={reviewTypeId} className={inputClass} placeholder="Tipe (e.g. First Tato)" value={review.type} onChange={(e) => { const updated = [...reviews]; updated[i] = { ...updated[i], type: e.target.value }; onChange('reviews', updated) }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function FAQPanel({ data, onChange }: PanelProps<FAQData>) {
  const faqs = data.faqs || []
  const baseId = useId()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <FieldLabel>FAQ Items ({faqs.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('faqs', [...faqs, { q: '', a: '' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {faqs.map((faq, i) => {
        const faqQId = `${baseId}-faq-${i}-q`
        const faqAId = `${baseId}-faq-${i}-a`
        return (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">Q#{i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('faqs', faqs.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={faqQId}>Pertanyaan</FieldLabel>
              <Input id={faqQId} className={inputClass} placeholder="Pertanyaan" value={faq.q} onChange={(e) => { const updated = [...faqs]; updated[i] = { ...updated[i], q: e.target.value }; onChange('faqs', updated) }} />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={faqAId}>Jawaban</FieldLabel>
              <Textarea id={faqAId} className={textareaClass} placeholder="Jawaban" value={faq.a} onChange={(e) => { const updated = [...faqs]; updated[i] = { ...updated[i], a: e.target.value }; onChange('faqs', updated) }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function FinalCTAPanel({ data, onChange }: PanelProps<FinalCTAData>) {
  const headlineId = useId()
  const subheadlineId = useId()
  const ctaTextId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} className={inputClass} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={subheadlineId}>Subheadline</FieldLabel>
        <Textarea id={subheadlineId} className={textareaClass} value={data.subheadline || ''} onChange={(e) => onChange('subheadline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={ctaTextId}>CTA Text</FieldLabel>
        <Input id={ctaTextId} className={inputClass} value={data.ctaText || ''} onChange={(e) => onChange('ctaText', e.target.value)} />
      </div>
    </>
  )
}

export function FooterPanel({ data, onChange }: PanelProps<FooterData>) {
  const titleId = useId()
  const addressId = useId()
  const instagramId = useId()
  const whatsappId = useId()
  const emailId = useId()
  const newsletterCheckboxId = useId()
  const newsletterEyebrowId = useId()
  const newsletterHeadlineId = useId()
  const newsletterPlaceholderId = useId()
  const newsletterCtaId = useId()

  const newsletterEnabled = data.showNewsletter !== false

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={titleId}>Title</FieldLabel>
        <Input id={titleId} className={inputClass} value={data.title || ''} onChange={(e) => onChange('title', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={addressId}>Alamat</FieldLabel>
        <Input id={addressId} className={inputClass} value={data.address || ''} onChange={(e) => onChange('address', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={instagramId}>Instagram URL</FieldLabel>
        <Input id={instagramId} className={inputClass} value={data.instagram || ''} onChange={(e) => onChange('instagram', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={whatsappId}>WhatsApp</FieldLabel>
        <Input id={whatsappId} className={inputClass} value={data.whatsapp || ''} onChange={(e) => onChange('whatsapp', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={emailId}>Email</FieldLabel>
        <Input id={emailId} className={inputClass} value={data.email || ''} onChange={(e) => onChange('email', e.target.value)} />
      </div>

      <div className="mt-2 border-t border-border pt-3 flex flex-col gap-3">
        <label htmlFor={newsletterCheckboxId} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <input
            id={newsletterCheckboxId}
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
              <FieldLabel htmlFor={newsletterEyebrowId}>Newsletter — Eyebrow</FieldLabel>
              <Input id={newsletterEyebrowId} className={inputClass} value={data.newsletterEyebrow || ''} onChange={(e) => onChange('newsletterEyebrow', e.target.value)} placeholder="Newsletter" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor={newsletterHeadlineId}>Newsletter — Headline</FieldLabel>
              <Input id={newsletterHeadlineId} className={inputClass} value={data.newsletterHeadline || ''} onChange={(e) => onChange('newsletterHeadline', e.target.value)} placeholder="Subscribe to our newsletter" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor={newsletterPlaceholderId}>Placeholder Email</FieldLabel>
              <Input id={newsletterPlaceholderId} className={inputClass} value={data.newsletterPlaceholder || ''} onChange={(e) => onChange('newsletterPlaceholder', e.target.value)} placeholder="Enter your email" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor={newsletterCtaId}>CTA Text</FieldLabel>
              <Input id={newsletterCtaId} className={inputClass} value={data.newsletterCta || ''} onChange={(e) => onChange('newsletterCta', e.target.value)} placeholder="Subscribe" />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export function GalleryPanel({ data, onChange }: PanelProps<GalleryData>) {
  const eyebrowId = useId()
  const headlineId = useId()
  const subheadlineId = useId()
  const images = data.images || []
  const baseId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={eyebrowId}>Eyebrow</FieldLabel>
        <Input id={eyebrowId} value={data.eyebrow || ''} onChange={(e) => onChange('eyebrow', e.target.value)} placeholder="Portfolio" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} placeholder="Our Gallery" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={subheadlineId}>Subheadline (opsional)</FieldLabel>
        <Textarea id={subheadlineId} value={data.subheadline || ''} onChange={(e) => onChange('subheadline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Images ({images.length})</FieldLabel>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('images', [...images, { src: '', alt: '' }])}>
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </Button>
        </div>
        {images.map((img, i) => {
          const altId = `${baseId}-image-${i}-alt`
          return (
            <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('images', images.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <ImageUpload value={img.src || ''} onChange={(url) => { const u = [...images]; u[i] = { ...u[i], src: url }; onChange('images', u) }} label="Foto" />
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={altId}>Alt Text</FieldLabel>
                <Input id={altId} placeholder="Alt text (opsional)" value={img.alt || ''} onChange={(e) => { const u = [...images]; u[i] = { ...u[i], alt: e.target.value }; onChange('images', u) }} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export function HeroSliderPanel({ data, onChange }: PanelProps<HeroSliderData>) {
  const slides = data.slides || []
  const baseId = useId()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <FieldLabel>Slides ({slides.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('slides', [...slides, { headline: '', subheadline: '', ctaText: '', image: '' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {slides.map((slide, i) => {
        const headlineId = `${baseId}-slide-${i}-headline`
        const subheadlineId = `${baseId}-slide-${i}-subheadline`
        const ctaTextId = `${baseId}-slide-${i}-cta`
        return (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
              <Input id={headlineId} placeholder="Headline" value={slide.headline || ''} onChange={(e) => { const u = [...slides]; u[i] = { ...u[i], headline: e.target.value }; onChange('slides', u) }} />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={subheadlineId}>Subheadline</FieldLabel>
              <Textarea id={subheadlineId} placeholder="Subheadline" value={slide.subheadline || ''} onChange={(e) => { const u = [...slides]; u[i] = { ...u[i], subheadline: e.target.value }; onChange('slides', u) }} />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={ctaTextId}>CTA Text</FieldLabel>
              <Input id={ctaTextId} placeholder="CTA Text" value={slide.ctaText || ''} onChange={(e) => { const u = [...slides]; u[i] = { ...u[i], ctaText: e.target.value }; onChange('slides', u) }} />
            </div>
            <ImageUpload value={slide.image || ''} onChange={(url) => { const u = [...slides]; u[i] = { ...u[i], image: url }; onChange('slides', u) }} label="Gambar Slide" />
          </div>
        )
      })}
    </div>
  )
}

export function ArtistsGridPanel({ data, onChange }: PanelProps<ArtistsGridData>) {
  const headlineId = useId()
  const artists = data.artists || []
  const baseId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-3">
        <FieldLabel>Artists ({artists.length})</FieldLabel>
        {artists.map((a, i) => {
          const nameId = `${baseId}-artist-${i}-name`
          const roleId = `${baseId}-artist-${i}-role`
          return (
            <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={nameId}>Nama</FieldLabel>
                <Input id={nameId} placeholder="Nama" value={a.name || ''} onChange={(e) => { const u = [...artists]; u[i] = { ...u[i], name: e.target.value }; onChange('artists', u) }} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor={roleId}>Role</FieldLabel>
                <Input id={roleId} placeholder="Role" value={a.role || ''} onChange={(e) => { const u = [...artists]; u[i] = { ...u[i], role: e.target.value }; onChange('artists', u) }} />
              </div>
              <ImageUpload value={a.image || ''} onChange={(url) => { const u = [...artists]; u[i] = { ...u[i], image: url }; onChange('artists', u) }} label="Foto Artist" />
            </div>
          )
        })}
      </div>
    </>
  )
}

export function StatsCounterPanel({ data, onChange }: PanelProps<StatsCounterData>) {
  const headlineId = useId()
  const stats = data.stats || []
  const baseId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      {stats.map((s, i) => {
        const valId = `${baseId}-stat-${i}-value`
        const lblId = `${baseId}-stat-${i}-label`
        return (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={valId}>Value</FieldLabel>
              <Input id={valId} placeholder="Value" value={s.value || ''} onChange={(e) => { const u = [...stats]; u[i] = { ...u[i], value: e.target.value }; onChange('stats', u) }} />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={lblId}>Label</FieldLabel>
              <Input id={lblId} placeholder="Label" value={s.label || ''} onChange={(e) => { const u = [...stats]; u[i] = { ...u[i], label: e.target.value }; onChange('stats', u) }} />
            </div>
          </div>
        )
      })}
    </>
  )
}

export function ServicesCardsPanel({ data, onChange }: PanelProps<ServicesCardsData>) {
  const eyebrowId = useId()
  const headlineId = useId()
  const cards = data.cards || []
  const baseId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={eyebrowId}>Eyebrow</FieldLabel>
        <Input id={eyebrowId} value={data.eyebrow || ''} onChange={(e) => onChange('eyebrow', e.target.value)} placeholder="What We Do" />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex items-center justify-between">
        <FieldLabel>Cards ({cards.length})</FieldLabel>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => onChange('cards', [...cards, { title: '', desc: '', image: '', ctaText: 'Read More', ctaHref: '#' }])}>
          <Plus className="w-3 h-3 mr-1" /> Tambah
        </Button>
      </div>
      {cards.map((c, i) => {
        const titleId = `${baseId}-card-${i}-title`
        const descId = `${baseId}-card-${i}-desc`
        const ctaTextId = `${baseId}-card-${i}-cta`
        const ctaHrefId = `${baseId}-card-${i}-href`
        return (
          <div key={i} className="p-3 border border-border rounded-md bg-muted/30 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">#{i + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange('cards', cards.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={titleId}>Title</FieldLabel>
              <Input id={titleId} placeholder="Title" value={c.title || ''} onChange={(e) => { const u = [...cards]; u[i] = { ...u[i], title: e.target.value }; onChange('cards', u) }} />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={descId}>Deskripsi</FieldLabel>
              <Textarea id={descId} placeholder="Deskripsi" value={c.desc || ''} onChange={(e) => { const u = [...cards]; u[i] = { ...u[i], desc: e.target.value }; onChange('cards', u) }} />
            </div>
            <ImageUpload value={c.image || ''} onChange={(url) => { const u = [...cards]; u[i] = { ...u[i], image: url }; onChange('cards', u) }} label="Gambar Layanan" />
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={ctaTextId}>CTA Text</FieldLabel>
              <Input id={ctaTextId} placeholder="CTA Text (mis. Read More)" value={c.ctaText || ''} onChange={(e) => { const u = [...cards]; u[i] = { ...u[i], ctaText: e.target.value }; onChange('cards', u) }} />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={ctaHrefId}>CTA Href</FieldLabel>
              <Input id={ctaHrefId} placeholder="CTA Href" value={c.ctaHref || ''} onChange={(e) => { const u = [...cards]; u[i] = { ...u[i], ctaHref: e.target.value }; onChange('cards', u) }} />
            </div>
          </div>
        )
      })}
    </>
  )
}

export function AppointmentFormPanel({ data, onChange }: PanelProps<AppointmentFormData>) {
  const headlineId = useId()
  const subheadlineId = useId()
  const ctaTextId = useId()
  const ageLabelId = useId()
  const requireAgeId = useId()
  const showMapId = useId()
  const mapEmbedUrlId = useId()
  const mapAddressId = useId()
  const mapHeightId = useId()

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={headlineId}>Headline</FieldLabel>
        <Input id={headlineId} value={data.headline || ''} onChange={(e) => onChange('headline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={subheadlineId}>Subheadline</FieldLabel>
        <Textarea id={subheadlineId} value={data.subheadline || ''} onChange={(e) => onChange('subheadline', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={ctaTextId}>CTA Text</FieldLabel>
        <Input id={ctaTextId} value={data.ctaText || ''} onChange={(e) => onChange('ctaText', e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={ageLabelId}>Label Checkbox Usia</FieldLabel>
        <Input id={ageLabelId} value={data.ageLabel || ''} onChange={(e) => onChange('ageLabel', e.target.value)} placeholder="Are you 18 years old?" />
      </div>
      <label htmlFor={requireAgeId} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
        <input
          id={requireAgeId}
          type="checkbox"
          className="h-3.5 w-3.5"
          checked={data.requireAge !== false}
          onChange={(e) => onChange('requireAge', e.target.checked)}
        />
        Wajibkan konfirmasi usia 18+
      </label>

      <div className="my-2 border-t border-border pt-4">
        <p className="mb-3 text-xs font-medium text-foreground">Google Maps</p>
        <label htmlFor={showMapId} className="mb-3 flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <input
            id={showMapId}
            type="checkbox"
            className="h-3.5 w-3.5"
            checked={data.showMap === true}
            onChange={(e) => onChange('showMap', e.target.checked)}
          />
          Tampilkan Google Maps
        </label>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor={mapEmbedUrlId}>URL Embed Google Maps</FieldLabel>
          <Textarea
            id={mapEmbedUrlId}
            value={data.mapEmbedUrl || ''}
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
          <FieldLabel htmlFor={mapAddressId}>Alamat (opsional)</FieldLabel>
          <Input
            id={mapAddressId}
            value={data.mapAddress || ''}
            onChange={(e) => onChange('mapAddress', e.target.value)}
            placeholder="Jl. Contoh No. 1, Jakarta"
          />
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <FieldLabel htmlFor={mapHeightId}>Tinggi Peta (px)</FieldLabel>
          <Input
            id={mapHeightId}
            type="number"
            min={280}
            max={800}
            value={String(data.mapHeight || 420)}
            onChange={(e) => onChange('mapHeight', Number(e.target.value) || 420)}
          />
        </div>
      </div>
    </>
  )
}
