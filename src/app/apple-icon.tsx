import { ImageResponse } from "next/og"

import { BRAND_INK_BLACK } from "@/lib/brand"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  const logoUrl = new URL("/image/logo-ruangtato.png", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").toString()

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
          borderRadius: 32,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt="" width={80} height={156} />
      </div>
    ),
    { ...size },
  )
}
