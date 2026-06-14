"use client"

import { useRef } from "react"
import { Search, GitCompareArrows, CalendarCheck, ShieldCheck, Sparkles, MessageCircle } from "lucide-react"

import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { SectionHeading } from "@/components/design"
import { SITE_NAME } from "@/lib/site"

const VALUE_PROPS = [
  {
    name: "Kurasi profesional",
    description:
      "Setiap studio dikurasi sebelum tampil — portofolio, kebersihan, dan reputasi kami cek dulu.",
    icon: <Sparkles className="size-5" />,
    className: "lg:col-span-2",
  },
  {
    name: "Kebersihan terverifikasi",
    description:
      "Badge sterilisasi untuk studio yang sudah lolos cek, supaya kamu aman memilih.",
    icon: <ShieldCheck className="size-5" />,
    className: "lg:col-span-1",
  },
  {
    name: "Hubungi artist langsung",
    description:
      "Tanpa perantara. Diskusi ide, ukuran, dan estimasi harga langsung lewat WhatsApp.",
    icon: <MessageCircle className="size-5" />,
    className: "lg:col-span-1",
  },
  {
    name: "Bandingkan dengan tenang",
    description:
      "Filter wilayah, gaya, dan status terverifikasi. Bandingkan portofolio berdampingan sebelum memutuskan.",
    icon: <GitCompareArrows className="size-5" />,
    className: "lg:col-span-2",
  },
]

function FlowNode({
  refEl,
  icon,
  label,
}: {
  refEl: React.RefObject<HTMLDivElement | null>
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={refEl}
        className="z-10 flex size-14 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm"
      >
        {icon}
      </div>
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function ShowcaseValueProps() {
  const containerRef = useRef<HTMLDivElement>(null)
  const node1Ref = useRef<HTMLDivElement>(null)
  const node2Ref = useRef<HTMLDivElement>(null)
  const node3Ref = useRef<HTMLDivElement>(null)

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <SectionHeading
          align="center"
          tagline="Kenapa RuangTato"
          title="Cara terbaik menemukan studio tattoo."
          description="Satu tempat untuk menjelajah, membandingkan, dan menghubungi studio tattoo profesional di Indonesia."
        />

        {/* Bento value props */}
        <BentoGrid className="mt-14">
          {VALUE_PROPS.map((item) => (
            <BentoCard
              key={item.name}
              name={item.name}
              description={item.description}
              icon={item.icon}
              className={item.className}
            />
          ))}
        </BentoGrid>

        {/* Animated flow: Cari -> Bandingkan -> Booking */}
        <div className="mt-20">
          <h3 className="text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Tiga langkah di {SITE_NAME}
          </h3>

          <div
            ref={containerRef}
            className="relative mx-auto mt-10 flex max-w-3xl items-start justify-between px-4"
          >
            <FlowNode refEl={node1Ref} icon={<Search className="size-6" />} label="Cari" />
            <FlowNode
              refEl={node2Ref}
              icon={<GitCompareArrows className="size-6" />}
              label="Bandingkan"
            />
            <FlowNode
              refEl={node3Ref}
              icon={<CalendarCheck className="size-6" />}
              label="Booking"
            />

            <AnimatedBeam
              containerRef={containerRef}
              fromRef={node1Ref}
              toRef={node2Ref}
              curvature={-40}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={node2Ref}
              toRef={node3Ref}
              curvature={-40}
              delay={1.2}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
