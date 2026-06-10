import { ImageResponse } from "next/og"

import { BRAND_INK_BLACK, logoMarkDataUri } from "@/lib/brand"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  const logoSrc = logoMarkDataUri({ tone: "dark", showFrame: true })

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
        <img src={logoSrc} alt="" width={140} height={140} />
      </div>
    ),
    { ...size },
  )
}
