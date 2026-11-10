"use client";

import Image from "next/image";
import { m as motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LOGO, PinCup, Wordmark } from "@/components/brand/Logo";
import { StampLink } from "@/components/ui/bits";
import { range } from "@/components/ui/motion";
import { contourRings } from "@/components/ui/topo";
import { site } from "@/data/site";

/* ───────────────────────── Hero slides (big photography) ───────────────────────── */
export const HERO_SLIDES = [
  {
    src: "/images/hero/burger.webp",
    alt: "A stacked cheeseburger with fries on a dark board",
    label: "On the Highway Burger",
  },
  {
    src: "/images/hero/gumbo.webp",
    alt: "A bowl of shrimp gumbo with a mound of rice",
    label: "Shrimp & sausage gumbo",
  },
  {
    src: "/images/hero/mocktail.webp",
    alt: "A dark berry mocktail with crushed ice and a dried orange wheel",
    label: "Zero-proof, full flavour",
  },
  {
    src: "/images/hero/dessert.webp",
    alt: "A chocolate dessert glass dripping with chocolate sauce",
    label: "Save room for dessert",
  },
];
const SLIDE_SECONDS = 4.5;

/** The pin's artboard (same geometry as the logo). Head centre sits 32.46% down. */
const PIN_BOX = { x: 76, y: 26, w: 148, h: 228 };
const PIN_ASPECT = PIN_BOX.w / PIN_BOX.h;
const HEAD = { x: 150, y: 100, r: 70 };
const ORIGIN_X = (HEAD.x - PIN_BOX.x) / PIN_BOX.w;
const ORIGIN_Y = (HEAD.y - PIN_BOX.y) / PIN_BOX.h;

const PIN_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${PIN_BOX.x} ${PIN_BOX.y} ${PIN_BOX.w} ${PIN_BOX.h}'><path d='${LOGO.pin}' fill='black'/></svg>`,
)}")`;

const RINGS = contourRings({ cx: 800, cy: 520, count: 16, start: 60, step: 54, seed: 1.7, squash: 0.62 });

