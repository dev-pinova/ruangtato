import { MapPin, Camera, MessageCircle, Mail } from "lucide-react"
import { P } from "@/components/ui/typography"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockFooter({ data }: { data: any }) {
  const instagram = data?.instagram
  const whatsapp = data?.whatsapp
  const email = data?.email

  return (
    <footer className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="font-sans font-bold text-2xl tracking-tight mb-4 flex items-center justify-center gap-2">
            <span className="text-primary">{"///"}</span> {data?.title || "Studio Name"}
          </div>
          <P className="text-sm text-muted-foreground mb-8">
            {data?.address || "Jl. Sudirman No. 123, Jakarta"}
          </P>
        </div>

        {data?.address && (
          <div className="mx-auto mb-8 max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-white/80">Lokasi Studio</p>
                <p className="mt-1 text-sm text-white/60">{data.address}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Camera className="h-4 w-4" />
              Instagram
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          )}
          {!instagram && !whatsapp && !email && (
            <>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">WhatsApp</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Email</a>
            </>
          )}
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} {data?.title || "Studio Name"}. Powered by Ruang Tato.
        </div>
      </div>
    </footer>
  )
}
