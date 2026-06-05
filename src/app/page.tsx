"use client"

import { useState } from "react"
import Link from "next/link"

import { ShowcaseHero } from "@/components/showcase/hero"
import { FilterBar } from "@/components/showcase/filter-bar"
import { StudioGrid } from "@/components/showcase/studio-grid"

type SortBy = "views" | "clicks" | "name"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("views")
  const [trustedOnly, setTrustedOnly] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")

  return (
    <main className="min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="font-sans text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-primary">{"///"}</span> Ruang Tato
          </div>
          <nav className="hidden md:flex gap-7 text-sm font-medium text-white/70">
            <a href="#" className="transition-colors hover:text-foreground">Browse</a>
            <a href="#" className="transition-colors hover:text-foreground">Top rated</a>
            <a href="#" className="transition-colors hover:text-foreground">Cities</a>
          </nav>
          <div className="flex gap-2 sm:gap-4 items-center text-sm">
            <Link href="/register" className="hidden sm:inline font-medium text-white/70 transition-colors hover:text-foreground">
              Daftar Studio
            </Link>
            <Link href="/login" className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition hover:bg-primary/90">
              Masuk
            </Link>
          </div>
        </div>
      </header>

      <ShowcaseHero searchQuery={searchQuery} onSearch={setSearchQuery} />
      <FilterBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        trustedOnly={trustedOnly}
        onTrustedToggle={() => setTrustedOnly((prev) => !prev)}
      />
      <StudioGrid
        searchQuery={searchQuery}
        sortBy={sortBy}
        trustedOnly={trustedOnly}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      <footer className="mt-auto border-t border-white/5 py-12 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-sans text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-primary">{"///"}</span> Ruang Tato
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Use</a>
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            &copy; {new Date().getFullYear()} Ruang Tato. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
