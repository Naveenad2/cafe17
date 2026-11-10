"use client";

import Image from "next/image";
import { m as motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SectionLabel, StampLink } from "@/components/ui/bits";
import { Doodle, range } from "@/components/ui/motion";
import { useFinePointer, useIsDesktop } from "@/hooks/useMedia";
import { site } from "@/data/site";

const EXPO = [0.16, 1, 0.3, 1] as const;

type Polaroid = {
  src: string;
  w: number;
  h: number;
  alt: string;
  caption: string;
  // board position (desktop), % of board
  x: number;
  y: number;
  r: number;
  width: number; // % of board width on desktop
};

const POLAROIDS: Polaroid[] = [
  { src: "/images/feed/onam.webp", w: 562, h: 680, alt: "The Cafe 17 family dressed up for Onam outside the café", caption: "Onam, all of us", x: 1, y: 4, r: -6, width: 16 },
  { src: "/images/feed/birthday-family.webp", w: 562, h: 582, alt: "A family celebrating a birthday at Cafe 17", caption: "birthdays, sorted", x: 19, y: 30, r: 4, width: 15.5 },
  { src: "/images/feed/football-night.webp", w: 560, h: 522, alt: "Fans in football jerseys at a Cafe 17 match night", caption: "match night!", x: 37, y: 3, r: -3, width: 17 },
  { src: "/images/feed/sarath.webp", w: 562, h: 748, alt: "Cafe 17 tribute to Sarath, the café's all-rounder, for 10 years with Cafe 17", caption: "10 years of Sarath", x: 57, y: 22, r: 5, width: 15 },
  { src: "/images/feed/community-meetup.webp", w: 562, h: 582, alt: "A community meetup group at Cafe 17", caption: "strangers → friends", x: 76, y: 3, r: -4, width: 16 },
  { src: "/images/feed/interest-swap.webp", w: 562, h: 650, alt: "Poster for an Interest Swap evening at Cafe 17, Ravipuram", caption: "interest swap", x: 81, y: 50, r: 7, width: 14.5 },
  { src: "/images/feed/birthday-kid.webp", w: 562, h: 582, alt: "A young guest celebrating a Minecraft-themed birthday at Cafe 17", caption: "level up!", x: 3, y: 58, r: 3, width: 15 },
  { src: "/images/feed/sour-candy.webp", w: 498, h: 748, alt: "Cafe 17's layered Sour Candy mocktail", caption: "sour candy season", x: 39, y: 52, r: -7, width: 13 },
  { src: "/images/feed/summer-treats.webp", w: 494, h: 748, alt: "Cafe 17 summer coolers: Gulabi Bliss, Coco Ginger, Sour Candy and Frosty Melon", caption: "summer treats", x: 60, y: 60, r: 3, width: 13 },
];

