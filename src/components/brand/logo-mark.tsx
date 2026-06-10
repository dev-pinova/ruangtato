import {
  monogramFrameColors,
  monogramStrokeColor,
  type LogoTone,
} from "@/lib/brand"
import { cn } from "@/lib/utils"

type LogoMarkProps = {
  tone?: LogoTone
  /** Dashed circle + scarlet frame — for app icon only */
  showFrame?: boolean
  className?: string
  ariaHidden?: boolean
}

export function LogoMark({
  tone = "dark",
  showFrame = false,
  className,
  ariaHidden = true,
}: LogoMarkProps) {
  const stroke = monogramStrokeColor(tone)
  const { circle, rect, rectOpacity } = monogramFrameColors(tone)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden={ariaHidden}
      className={cn("shrink-0", className)}
    >
      {showFrame ? (
        <>
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke={circle}
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <rect
            x="35"
            y="35"
            width="130"
            height="130"
            rx="16"
            stroke={rect}
            strokeWidth="3"
            opacity={rectOpacity}
          />
        </>
      ) : null}
      <path
        d="M70 65 H135"
        stroke={stroke}
        strokeWidth="10"
        strokeLinecap="square"
      />
      <path
        d="M95 65 V135 L100 148 L105 135"
        stroke={stroke}
        strokeWidth="10"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M95 65 C135 65, 135 100, 95 100"
        stroke={stroke}
        strokeWidth="10"
        strokeLinecap="square"
      />
      <path
        d="M105 100 L130 138"
        stroke={stroke}
        strokeWidth="10"
        strokeLinecap="square"
      />
    </svg>
  )
}
