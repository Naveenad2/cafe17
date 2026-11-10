"use client";

import Image from "next/image";
import {
  AnimatePresence,
  m as motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/bits";

const EXPO = [0.16, 1, 0.3, 1] as const;

const PANELS = [
  { src: "/images/feed/plants-corner.webp", alt: "A plant-filled window corner inside Cafe 17", title: "Window seats", text: "Wide glass looking out at the old trees on R. Madhavan Nair Road. Best seat on a rainy afternoon." },
  { src: "/images/feed/shelf.webp", alt: "Shelves with books, a heart frame and a vintage radio", title: "The shelf", text: "Books, curios and a vintage radio. Borrow a chapter with your coffee." },
  { src: "/images/feed/kids-interior.webp", alt: "Kids running across the ground floor at Cafe 17", title: "Ground floor", text: "Cosy seating for long lunches, first dates and catch-ups that run over." },
  { src: "/images/feed/tea-glass.webp", alt: "Tea in a glass cup", title: "Chai o'clock", text: "Tea in a glass, the way Kochi likes it. Pairs well with nowhere to be." },
  { src: "/images/feed/dessert.webp", alt: "A layered dessert slice from the Cafe 17 counter", title: "Dessert counter", text: "Pastries, cakes and ice-cream cups, right where you can't miss them on the way out." },
  { src: "/images/feed/signboard.webp", alt: "The round Cafe 17 signboard among green trees", title: "Look for the sign", text: "The round sign among the trees outside CT Tower, Ravipuram. You've arrived." },
  { src: "/images/feed/sunset-cooler.webp", alt: "An orange cooler glowing in warm light", title: "Golden hour", text: "Big windows, warm light and a cold cooler. 5 pm hits different here." },
  { src: "/images/feed/alfredo.webp", alt: "Creamy alfredo pasta with grilled garlic bread", title: "From the kitchen", text: "Sauces made from scratch, garlic bread on the side, no shortcuts." },
  { src: "/images/feed/ice-cream.webp", alt: "Cafe 17 ice cream cups", title: "Scoops", text: "Filter kaapi with chocolate shards, or Horlicks with chocolate sauce. Why not both?" },
  { src: "/images/feed/orange-cooler.webp", alt: "A hand holding a fresh orange cooler", title: "Zero-proof bar", text: "Coolers and mocktails shaken to order. We're proudly alcohol-free." },
  { src: "/images/feed/nachos.webp", alt: "A bowl of loaded nachos", title: "Sharing plates", text: "Order for the table. Everyone picks at it anyway." },
  { src: "/images/feed/gumbo.webp", alt: "Shrimp and sausage gumbo with rice", title: "The real deal", text: "Shrimp & sausage gumbo, a house signature for the brave and the hungry." },
];

const N = PANELS.length;
const STEP = 360 / N;

const FACTS = [
  ["02", "floors"],
  ["2,700", "sq ft"],
  ["01", "Harry Potter corner"],
  ["02", "match screens"],
] as const;

export function Space() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const spin = useTransform(p, [0.04, 0.96], [0, -(360 - STEP)]);
  const tilt = useTransform(p, [0, 0.5, 1], [-11, -4, -8]);
  const lift = useTransform(p, [0, 0.08], [0.82, 1]);
  const [active, setActive] = useState(0);

  // Panel width drives ring radius + perspective (measured so it tracks the CSS clamp)
  const ringRef = useRef<HTMLDivElement>(null);
  const pw = useMotionValue(200);
  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    const measure = () => pw.set(el.offsetWidth || 200);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pw]);

  useMotionValueEvent(spin, "change", (deg) => {
    const i = Math.min(N - 1, Math.max(0, Math.round(-deg / STEP)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const panel = PANELS[active];

  return (
    <section ref={ref} id="space" aria-labelledby="space-title" className="relative h-[300svh] bg-ink lg:h-[340svh]">
      <div className="chalkboard sticky top-0 flex h-[100svh] min-h-[600px] flex-col overflow-hidden">
        {/* glow + floor shadow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_52%,rgb(169_204_59/0.14),transparent_55%)]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[72%] h-[16%] w-[90%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgb(0_0_0/0.65),transparent_70%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] items-end justify-between gap-6 px-4 pt-24 sm:px-6 lg:px-10 lg:pt-28">
          <div>
            <SectionLabel index="05">The space</SectionLabel>
            <h2 id="space-title" className="type-display mt-4 text-[clamp(2.6rem,7vw,6.5rem)] uppercase text-paper lg:mt-6">
              Two floors, <span className="text-lime">one pin</span>
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm leading-relaxed text-paper/70 md:block">
            Designed by Ahanas Design 4 Space: handmade cement masonry that plays with the light, a black-and-glass
            facade framing the big trees, and a long table under the stairs everyone asks for.
          </p>
        </div>

        {/* The ring — every panel gets its own full 3D transform (no preserve-3d),
            so it renders identically in Safari, Chrome and Firefox, on GPU layers. */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center [--pw:clamp(124px,min(19vw,21svh),260px)]">
          <motion.div ref={ringRef} style={{ scale: lift }} className="relative -mt-[4svh] h-[calc(var(--pw)*1.28)] w-[var(--pw)]">
            {PANELS.map((pnl, i) => (
              <Panel key={pnl.src} index={i} spin={spin} tilt={tilt} pw={pw} src={pnl.src} alt={pnl.alt} title={pnl.title} />
            ))}
          </motion.div>
          <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.62rem] uppercase tracking-[0.24em] text-paper/60">
            Scroll to look around
          </p>
        </div>

        {/* Caption for the panel facing you */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1600px] gap-5 px-4 pb-7 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-10 lg:pb-10">
          <div className="min-h-[104px]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EXPO }}
              >
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-lime">
                  {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                </p>
                <h3 className="type-display mt-1 text-[clamp(2rem,4vw,3.4rem)] uppercase text-paper">{panel.title}</h3>
                <p className="mt-1 max-w-md text-[0.95rem] leading-relaxed text-paper/75">{panel.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <dl className="grid grid-cols-4 gap-2 sm:gap-3">
            {FACTS.map(([n, label]) => (
              <div key={label} className="border border-paper/15 px-2.5 py-2 sm:px-3">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="type-display block text-[clamp(1.4rem,2.6vw,2.2rem)] text-lime">{n}</span>
                  <span className="mt-0.5 block font-mono text-[0.56rem] uppercase leading-tight tracking-[0.12em] text-paper/65">
                    {label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Panel({
  index,
  spin,
  tilt,
  pw,
  src,
  alt,
  title,
}: {
  index: number;
  spin: MotionValue<number>;
  tilt: MotionValue<number>;
  pw: MotionValue<number>;
  src: string;
  alt: string;
  title: string;
}) {
  const angle = useTransform(() => index * STEP + spin.get());
  const transform = useTransform(
    () =>
      `perspective(${pw.get() * 7.2}px) rotateX(${tilt.get()}deg) rotateY(${angle.get()}deg) translateZ(${pw.get() * 2.1}px)`,
  );
  // Facing factor: 1 = facing you, 0 = side-on, <0 = facing away (hidden)
  const facing = useTransform(() => Math.cos((angle.get() * Math.PI) / 180));
  const opacity = useTransform(() => (facing.get() > 0.02 ? 1 : 0));
  const zIndex = useTransform(() => Math.round(facing.get() * 100) + 100);
  const shade = useTransform(() => 0.75 * (1 - Math.max(0, facing.get())));
  return (
    <motion.figure
      className="absolute inset-0 bg-paper p-1.5 pb-6 shadow-[0_20px_40px_rgb(0_0_0/0.5)] will-change-transform sm:p-2 sm:pb-7"
      style={{ transform, opacity, zIndex }}
    >
      <div className="relative h-full w-full overflow-hidden bg-ink">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 420px, 280px" className="object-cover" />
      </div>
      <figcaption className="type-script absolute inset-x-0 bottom-1 truncate px-2 text-center text-[clamp(0.85rem,1.4vw,1.15rem)] text-ink/85">
        {title}
      </figcaption>
      <motion.span aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-ink" />
    </motion.figure>
  );
}
