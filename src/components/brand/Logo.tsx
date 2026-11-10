import { WORDMARK_PATH } from "./logo-paths";

/**
 * Cafe 17 logo, redrawn as crisp vector geometry from the original artwork:
 * a lime map-pin holding a top-down coffee cup, over the slanted "Cafe17"
 * script with its stepped swash.
 */

export const LOGO = {
  lime: "#A9CC3B",
  pin: "M150 250 C 115 195, 80 150, 80 100 A 70 70 0 1 1 220 100 C 220 150, 185 195, 150 250 Z",
  handle: { x: 94, y: 86, width: 22, height: 13, rx: 6.5 },
  ring: { cx: 150, cy: 92, r: 35, strokeWidth: 11 },
  bowl: "M127 95 A23 23 0 0 0 173 95 Q150 76 127 95 Z",
  wordTransform: "translate(150 322) rotate(-10) scale(0.84) translate(-127 0)",
  swash: "M 12 30 L 154 17 L 160 10 L 246 1 L 246 7 L 164 16 L 158 24 L 14 39 Z",
  /** Tight boxes for each variant */
  lockupBox: "41 26 218 348",
  pinBox: "76 26 148 228",
} as const;

type SvgProps = React.SVGProps<SVGSVGElement> & { title?: string };

export function PinCup({ cupColor = "#0b0c09" }: { cupColor?: string }) {
  return (
    <>
      <rect {...LOGO.handle} fill={cupColor} />
      <circle
        cx={LOGO.ring.cx}
        cy={LOGO.ring.cy}
        r={LOGO.ring.r}
        fill="none"
        stroke={cupColor}
        strokeWidth={LOGO.ring.strokeWidth}
      />
      <path d={LOGO.bowl} fill={cupColor} />
    </>
  );
}

export function WordmarkGlyphs({ color = LOGO.lime }: { color?: string }) {
  return (
    <g transform={LOGO.wordTransform}>
      <path d={WORDMARK_PATH} fill={color} />
      <path d={LOGO.swash} fill={color} />
    </g>
  );
}

/** Full lockup: pin + wordmark */
export function Logo({
  title = "Cafe 17",
  color = LOGO.lime,
  cupColor = "#0b0c09",
  ...props
}: SvgProps & { color?: string; cupColor?: string }) {
  return (
    <svg viewBox={LOGO.lockupBox} role="img" aria-label={title} {...props}>
      <path d={LOGO.pin} fill={color} />
      <PinCup cupColor={cupColor} />
      <WordmarkGlyphs color={color} />
    </svg>
  );
}

/** Pin + cup only (favicons, nav, markers) */
export function LogoMark({
  title,
  color = LOGO.lime,
  cupColor = "#0b0c09",
  ...props
}: SvgProps & { color?: string; cupColor?: string }) {
  return (
    <svg
      viewBox={LOGO.pinBox}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      <path d={LOGO.pin} fill={color} />
      <PinCup cupColor={cupColor} />
    </svg>
  );
}

/** Wordmark only, horizontal (nav, footer) */
export function Wordmark({
  title = "Cafe 17",
  color = LOGO.lime,
  ...props
}: SvgProps & { color?: string }) {
  return (
    <svg viewBox="0 -90 262 146" role="img" aria-label={title} {...props}>
      <g transform="rotate(-6 131 0)">
        <path d={WORDMARK_PATH} fill={color} />
        <path d={LOGO.swash} fill={color} />
      </g>
    </svg>
  );
}
