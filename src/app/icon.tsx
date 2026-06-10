import { ImageResponse } from "next/og"

import { BRAND_INK_BLACK, logoMarkDataUri } from "@/lib/brand"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
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
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={28} height={28} />
      </div>
    ),
    { ...size },
  )
}
