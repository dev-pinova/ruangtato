import { ImageResponse } from "next/og"

import { BRAND_INK_BLACK } from "@/lib/brand"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND_INK_BLACK,
          borderRadius: "4px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width="24"
          height="24"
          style={{ display: "block" }}
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
      </div>
    ),
    { ...size },
  )
}
