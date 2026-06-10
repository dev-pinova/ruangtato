"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { Upload, Trash2, Image as ImageIcon, Loader2, Link as LinkIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"upload" | "url">(value ? "url" : "upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0])
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (res.status === 503) {
          throw new Error("Storage R2 belum aktif/dikonfigurasi di environment.")
        }
        if (data.details && Array.isArray(data.details)) {
          throw new Error(data.details.join(", "))
        }
        throw new Error(data.error ?? "Gagal mengunggah gambar.")
      }

      if (data.url) {
        onChange(data.url)
        setError(null)
      } else {
        throw new Error("URL gambar tidak ditemukan pada respon server.")
      }
    } catch (err: unknown) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah.")
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    onChange("")
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border/80 bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground/80">{label || "Gambar"}</label>
        <div className="flex gap-1.5">
          <Button
            type="button"
            variant={mode === "upload" ? "secondary" : "ghost"}
            size="xs"
            className="h-6 text-[10px] px-2"
            onClick={() => setMode("upload")}
          >
            Upload
          </Button>
          <Button
            type="button"
            variant={mode === "url" ? "secondary" : "ghost"}
            size="xs"
            className="h-6 text-[10px] px-2"
            onClick={() => setMode("url")}
          >
            URL
          </Button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="flex flex-col gap-2">
          {value ? (
            <div className="relative overflow-hidden rounded-md border border-border bg-card p-1">
              {/* Image Preview */}
              <div className="relative aspect-video w-full overflow-hidden rounded bg-black/40 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt="Preview"
                  className="h-full w-full object-contain"
                  onError={() => setError("Gambar gagal dimuat. Periksa URL atau koneksi.")}
                />
              </div>
              <div className="mt-2 flex items-center justify-between px-1.5 py-1">
                <span className="truncate text-[10px] text-muted-foreground max-w-[160px]" title={value}>
                  {value.split("/").pop()}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                  onClick={clearImage}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Mengunggah...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="rounded-full bg-muted/60 p-1.5 text-muted-foreground">
                    <Upload className="size-4" />
                  </div>
                  <p className="text-xs font-medium text-foreground/80">Pilih atau Drag & Drop gambar</p>
                  <p className="text-[10px] text-muted-foreground">Maksimal 5MB (Format: JPG, PNG, WEBP)</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <LinkIcon className="size-3.5 text-muted-foreground shrink-0" />
            <Input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          {value && (
            <div className="relative aspect-video w-full overflow-hidden rounded border border-border bg-black/40 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-contain"
                onError={() => setError("Gambar gagal dimuat. Periksa URL.")}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-1.5 rounded-md bg-destructive/5 border border-destructive/20 p-2 text-[10px] text-destructive">
          <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
          <span className="leading-normal">{error}</span>
        </div>
      )}
    </div>
  )
}
