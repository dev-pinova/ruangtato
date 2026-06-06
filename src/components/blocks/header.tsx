// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockHeader({ data }: { data: any }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="font-sans text-base font-semibold tracking-tight text-foreground">
          {data?.title || "Studio Name"}
        </div>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#goals" className="transition-colors hover:text-foreground">Tentang</a>
          <a href="#features" className="transition-colors hover:text-foreground">Layanan</a>
          <a href="#creator" className="transition-colors hover:text-foreground">Artist</a>
          <a href="#testimonials" className="transition-colors hover:text-foreground">Klien</a>
          <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
        </nav>

        <a
          href="#contact"
          className="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
        >
          {data?.ctaText || "Booking"}
        </a>
      </div>
    </header>
  )
}
