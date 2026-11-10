"use client";

import Image from "next/image";
import { m as motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { SectionLabel, StampLink } from "@/components/ui/bits";
import { site } from "@/data/site";

const BOWLS = [
  { name: "Katsu Bowl", note: "crumbed · crunchy" },
  { name: "Cajun Paneer", note: "veg · spiced" },
  { name: "Schezwan Momo", note: "fiery · saucy" },
  { name: "Egg & Chicken Protein", note: "gym-approved" },
  { name: "Chop Suey", note: "sweet · sour" },
];

const EXPO = [0.16, 1, 0.3, 1] as const;

export function Bowlr() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const spin = useTransform(scrollYProgress, [0, 1], [-70, 110]);
  const drift = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      ref={ref}
      id="bowlr"
      aria-labelledby="bowlr-title"
      className="relative overflow-hidden bg-lime py-24 text-ink sm:py-28 lg:py-36"
    >
      {/* dotted delivery route */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-ink/15" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M-5 80 C 20 60, 30 95, 55 70 S 85 30, 105 40" fill="none" stroke="currentColor" strokeWidth="0.35" strokeDasharray="1 1.6" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <SectionLabel index="04" tone="dark">
          Delivery kitchen
        </SectionLabel>

        <motion.h2
          id="bowlr-title"
          style={{ x: drift }}
          className="type-display mt-8 flex select-none items-center justify-center whitespace-nowrap text-[clamp(5.5rem,24vw,23rem)] uppercase leading-[0.8]"
        >
          <span className="sr-only">BOWLR by Cafe17 — rice bowls delivered in Kochi</span>
          <span aria-hidden>B</span>
          <span aria-hidden className="relative mx-[0.02em] inline-block h-[0.74em] w-[0.74em] translate-y-[-0.02em]">
            <motion.span style={{ rotate: spin }} className="absolute inset-0 overflow-hidden rounded-full ring-[0.06em] ring-ink">
              <Image
                src="/images/feed/bowls-overhead.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, 30vw"
                className="scale-[1.25] object-cover"
              />
            </motion.span>
          </span>
          <span aria-hidden>WLR</span>
        </motion.h2>

        <div className="mt-2 flex items-center justify-center gap-3">
          <span className="type-script text-[clamp(1.8rem,3.4vw,3rem)]">by</span>
          <Wordmark className="h-[clamp(2.6rem,5vw,4.5rem)] w-auto" color="#0b0c09" title="Cafe17" />
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="text-[clamp(1.25rem,2vw,1.6rem)] font-medium leading-snug tracking-[-0.01em]">
              Every bowl is built for balance: fresh ingredients, proper comfort and real satisfaction in
              every bite. Lunch at your desk or dinner on the couch, from the Cafe 17 kitchen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <StampLink href={site.links.bowlrSwiggy} external variant="ink">
                Order on Swiggy
              </StampLink>
              <StampLink href={site.links.bowlrZomato} external variant="ink">
                Order on Zomato
              </StampLink>
            </div>
            <a
              href={site.phone.primaryHref}
              className="mt-6 inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.12em] underline decoration-ink/30 underline-offset-[6px] transition-colors hover:decoration-ink"
            >
              Direct orders · {site.phone.primary}
            </a>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7 lg:pl-8">
            {BOWLS.map((b, i) => (
              <motion.li
                key={b.name}
                initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2.5 : -2.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1 : -1 }}
                whileHover={{ rotate: 0, y: -4 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, ease: EXPO, delay: i * 0.07 }}
                className={`flex items-center justify-between gap-4 border-2 border-ink bg-lime px-5 py-4 shadow-[5px_5px_0_var(--color-ink)] ${
                  i === BOWLS.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                <div>
                  <p className="type-display text-[clamp(1.6rem,2.4vw,2.1rem)] uppercase">{b.name}</p>
                  <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink/65">{b.note}</p>
                </div>
                <span className="font-mono text-xs text-ink/65">0{i + 1}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
