import { BuilderUI } from "@/components/builder/builder-ui"

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-primary-foreground">
      <header className="h-16 border-b border-white/5 flex items-center px-6 justify-between bg-zinc-950 z-10 relative">
        <div className="flex items-center gap-4">
          <div className="font-sans font-bold text-xl tracking-tight flex items-center gap-2">
            <span className="text-primary">{"///"}</span> Ruang Tato
          </div>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <div className="text-sm font-medium tracking-wide text-muted-foreground">
            Landing Page Builder
          </div>
        </div>
        <div className="text-xs font-mono bg-primary/10 px-3 py-1 rounded-full border border-primary/20 text-primary font-semibold">
          Mode: OWNER
        </div>
      </header>
      
      <main className="flex-1">
        <BuilderUI />
      </main>
    </div>
  )
}
