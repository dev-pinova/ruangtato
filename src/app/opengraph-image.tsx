import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { SITE_NAME } from "@/lib/site"

export const alt = `${SITE_NAME} — Direktori & Landing Page Studio Tattoo`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage() {
  const logoPath = join(process.cwd(), "public/ruang-tato/logo-putih.png")
  const logoData = await readFile(logoPath)
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          padding: "80px",
        }}
      >
        <img
          src={logoSrc}
          alt={SITE_NAME}
          width={420}
          height={120}
          style={{ objectFit: "contain" }}
        />
        <p
          style={{
            marginTop: 48,
            fontSize: 36,
            fontWeight: 500,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          Direktori & Landing Page Studio Tattoo Indonesia
        </p>
      </div>
    ),
    { ...size },
  )
}
