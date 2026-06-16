import { ImageResponse } from "next/og"

import {
  BRAND_INK_BLACK,
  BRAND_SCARLET,
  BRAND_WORDMARK_PREFIX,
  BRAND_WORDMARK_SUFFIX,
  logoMarkDataUri,
} from "@/lib/brand"
import { SITE_NAME } from "@/lib/site"

export const alt = `${SITE_NAME} — Direktori & Landing Page Studio Tato`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  const logoSrc = logoMarkDataUri({ tone: "dark", showFrame: true })

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
          backgroundColor: BRAND_INK_BLACK,
          padding: "80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={200} height={200} />
        <p
          style={{
            marginTop: 40,
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "#ffffff" }}>{BRAND_WORDMARK_PREFIX}</span>
          <span style={{ color: BRAND_SCARLET }}>{BRAND_WORDMARK_SUFFIX}</span>
        </p>
        <p
          style={{
            marginTop: 20,
            fontSize: 32,
            fontWeight: 400,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          Direktori & Landing Page Studio Tato Indonesia
        </p>
        <div
          style={{
            marginTop: 48,
            width: 120,
            height: 4,
            backgroundColor: BRAND_SCARLET,
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size },
  )
}
