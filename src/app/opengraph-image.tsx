import { ImageResponse } from "next/og"

import {
  BRAND_INK_BLACK,
  BRAND_SCARLET,
  BRAND_WORDMARK_PREFIX,
  BRAND_WORDMARK_SUFFIX,
} from "@/lib/brand"
import { SITE_NAME } from "@/lib/site"

export const alt = `${SITE_NAME} — Direktori & Landing Page Studio Tato`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width="120"
          height="120"
          style={{ display: "block", marginBottom: "20px" }}
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#2C2C2E"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
          />
          <rect
            x="35"
            y="35"
            width="130"
            height="130"
            rx="16"
            stroke="#FF3B30"
            strokeWidth="3"
            opacity="0.4"
            fill="none"
          />
          <path
            d="M70 65 H135"
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeLinecap="square"
          />
          <path
            d="M95 65 V135 L100 148 L105 135"
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none"
          />
          <path
            d="M95 65 C135 65, 135 100, 95 100"
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeLinecap="square"
            fill="none"
          />
          <path
            d="M105 100 L130 138"
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeLinecap="square"
          />
        </svg>
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