export function Wall() {
  const boardRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const fine = useFinePointer();
  const zCounter = useRef(POLAROIDS.length);
  const [z, setZ] = useState<Record<number, number>>({});
  const bringToFront = (i: number) => {
    const next = ++zCounter.current;
    setZ((prev) => ({ ...prev, [i]: next }));
  };
  const board = isDesktop && fine;

  // Numeric drag limits per polaroid, measured from layout (offset* ignores transforms).
  // Ref-based constraints get re-applied by Framer on every layout change, which can
  // shove cards off the board when other sections resize; numbers are stable.
  const figRefs = useRef<(HTMLElement | null)[]>([]);
  const [bounds, setBounds] = useState<({ left: number; right: number; top: number; bottom: number } | undefined)[]>([]);
  useEffect(() => {
    const el = boardRef.current;
    if (!board || !el) return;
    const measure = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      setBounds(
        figRefs.current.map((f) =>
          f
            ? {
                left: -f.offsetLeft,
                right: W - f.offsetLeft - f.offsetWidth,
                top: -f.offsetTop,
                bottom: H - f.offsetTop - f.offsetHeight,
              }
            : undefined,
        ),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    figRefs.current.forEach((f) => f && ro.observe(f));
    return () => ro.disconnect();
  }, [board]);

  return (
    <section id="wall" aria-labelledby="wall-title" className="corrugated relative overflow-hidden py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="06">The wall</SectionLabel>
            <h2 id="wall-title" className="mt-8">
              <span className="type-script mb-2 block -rotate-3 text-[clamp(2.2rem,4.6vw,4rem)] text-lime sm:mb-3">life at seventeen</span>
              <span className="type-display block text-[clamp(3.8rem,10vw,9rem)] uppercase text-paper">Pinned to the wall</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-4">
            <p className="max-w-md leading-relaxed text-paper/80">
              Birthdays under the bunting, Onam in our best mundus, match nights in jerseys, and
              Interest Swap evenings where strangers pitch their favourite obsessions. The stuff that sticks.
            </p>
            {board && (
              <p className="mt-4 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-lime">
                <Doodle kind="arrow" className="w-10 rotate-[30deg]" strokeWidth={3} /> Drag the photos around
              </p>
            )}
          </div>
        </div>

        {/* Board (desktop + mouse) / swipe strip (touch, tablet, mobile) */}
        {board ? (
          <div ref={boardRef} className="relative mt-14 h-[min(64vw,820px)] w-full">
            {POLAROIDS.map((p, i) => (
              <motion.figure
                key={p.src}
                ref={(node) => {
                  figRefs.current[i] = node;
                }}
                drag
                dragConstraints={bounds[i] ?? false}
                dragElastic={0.12}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 22 }}
                onPointerDown={() => bringToFront(i)}
                whileHover={{ scale: 1.03, rotate: p.r * 0.4 }}
                whileDrag={{ scale: 1.08, rotate: 0, cursor: "grabbing" }}
                initial={{ opacity: 0, y: -80, rotate: p.r * 2.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: p.r }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.07 }}
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.width}%`, zIndex: z[i] ?? i + 1 }}
                className="absolute cursor-grab touch-none select-none bg-paper p-2.5 pb-3 shadow-[0_22px_45px_rgb(0_0_0/0.45)]"
              >
                <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" aria-hidden />
                <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(min-width: 1600px) 260px, 17vw" draggable={false} className="pointer-events-none h-auto w-full" />
                <figcaption className="type-script mt-2 text-center text-[1.35rem] text-ink/85">{p.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5">
            {POLAROIDS.map((p, i) => (
              <ScrollPolaroid key={p.src} p={p} i={i} />
            ))}
          </div>
        )}

        <WhatsOn />
      </div>
    </section>
  );
}

const FADE_IN = range([0, 0.35], [0, 1]);

/** Touch devices: each polaroid flies in from the side and pins itself as you scroll. */
function ScrollPolaroid({ p, i }: { p: Polaroid; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.62"] });
  const side = i % 2 === 0 ? -1 : 1;
  const x = useTransform(scrollYProgress, [0, 1], [`${side * 70}%`, "0%"]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [side * 32, p.r * 0.7]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.78, 1]);
  const opacity = useTransform(scrollYProgress, FADE_IN);
  return (
    <motion.figure
      ref={ref}
      style={{ x, y, rotate, scale, opacity }}
      className={`relative bg-paper p-2 pb-2.5 shadow-[0_18px_36px_rgb(0_0_0/0.4)] will-change-transform ${i % 2 === 1 ? "mt-14" : ""}`}
    >
      <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" aria-hidden />
      <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(min-width: 640px) 32vw, 48vw" className="h-auto w-full" />
      <figcaption className="type-script mt-1.5 text-center text-[1.15rem] text-ink/85">{p.caption}</figcaption>
    </motion.figure>
  );
}

const EVENTS = [
  {
    kicker: "Community",
    title: "Interest Swap evenings",
    text: "Pitch a movie, show, book, hobby, place or artist you think more people should know about. Five to seven minutes each. No expertise needed, just curiosity.",
  },
  {
    kicker: "Every big game",
    title: "Match nights",
    text: "League football on a screen on each floor, a room full of jerseys, and mocktails for the nervous minutes.",
  },
  {
    kicker: "Your occasion",
    title: "Celebrations",
    text: "Birthdays, team lunches, farewells and festival get-togethers. Our open first floor fits the whole crew.",
  },
];

function WhatsOn() {
  return (
    <div className="mt-20 lg:mt-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h3 className="type-display text-[clamp(2.6rem,5vw,4.5rem)] uppercase text-paper">
          What&apos;s on <span className="type-script normal-case text-lime">at 17</span>
        </h3>
        <StampLink href={site.links.instagram} external variant="paper">
          Follow {site.links.instagramHandle}
        </StampLink>
      </div>
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {EVENTS.map((e, i) => (
          <motion.li
            key={e.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, ease: EXPO, delay: i * 0.08 }}
            className="ticket group relative bg-ink/85 px-7 py-7 text-paper transition-colors duration-500 hover:bg-ink"
          >
            <p className="eyebrow text-lime">{e.kicker}</p>
            <h4 className="type-display mt-3 text-[2.2rem] uppercase">{e.title}</h4>
            <p className="mt-3 text-[0.94rem] leading-relaxed text-paper/70">{e.text}</p>
            <div aria-hidden className="mt-6 border-t border-dashed border-paper/20 pt-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/60">
              Admit one · Ravipuram
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
