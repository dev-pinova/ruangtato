import { Button } from "@/components/ui/button"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockHeader({ data }: { data: any }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="font-sans text-2xl font-semibold tracking-tight">
          <span className="text-primary">*</span>
          <span className="ml-1">{data?.title || "Studio Name"}</span>
        </div>

        <nav className="hidden items-center gap-6 text-xs font-medium text-white/70 md:flex">
          <a href="#overview" className="transition-colors hover:text-white">Overview</a>
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#creator" className="transition-colors hover:text-white">About creator</a>
          <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
          <a href="#testimonials" className="transition-colors hover:text-white">Testimonials</a>
          <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
        </nav>

        <Button className="h-9 rounded-full bg-white text-black hover:bg-white/90">
          {data?.ctaText || "Get started"}
        </Button>
      </div>
    </header>
  )
}
