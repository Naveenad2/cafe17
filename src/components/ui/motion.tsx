"use client";

import {
  m as motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useRef } from "react";

const EXPO = [0.16, 1, 0.3, 1] as const;

/** Fade + rise when scrolled into view (once). */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span" | "header";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EXPO, delay }}
    >
      {children}
    </Comp>
  );
}

/**
 * Masked line-by-line headline reveal. Pass an array of lines; each slides up
 * from behind its own mask. Works for display type at any size.
 */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
          <motion.span
            className={`block will-change-transform ${lineClassName ?? ""}`}
            initial={{ y: "110%", rotate: 2 }}
            animate={inView ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1.05, ease: EXPO, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Scroll-scrubbed paragraph: words light up as you read down the page. */
export function ScrollWords({
  text,
  className,
  highlight = [],
}: {
  text: string;
  className?: string;
  highlight?: string[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const clean = word.replace(/[.,—–;:!?]/g, "");
        const isHi = highlight.includes(clean);
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            highlight={isHi}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
}) {
  // 0.4 keeps unread words above the WCAG 3:1 large-text contrast floor
  const opacity = useTransform(progress, range, [0.4, 1]);
  const color = useTransform(progress, range, ["#efe9dc", "#a9cc3b"]);
  return (
    <>
      <motion.span style={highlight ? { opacity, color } : { opacity }}>
        {children}
      </motion.span>{" "}
    </>
  );
}

/** Self-drawing hand-made doodles (chalk-wall energy). */
export const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.1, ease: EXPO, delay: 0.2 + i * 0.15 },
      opacity: { duration: 0.01, delay: 0.2 + i * 0.15 },
    },
  }),
};

export function Doodle({
  kind,
  className,
  strokeWidth = 2.5,
}: {
  kind: "arrow" | "star" | "underline" | "circle" | "loop" | "spark";
  className?: string;
  strokeWidth?: number;
}) {
  const paths: Record<typeof kind, { viewBox: string; d: string[] }> = {
    arrow: {
      viewBox: "0 0 120 80",
      d: ["M6 14 C 30 70, 70 74, 104 50", "M88 40 L 106 49 L 92 64"],
    },
    star: {
      viewBox: "0 0 60 60",
      d: ["M30 4 L 35 24 L 56 30 L 35 36 L 30 56 L 25 36 L 4 30 L 25 24 Z"],
    },
    underline: {
      viewBox: "0 0 300 24",
      d: ["M4 16 C 60 6, 120 4, 170 10 S 260 20, 296 8"],
    },
    circle: {
      viewBox: "0 0 220 100",
      d: ["M150 12 C 80 -2, 8 18, 10 52 C 12 86, 120 98, 186 78 C 230 62, 214 22, 132 14"],
    },
    loop: {
      viewBox: "0 0 160 60",
      d: ["M4 40 C 30 40, 40 8, 64 12 C 88 16, 70 52, 52 44 C 34 36, 70 10, 100 24 C 120 34, 136 40, 156 22"],
    },
    spark: {
      viewBox: "0 0 60 60",
      d: ["M30 6 L 30 20", "M30 40 L 30 54", "M6 30 L 20 30", "M40 30 L 54 30", "M13 13 L 22 22", "M38 38 L 47 47", "M47 13 L 38 22", "M22 38 L 13 47"],
    },
  };
  const p = paths[kind];
  return (
    <motion.svg
      viewBox={p.viewBox}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {p.d.map((d, i) => (
        <motion.path key={i} d={d} variants={drawVariants} custom={i} />
      ))}
    </motion.svg>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * Marquee that reacts to scrolling: it speeds up with scroll velocity and flips
 * direction when you scroll back up. Works with touch scrolling on phones/tablets.
 */
export function VelocityMarquee({
  children,
  baseVelocity = -2,
  className = "",
  gap = "gap-5",
}: {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
  gap?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "120px 0px" });
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1200, 0, 1200], [-5, 0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!inView || reduce) return;
    let moveBy = direction.current * baseVelocity * (Math.min(delta, 64) / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ x }} className="flex w-max will-change-transform">
        <div className={`flex shrink-0 items-center ${gap} pr-5`}>{children}</div>
        <div className={`flex shrink-0 items-center ${gap} pr-5`} aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Linear, clamped mapping as a plain function. Passing a function to useTransform
 * keeps the value on Framer's JS path: Framer would otherwise hand scroll-linked
 * opacity to a native ViewTimeline, which maps tall pinned sections incorrectly.
 */
export const range =
  (input: [number, number], output: [number, number]) =>
  (v: number) => {
    const t = Math.min(1, Math.max(0, (v - input[0]) / (input[1] - input[0])));
    return output[0] + (output[1] - output[0]) * t;
  };
