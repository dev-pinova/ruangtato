import { ImageResponse } from "next/og"

import { BRAND_INK_BLACK } from "@/lib/brand"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
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
          borderRadius: 4,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt="" width={16} height={30} />
      </div>
    ),
    { ...size },
  )
}
