"use client";

import Image from "next/image";
import {
  m as motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SectionLabel, StampLink } from "@/components/ui/bits";
import { Doodle } from "@/components/ui/motion";

const DISHES = [
  {
    script: "On the",
    name: "Highway Burger",
    desc: "Beef patty, salami, a fried egg, onion rings, lettuce and cheese. Big enough to need a plan.",
    img: "/images/menu/burger.webp",
    alt: "A towering cheeseburger with lettuce and tomato",
    tag: "Since day one",
  },
  {
    script: "Grilled",
    name: "Beef Tenderloin",
    desc: "Pepper or mushroom sauce made from scratch, with creamy mash and grilled vegetables.",
    img: "/images/menu/steak.webp",
    alt: "Sliced grilled beef steak with asparagus on a skillet",
    tag: "From the grill",
  },
  {
    script: "Pasta",
    name: "Nduja",
    desc: "Fiery Calabrian-style sausage melted into a rich tomato sauce. A regulars' favourite.",
    img: "/images/menu/pasta.webp",
    alt: "Penne in a spicy red sauce",
    tag: "Spicy",
  },
  {
    script: "Pineapple & Jalapeño",
    name: "Margarita",
    desc: "Zero-proof, with a chilli-salt rim, pineapple and a jalapeño slice. Sweet, savoury, a little fiery.",
    img: "/images/menu/mocktail.webp",
    alt: "A bright mocktail in a coupe glass with a lime wheel",
    tag: "Alcohol-free",
  },
  {
    script: "Death by",
    name: "Chocolate",
    desc: "Four layers deep. Proceed with a spoon and no regrets.",
    img: "/images/menu/chocolate-cake.webp",
    alt: "A chocolate layer cake topped with chocolate swirls",
    tag: "Dessert counter",
  },
  {
    script: "Bruschetta &",
    name: "Croquettes",
    desc: "Tomato-basil bruschetta and crunchy beef croquettes: how most good evenings here begin.",
    img: "/images/menu/bruschetta.webp",
    alt: "Tomato and basil bruschetta on a board",
    tag: "To share",
  },
];

export function Signatures() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [current, setCurrent] = useState(1);

  // Pinned horizontal scroll on every device: vertical scrolling drives the track sideways.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.offsetWidth - document.documentElement.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distance);
  const velocity = useVelocity(scrollYProgress);
  const skew = useSpring(useTransform(velocity, [-1.2, 0, 1.2], [4, 0, -4], { clamp: true }), {
    stiffness: 260,
    damping: 40,
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(DISHES.length, Math.max(1, Math.round(p * (DISHES.length - 1)) + 1));
    setCurrent((c) => (c === next ? c : next));
  });

  return (
    <section
      ref={sectionRef}
      id="signatures"
      aria-labelledby="signatures-title"
      className="relative bg-ink-2"
      style={{ height: distance ? `calc(100svh + ${distance}px)` : undefined }}
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[560px] items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max flex-row items-center gap-5 pl-4 pr-[10vw] will-change-transform sm:gap-8 sm:pl-6 lg:gap-14 lg:pl-10"
        >
          <header className="w-[82vw] shrink-0 pr-4 sm:w-[56vw] lg:w-[min(34vw,520px)] lg:pr-0">
            <SectionLabel index="02">Signatures</SectionLabel>
            <h2 id="signatures-title" className="mt-6 sm:mt-8">
              <span className="type-script mb-2 block -rotate-3 text-[clamp(2.4rem,5vw,4.5rem)] text-lime sm:mb-3">the usual</span>
              <span className="type-display block text-[clamp(4.2rem,10vw,9.5rem)] uppercase text-paper">Suspects</span>
            </h2>
            <p className="mt-5 max-w-sm text-paper/70 sm:mt-6">
              The dishes regulars order without opening the menu. Six plates and a glass that have kept Kochi coming
              back for over a decade.
            </p>
            <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
              <span>Keep scrolling</span>
              <span className="h-px w-16 bg-paper/25" />
              <span className="text-lime">→</span>
            </div>
          </header>

          <motion.div style={{ skewX: skew }} className="flex items-center gap-5 sm:gap-8 lg:gap-10">
            {DISHES.map((d, i) => (
              <DishCard key={d.name} dish={d} index={i} drift={drift} />
            ))}
            <div className="flex w-[70vw] shrink-0 flex-col justify-center gap-6 sm:w-[40vw] lg:w-[24vw]">
              <p className="type-display text-[clamp(2.5rem,4.5vw,4.5rem)] uppercase text-paper">
                That&apos;s just <span className="type-script normal-case text-lime">the trailer.</span>
              </p>
              <div>
                <StampLink href="#menu">Full menu</StampLink>
              </div>
              <Doodle kind="loop" className="w-40 text-lime/70" />
            </div>
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-4 bottom-6 flex items-center gap-4 sm:inset-x-6 lg:inset-x-10 lg:bottom-8 lg:gap-6">
          <span className="font-mono text-xs tabular-nums text-paper/65">
            {String(current).padStart(2, "0")} / {String(DISHES.length).padStart(2, "0")}
          </span>
          <div className="relative h-px flex-1 bg-paper/15">
            <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-lime" />
          </div>
        </div>
      </div>
    </section>
  );
}

function DishCard({
  dish,
  index,
  drift,
}: {
  dish: (typeof DISHES)[number];
  index: number;
  drift: MotionValue<string>;
}) {
  return (
    <article className="group relative flex w-[74vw] shrink-0 flex-col sm:w-[42vw] lg:h-[74vh] lg:w-[min(28vw,440px)]">
      <div className="relative h-[min(46svh,92vw)] overflow-hidden bg-ink-3 sm:h-[46svh] lg:h-auto lg:flex-1">
        {/* image drifts against the track for a window-parallax feel */}
        <motion.div style={{ x: drift }} className="absolute -inset-x-[12%] inset-y-0 will-change-transform">
          <Image
            src={dish.img}
            alt={dish.alt}
            fill
            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 90vw"
            className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.06]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <span className="absolute left-0 top-0 bg-lime px-3 py-2 font-mono text-xs font-medium text-ink">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="ticket absolute right-3 top-3 bg-paper px-5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink">
          {dish.tag}
        </span>
      </div>
      <div className="relative pt-4 sm:pt-5">
        <p className="type-script -rotate-2 text-[clamp(1.5rem,2.4vw,2.2rem)] text-lime">{dish.script}</p>
        <h3 className="type-display mt-1 text-[clamp(2.2rem,3.6vw,3.6rem)] uppercase text-paper">{dish.name}</h3>
        <p className="mt-2 max-w-sm text-[0.9rem] leading-relaxed text-paper/70 sm:mt-3">{dish.desc}</p>
      </div>
    </article>
  );
}