type Rect = { x: number; y: number; w: number; h: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// Scroll → opacity mappings (function form keeps them on the JS path; see `range`)
const OUTLINE = range([0, 0.08], [1, 0]);
const INTRO_OUT = range([0, 0.15], [1, 0]);
const VEIL = range([0.42, 0.75], [0, 1]);
const TITLE_IN = range([0.52, 0.7], [0, 1]);
const FLANK_OUT = range([0.02, 0.22], [1, 0]);
const easeIn = (t: number) => t * t * t;
const slideDelay = (i: number) => `${i * SLIDE_SECONDS - SLIDE_SECONDS * 0.2}s`;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pinBoxRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [ready, setReady] = useState(false);
  const scaleMax = useMotionValue(8);

  // Measure the pin's on-screen box so the photo mask lines up exactly with the drawn pin
  useEffect(() => {
    const stage = stageRef.current;
    const box = pinBoxRef.current;
    if (!stage || !box) return;
    const measure = () => {
      // offset* values ignore transforms, so scroll-scaling never skews the measurement
      const x = box.offsetLeft + (box.offsetParent as HTMLElement).offsetLeft;
      const y = box.offsetTop + (box.offsetParent as HTMLElement).offsetTop;
      const w = box.offsetWidth;
      const h = box.offsetHeight;
      const cx = x + w * ORIGIN_X;
      const cy = y + h * ORIGIN_Y;
      const headR = (HEAD.r / PIN_BOX.h) * h;
      const W = stage.offsetWidth;
      const H = stage.offsetHeight;
      const far = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy));
      scaleMax.set((far / headR) * 1.08);
      setRect({ x, y, w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(box);
    // Open the pin once the logo has landed (~1.35 s after navigation), never earlier.
    const t = window.setTimeout(() => setReady(true), Math.max(120, 1350 - performance.now()));
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, [scaleMax]);

  /* ── Scroll choreography: transform + opacity only, so it runs on the GPU on phones too ── */
  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const zoom = useTransform(() => 1 + (scaleMax.get() - 1) * easeIn(clamp01(p.get() / 0.62)));
  const photoZoom = useTransform(p, [0, 0.65], [1.2, 1]);
  const counter = useTransform(() => photoZoom.get() / zoom.get());
  const outline = useTransform(p, OUTLINE);
  const introOut = useTransform(p, INTRO_OUT);
  const introY = useTransform(p, [0, 0.2], [0, -60]);
  const mapZoom = useTransform(p, [0, 0.62], [1, 2.2]);
  const veil = useTransform(p, VEIL);
  const titleOpacity = useTransform(p, TITLE_IN);
  const titleY = useTransform(p, [0.5, 0.8], [80, 0]);
  const outroScale = useTransform(p, [0.88, 1], [1, 0.95]);
  const flankL = useTransform(p, [0, 0.25], ["0vw", "-34vw"]);
  const flankR = useTransform(p, [0, 0.25], ["0vw", "34vw"]);
  const flankRotL = useTransform(p, [0, 0.25], [-6, -20]);
  const flankRotR = useTransform(p, [0, 0.25], [5, 18]);
  const flankOpacity = useTransform(p, FLANK_OUT);

  const origin = rect ? `${rect.x + rect.w * ORIGIN_X}px ${rect.y + rect.h * ORIGIN_Y}px` : "50% 40%";
  const isReady = ready && rect !== null;

  return (
    <section ref={sectionRef} id="top" aria-label="Welcome to Cafe 17" className="relative h-[230svh] bg-ink lg:h-[250svh]">
      <motion.div
        ref={stageRef}
        data-ready={isReady ? "true" : "false"}
        style={{ scale: outroScale }}
        className="hero-stage sticky top-0 isolate flex h-[100svh] min-h-[560px] flex-col overflow-hidden bg-ink"
      >
        {/* L0 — the map: ink + contour lines, zooming toward the pin as you scroll */}
        <motion.div aria-hidden style={{ scale: mapZoom, transformOrigin: origin }} className="absolute inset-0 -z-20 will-change-transform">
          <div className="hero-topo absolute inset-0">
            <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-lime/[0.18]" fill="none" stroke="currentColor">
              {RINGS.map((ring, i) => (
                <path key={i} d={ring.d} strokeWidth={ring.major ? 2 : 1.1} opacity={ring.major ? 1 : 0.7} />
              ))}
            </svg>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_25%,var(--color-ink)_80%)]" />
        </motion.div>

        {/* L1 — big photography, seen through the pin, then full-bleed */}
        <motion.div
          aria-hidden
          className="hero-photo absolute inset-0 -z-10 will-change-transform"
          style={{
            scale: zoom,
            transformOrigin: origin,
            WebkitMaskImage: PIN_MASK,
            maskImage: PIN_MASK,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: rect ? `${rect.w}px ${rect.h}px` : "0px 0px",
            maskSize: rect ? `${rect.w}px ${rect.h}px` : "0px 0px",
            WebkitMaskPosition: rect ? `${rect.x}px ${rect.y}px` : "0px 0px",
            maskPosition: rect ? `${rect.x}px ${rect.y}px` : "0px 0px",
          }}
        >
          <motion.div className="absolute inset-0 will-change-transform" style={{ scale: counter, transformOrigin: origin }}>
            {HERO_SLIDES.map((s, i) => (
              <div key={s.src} className="hero-slide absolute inset-0" style={{ animationDelay: slideDelay(i) }}>
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="100vw"
                  preload={i === 0}
                  fetchPriority={i === 0 ? "high" : "low"}
                  className="object-cover"
                />
              </div>
            ))}
            <motion.div
              style={{ opacity: veil }}
              className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_12_9/0.5)_0%,rgb(11_12_9/0.1)_38%,rgb(11_12_9/0.88)_100%)]"
            />
          </motion.div>
        </motion.div>

        {/* Frame labels */}
        <motion.div style={{ opacity: introOut }} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10">
          <div className="hero-frame">
          <div className="absolute left-4 top-[74px] flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/70 sm:left-6 lg:left-10 lg:top-24">
            <svg viewBox="0 0 20 20" className="size-3.5 text-lime" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10" cy="10" r="6" />
              <path d="M10 0v6M10 14v6M0 10h6M14 10h6" />
            </svg>
            <span>{site.coords.lat}</span>
            <span className="hidden sm:inline">· {site.coords.lng}</span>
          </div>
          <div className="absolute right-4 top-[74px] text-right font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/70 sm:right-6 lg:right-10 lg:top-24">
            Est. {site.founded}
            <span className="hidden sm:inline"> · Kochi, Kerala</span>
          </div>
          {/* Now serving — synced with the slideshow */}
          <div className="absolute right-6 top-[100px] hidden h-5 w-80 overflow-hidden md:block lg:right-10 lg:top-[122px]">
            {HERO_SLIDES.map((s, i) => (
              <p
                key={s.label}
                className="hero-cap absolute right-0 top-0 whitespace-nowrap font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/75"
                style={{ animationDelay: slideDelay(i) }}
              >
                <span className="text-lime">Now serving</span> · {s.label}
              </p>
            ))}
          </div>
          </div>
        </motion.div>

        {/* Big photography flanking the pin (tablet + desktop); flies outward as you zoom in */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          <motion.div
            style={{ x: flankL, rotate: flankRotL, opacity: flankOpacity }}
            className="absolute left-[2.5vw] top-[24%] w-[23vw] max-w-[380px] will-change-transform lg:left-[4vw]"
          >
            <figure className="hero-flank-l">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink-3 shadow-[0_40px_80px_rgb(0_0_0/0.6)] ring-1 ring-paper/10">
                <Image src="/images/menu/steak.webp" alt="" fill sizes="25vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              </div>
              <figcaption className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper/70">
                <span className="text-lime">02</span> · Grilled beef tenderloin
              </figcaption>
            </figure>
          </motion.div>
          <motion.div
            style={{ x: flankR, rotate: flankRotR, opacity: flankOpacity }}
            className="absolute right-[2.5vw] top-[17%] w-[20vw] max-w-[330px] will-change-transform lg:right-[4.5vw]"
          >
            <figure className="hero-flank-r">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink-3 shadow-[0_40px_80px_rgb(0_0_0/0.6)] ring-1 ring-paper/10">
                <Image src="/images/menu/wings.webp" alt="" fill sizes="22vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              </div>
              <figcaption className="mt-3 text-right font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper/70">
                Sticky chicken wings · <span className="text-lime">03</span>
              </figcaption>
            </figure>
          </motion.div>
        </div>

        {/* L2 — the logo pin: drops in solid lime, then opens into a window onto the food */}
        <div className="relative flex min-h-0 flex-1 items-end justify-center px-4 pt-[104px] lg:pt-[116px]">
          <div ref={pinBoxRef} className="relative h-full max-h-[620px]" style={{ aspectRatio: `${PIN_ASPECT}` }}>
            <motion.div
              aria-hidden
              className="absolute inset-0 will-change-transform"
              style={{ scale: zoom, originX: ORIGIN_X, originY: ORIGIN_Y }}
            >
            <svg viewBox={`${PIN_BOX.x} ${PIN_BOX.y} ${PIN_BOX.w} ${PIN_BOX.h}`} className="absolute inset-0 h-full w-full overflow-visible">
              <g className="hero-frame">
                <ellipse cx="150" cy="253" rx="28" ry="4.5" fill="#000" opacity="0.75" />
                <ellipse cx="150" cy="253" rx="36" ry="7.5" fill="none" stroke={LOGO.lime} strokeWidth="1" className="ripple" style={{ animationDelay: "1.2s" }} />
                <ellipse cx="150" cy="253" rx="36" ry="7.5" fill="none" stroke={LOGO.lime} strokeWidth="1" className="ripple" style={{ animationDelay: "2.8s" }} />
              </g>
              <g className="hero-pin">
                <g fill="none" stroke="#efe9dc" strokeWidth="3" strokeLinecap="round" opacity="0.55">
                  <path className="steam" style={{ animationDelay: "1.6s" }} d="M136 20 C 128 10, 144 2, 136 -10 C 130 -18, 140 -24, 136 -32" />
                  <path className="steam" style={{ animationDelay: "2.3s" }} d="M150 16 C 142 4, 158 -4, 150 -18 C 144 -28, 156 -34, 150 -44" />
                  <path className="steam" style={{ animationDelay: "2.9s" }} d="M164 20 C 156 10, 172 2, 164 -10 C 158 -18, 168 -24, 164 -32" />
                </g>
                {/* window frame: lime outline + lime cup over the photography */}
                <motion.g style={{ opacity: outline }}>
                  <g className="hero-frame-ring">
                    <path d={LOGO.pin} fill="none" stroke={LOGO.lime} strokeWidth="3.5" strokeLinejoin="round" />
                    <PinCup cupColor={LOGO.lime} />
                  </g>
                </motion.g>
                {/* the solid logo pin — dissolves to reveal the photography */}
                <g className="hero-plug">
                  <path d={LOGO.pin} fill={LOGO.lime} />
                  <PinCup />
                </g>
              </g>
            </svg>
            </motion.div>
          </div>
        </div>

        {/* Wordmark */}
        <motion.div style={{ opacity: introOut, y: introY }} className="relative z-10 flex justify-center">
          <div className="hero-word -mt-[1.6svh] h-[clamp(60px,10.5svh,116px)]">
            <Wordmark className="h-full w-auto" title="Cafe 17" />
          </div>
        </motion.div>

        {/* Copy + CTAs */}
        <motion.div
          style={{ opacity: introOut, y: introY }}
          className="relative z-10 grid gap-4 px-4 pb-7 pt-3 sm:px-6 md:grid-cols-[1fr_auto] md:items-end md:gap-8 lg:px-10 lg:pb-10"
        >
          <div className="max-w-2xl">
            <h1 className="hero-in-1 type-display text-[clamp(1.85rem,5vw,4rem)] uppercase text-paper lg:text-[clamp(2.4rem,3.3vw,3.6rem)]">
              <span className="sr-only">Cafe 17 — </span>
              <span className="whitespace-nowrap">Café &amp; kitchen</span>{" "}
              <span className="whitespace-nowrap">
                <span className="type-script inline-block -rotate-6 pr-[0.12em] text-[0.8em] normal-case text-lime">in</span>
                Ravipuram,
              </span>{" "}
              Kochi
            </h1>
            <p className="hero-in-2 mt-3 hidden max-w-md leading-relaxed text-paper/75 sm:block">
              Burgers stacked high, steaks off the grill, pastas, bowls and long conversations. Dropping pins since{" "}
              {site.founded}.
            </p>
          </div>
          <div className="hero-in-3 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
            <StampLink href="#menu" className="justify-center">
              See the menu
            </StampLink>
            <StampLink href="#visit" variant="ghost" className="justify-center">
              Find the pin
            </StampLink>
          </div>
        </motion.div>

        {/* After the zoom-through: full-bleed title over the photography */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end px-4 pb-[13svh] sm:px-6 lg:px-10 lg:pb-[14svh]"
        >
          <motion.div style={{ y: titleY }}>
            <p className="eyebrow text-lime">Ravipuram · Kochi · Since {site.founded}</p>
            <p className="type-display mt-4 text-[clamp(4rem,15vw,14rem)] uppercase leading-[0.82] text-paper">
              Come hungry.
              <br />
              <span className="text-lime">Stay late.</span>
            </p>
            <p className="type-script mt-3 -rotate-2 text-[clamp(1.8rem,4vw,3.4rem)] text-paper/90">a café on the map</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
