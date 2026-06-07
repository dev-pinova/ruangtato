import { MessageCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const DEFAULT_MESSAGE =
  "Halo,%20saya%20tertarik%20untuk%20konsultasi%20tattoo"

function normalizeWaNumber(waNumber: string) {
  return waNumber.replace(/[^\d]/g, "")
}

export function FloatingWhatsAppButton({
  waNumber,
  position = "fixed",
  className,
}: {
  waNumber?: string
  position?: "fixed" | "absolute"
  className?: string
}) {
  const digits = waNumber ? normalizeWaNumber(waNumber) : ""
  if (!digits) return null

  const href = `https://wa.me/${digits}?text=${DEFAULT_MESSAGE}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi via WhatsApp"
      className={cn(
        "z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 hover:bg-[#20bd5a]",
        position === "fixed" ? "fixed bottom-6 right-6" : "absolute bottom-6 right-6",
        className,
      )}
    >
      <MessageCircle className="size-7 fill-white text-white" />
    </a>
  )
}
