"use client";

import Image from "next/image";
import { m as motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { SectionLabel } from "@/components/ui/bits";
import { Doodle, ScrollWords, VelocityMarquee } from "@/components/ui/motion";
import { site } from "@/data/site";

const EXPO = [0.16, 1, 0.3, 1] as const;

export function Ribbon() {
  const words = ["Burgers", "Steaks", "Pasta", "BOWLR bowls", "Mocktails", "Filter coffee", "Desserts", "Match nights"];
  return (
    <div aria-hidden className="relative z-10 -my-10 overflow-x-clip py-4">
      <div className="-mx-[3%] -rotate-[2.2deg] overflow-hidden bg-lime py-3 text-ink shadow-[0_20px_40px_rgb(0_0_0/0.35)] sm:py-4">
      <VelocityMarquee baseVelocity={-2.2} gap="gap-8">
        {words.map((w) => (
          <span key={w} className="flex items-center gap-8">
            <span className="type-display text-[clamp(1.6rem,3.4vw,2.8rem)] uppercase">{w}</span>
            <LogoMark className="h-7 w-auto sm:h-9" color="#0b0c09" cupColor="#A9CC3B" />
          </span>
        ))}
      </VelocityMarquee>
      </div>
    </div>
  );
}

export function Story() {
  return (
    <section id="story" aria-labelledby="story-title" className="relative overflow-hidden bg-ink pb-24 pt-28 sm:pt-32 lg:pb-36 lg:pt-44">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <SectionLabel index="01">The story</SectionLabel>
        <h2 id="story-title" className="sr-only">
          The story of Cafe 17, Kochi
        </h2>

        <div className="mt-10 grid gap-16 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <ScrollWords
              className="text-[clamp(1.55rem,3.3vw,3.1rem)] font-medium leading-[1.14] tracking-[-0.025em] text-paper"
              highlight={["pin", "Ravipuram", "conversation"]}
              text="In November 2014 we dropped a pin on Kaloor–Kadavanthra Road: burgers, board games, a wall of books and chalk doodles everywhere. Five years later the pin found a second home, a brightly-lit two-storey café on R. Madhavan Nair Road, Ravipuram. More than a decade on, people still come for the steak and stay for the conversation."
            />

            <div className="relative mt-16 grid grid-cols-2 gap-4 sm:gap-8 lg:mt-24 lg:max-w-2xl">
              <Snapshot
                src="/images/feed/decade-note.webp"
                alt="Cafe 17 post: almost a decade later, and we're still part of someone's fond memories"
                w={560}
                h={306}
                rotate={-3}
                caption="still someone's fond memory"
              />
              <Snapshot
                src="/images/feed/the-origin.webp"
                alt="Cafe 17 'The Origin' illustration: a pin on a world map over a serving cloche"
                w={562}
                h={500}
                rotate={4}
                caption="where it all began"
                className="mt-10"
              />
              <Doodle kind="arrow" className="absolute -top-16 left-[38%] hidden w-28 -rotate-12 text-lime sm:block" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Receipt />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Snapshot({
  src,
  alt,
  w,
  h,
  rotate,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  rotate: number;
  caption: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [rotate > 0 ? 70 : 30, rotate > 0 ? -70 : -30]);
  const spin = useTransform(scrollYProgress, [0, 1], [-rotate * 0.6, rotate * 0.6]);
  return (
    <motion.div ref={ref} style={{ y, rotate: spin }} className={`will-change-transform ${className}`}>
    <motion.figure
      className="relative bg-paper p-2 pb-3 shadow-[0_24px_50px_rgb(0_0_0/0.5)] sm:p-3 sm:pb-4"
      initial={{ opacity: 0, y: 60, rotate: rotate * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.1, ease: EXPO }}
    >
      <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg]" aria-hidden />
      <Image src={src} alt={alt} width={w} height={h} sizes="(min-width: 1024px) 320px, 45vw" className="h-auto w-full" />
      <figcaption className="type-script mt-2 text-center text-[clamp(1rem,2.2vw,1.35rem)] text-ink/80">{caption}</figcaption>
    </motion.figure>
    </motion.div>
  );
}

const RECEIPT_LINES: [string, string, string][] = [
  ["1", "Pin dropped, Kaloor", "2014"],
  ["1", "Second home, Ravipuram", "2019"],
  ["2", "Floors of good seating", "02"],
  ["1", "Harry Potter corner", "01"],
  ["2", "Match-night screens", "02"],
  ["∞", "Refills of conversation", "∞"],
];

function Receipt() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[400px]">
      {/* printer slot */}
      <div className="relative z-10 mx-[-14px] flex h-11 items-center justify-between rounded-[3px] bg-ink-3 px-4 shadow-[inset_0_-6px_0_rgb(0_0_0/0.45),0_10px_30px_rgb(0_0_0/0.4)] ring-1 ring-paper/10">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-paper/60">Table 17 · Printer</span>
        <span className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-lime">
          <span className={`size-1.5 rounded-full bg-lime ${inView ? "animate-pulse" : ""}`} />
          {inView ? "Printed" : "Ready"}
        </span>
        <span className="absolute inset-x-4 -bottom-[3px] h-[5px] rounded-full bg-black" />
      </div>

      <div className="relative -mt-1 overflow-hidden px-1 pb-8">
        <motion.div
          className="receipt-edge origin-top rotate-[1.2deg] bg-paper px-6 pb-10 pt-9 font-mono text-[0.74rem] leading-relaxed text-ink shadow-[0_30px_60px_rgb(0_0_0/0.45)] sm:px-8 sm:text-[0.8rem]"
          initial={{ y: "-101%" }}
          animate={inView ? { y: "0%" } : undefined}
          transition={{ duration: 2.4, ease: [0.45, 0.05, 0.25, 1] }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <LogoMark className="h-9 w-auto" color="#0b0c09" cupColor="#efe9dc" />
              <Wordmark className="h-9 w-auto" color="#0b0c09" />
            </div>
            <p className="uppercase tracking-[0.12em] text-ink/70">
              {site.address.line1}
              <br />
              R. Madhavan Nair Rd, Ravipuram
              <br />
              Kochi {site.address.postalCode}
            </p>
          </div>

          <Rule />
          <div className="flex justify-between uppercase">
            <span>Table 17</span>
            <span>Guest: You</span>
          </div>
          <Rule />

          <ul className="space-y-1.5">
            {RECEIPT_LINES.map(([qty, item, val], i) => (
              <motion.li
                key={item}
                className="grid grid-cols-[1.5rem_1fr_auto] gap-2"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.01, delay: 0.9 + i * 0.18 }}
              >
                <span>{qty}</span>
                <span className="truncate">{item}</span>
                <span className="font-medium">{val}</span>
              </motion.li>
            ))}
          </ul>

          <Rule />
          <div className="space-y-1.5 uppercase">
            <div className="flex justify-between">
              <span>Google rating</span>
              <span>4.5 ★</span>
            </div>
            <div className="flex justify-between">
              <span>Reviews</span>
              <span>1,900+</span>
            </div>
          </div>
          <Rule double />
          <div className="flex items-end justify-between">
            <span className="text-[0.9rem] font-medium uppercase tracking-[0.1em]">Total</span>
            <span className="type-script -rotate-3 text-[2rem] text-ink">good times</span>
          </div>
          <Rule />
          <p className="text-center uppercase tracking-[0.18em]">★ Thank you · Come again ★</p>
          <Barcode />
          <p className="mt-2 text-center text-[0.65rem] tracking-[0.12em] text-ink/70">
            {site.coords.lat} {site.coords.lng}
          </p>
        </motion.div>
      </div>
      <Doodle kind="star" className="absolute -right-2 top-24 hidden w-10 text-lime sm:block lg:-right-8" />
    </div>
  );
}

function Rule({ double = false }: { double?: boolean }) {
  return (
    <div aria-hidden className={`my-4 border-t ${double ? "border-double border-t-[4px]" : "border-dashed"} border-ink/40`} />
  );
}

// Deterministic bar layout, computed once at module load.
const BARS = (() => {
  const widths = "21312113221312311213213121133121231131221".split("").map(Number);
  const out: { x: number; w: number }[] = [];
  let x = 0;
  widths.forEach((w, i) => {
    if (i % 2 === 0) out.push({ x, w: w * 1.6 });
    x += w * 1.6;
  });
  return { bars: out, total: x };
})();

function Barcode() {
  return (
    <svg aria-hidden viewBox={`0 0 ${BARS.total} 44`} className="mx-auto mt-5 h-11 w-[78%]" preserveAspectRatio="none">
      {BARS.bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={44} fill="#0b0c09" />
      ))}
    </svg>
  );
}
