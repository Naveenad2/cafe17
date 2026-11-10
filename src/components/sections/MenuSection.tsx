"use client";

import Image from "next/image";
import { m as motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { DietMark, SectionLabel, StampLink } from "@/components/ui/bits";
import { MaskLines } from "@/components/ui/motion";
import { menu, tagLabels, type MenuItem, type Tag } from "@/data/menu";
import { site } from "@/data/site";

const EXPO = [0.16, 1, 0.3, 1] as const;

export function MenuSection() {
  const [activeId, setActiveId] = useState(menu[0].id);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set([menu[0].id, menu[1].id]));
  const [vegOnly, setVegOnly] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: frameP } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const frameY = useTransform(frameP, [0, 1], ["-7%", "7%"]);

  const activeIndex = menu.findIndex((c) => c.id === activeId);
  const active = menu[activeIndex];

  const select = (id: string, focus = false) => {
    if (id === activeId) return;
    const idx = menu.findIndex((c) => c.id === id);
    setPrevId(activeId);
    setActiveId(id);
    setVisited((v) => {
      const next = new Set(v);
      next.add(id);
      if (menu[idx + 1]) next.add(menu[idx + 1].id);
      return next;
    });
    const tab = tabRefs.current[id];
    const rail = railRef.current;
    if (tab && rail && rail.scrollWidth > rail.clientWidth) {
      rail.scrollTo({ left: tab.offsetLeft - rail.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
    }
    if (focus) tab?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = menu[(activeIndex + dir + menu.length) % menu.length];
    select(next.id, true);
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="paper-texture relative overflow-hidden py-24 text-ink sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="03" tone="dark">
              The menu
            </SectionLabel>
            <h2 id="menu-title" className="mt-8">
              <MaskLines
                lines={[
                  <span key="a" className="type-display block text-[clamp(4.6rem,14vw,12.5rem)] uppercase">
                    The Menu
                  </span>,
                ]}
              />
              <span className="type-script -mt-2 block -rotate-3 pl-2 text-[clamp(2rem,4.4vw,3.8rem)] text-teal-2 sm:-mt-4">
                eat, drink &amp; stay a while
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-4">
            <p className="max-w-md text-[0.98rem] leading-relaxed text-ink/75">
              Continental comfort with a Kochi soul: burgers, steaks, pastas, global plates, rice bowls,
              zero-proof mocktails and a dessert counter that&apos;s hard to walk past.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/70">
              <span className="flex items-center gap-2">
                <DietMark diet="veg" /> Veg
              </span>
              <span className="flex items-center gap-2">
                <DietMark diet="nonveg" /> Non-veg
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={vegOnly}
                onClick={() => setVegOnly((v) => !v)}
                className="group flex min-h-11 items-center gap-3"
              >
                <span
                  className={`relative h-6 w-11 rounded-full border-2 border-ink transition-colors duration-300 ${vegOnly ? "bg-[#2f8a3c]" : "bg-transparent"}`}
                >
                  <motion.span
                    className={`absolute top-[2px] size-4 rounded-full ${vegOnly ? "bg-paper" : "bg-ink"}`}
                    animate={{ left: vegOnly ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                </span>
                Veg only
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          ref={railRef}
          role="tablist"
          aria-label="Menu categories"
          onKeyDown={onKeyDown}
          className="no-scrollbar -mx-4 mt-12 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-16 lg:flex-wrap lg:overflow-visible lg:px-0"
        >
          {menu.map((cat, i) => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                ref={(el) => {
                  tabRefs.current[cat.id] = el;
                }}
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${cat.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(cat.id)}
                className={`relative flex min-h-11 shrink-0 items-center gap-2 border-[1.5px] px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
                  isActive ? "border-ink text-paper" : "border-ink/25 text-ink/75 hover:border-ink hover:text-ink"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="menu-tab"
                    className="absolute inset-0 -z-0 bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className={`relative ${isActive ? "text-lime" : "text-ink/65"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="relative whitespace-nowrap">{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
          {/* Image frame */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="relative">
                <div
                  ref={frameRef}
                  className="relative aspect-[16/10] overflow-hidden bg-ink shadow-[0_30px_60px_-20px_rgb(11_12_9/0.5)] sm:aspect-[16/9] lg:aspect-[4/5] lg:-rotate-[1.5deg]"
                >
                  <motion.div style={{ y: frameY }} className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
                  {menu.map((cat) => {
                    if (!visited.has(cat.id)) return null;
                    const isActive = cat.id === activeId;
                    const isPrev = cat.id === prevId;
                    return (
                      <motion.div
                        key={cat.id}
                        className="absolute inset-0"
                        style={{ zIndex: isActive ? 2 : isPrev ? 1 : 0, visibility: isActive || isPrev ? "visible" : "hidden" }}
                        initial={false}
                        animate={{ clipPath: isActive || isPrev ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
                        transition={{ duration: isActive ? 0.95 : 0, ease: [0.76, 0, 0.24, 1] }}
                      >
                        <motion.div
                          className="absolute inset-0"
                          initial={false}
                          animate={{ scale: isActive ? 1 : 1.12 }}
                          transition={{ duration: isActive ? 1.4 : 0, ease: EXPO }}
                        >
                          <Image
                            src={cat.image}
                            alt={cat.imageAlt}
                            fill
                            sizes="(min-width: 1024px) 38vw, 100vw"
                            className="object-cover"
                          />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                  </motion.div>
                  <div className="absolute inset-0 z-[3] bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 z-[4] p-5 sm:p-7">
                    <motion.p
                      key={active.id + "-s"}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: EXPO, delay: 0.25 }}
                      className="type-script -rotate-3 text-[clamp(1.8rem,3vw,2.8rem)] text-lime"
                    >
                      {active.script}
                    </motion.p>
                    <motion.p
                      key={active.id + "-b"}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: EXPO, delay: 0.35 }}
                      className="mt-1 max-w-xs text-sm text-paper/85"
                    >
                      {active.blurb}
                    </motion.p>
                  </div>
                </div>
                <Stamp className="absolute -right-3 -top-8 z-10 w-24 sm:-right-6 sm:w-28 lg:-right-10 lg:-top-10 lg:w-32" />
              </div>
            </div>
          </div>

          {/* Panels: every category is in the HTML for search engines; only one is shown */}
          <div className="lg:col-span-7">
            {menu.map((cat) => {
              const isActive = cat.id === activeId;
              const items = vegOnly ? cat.items.filter((it) => it.diet !== "nonveg") : cat.items;
              return (
                <div
                  key={cat.id}
                  role="tabpanel"
                  id={`panel-${cat.id}`}
                  aria-labelledby={`tab-${cat.id}`}
                  hidden={!isActive}
                >
                  <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
                    <h3 className="type-display text-[clamp(2.2rem,4.4vw,3.6rem)] uppercase">{cat.title}</h3>
                    <span className="font-mono text-xs text-ink/65">
                      {String(items.length).padStart(2, "0")} items
                    </span>
                  </div>
                  <ul key={`${cat.id}-${isActive}-${vegOnly}`}>
                    {items.map((item, i) => (
                      <MenuRow key={item.name} item={item} index={i} />
                    ))}
                    {items.length === 0 && (
                      <li className="py-10 font-mono text-sm text-ink/70">
                        Nothing veg in this section — try Small Plates, BOWLR or Desserts.
                      </li>
                    )}
                  </ul>
                  {cat.note && <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-ink/70">✱ {cat.note}</p>}
                </div>
              );
            })}

            <div className="mt-12 flex flex-col gap-6 border-t border-dashed border-ink/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm text-ink/65">
                Menus change with the seasons. Call us for today&apos;s specials, prices and allergen info.
              </p>
              <div className="flex flex-wrap gap-3">
                <StampLink href={site.links.swiggy} external variant="ink">
                  Swiggy
                </StampLink>
                <StampLink href={site.links.zomato} external variant="ink">
                  Zomato
                </StampLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuRow({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.li
      className="group relative isolate border-b border-ink/15 py-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EXPO, delay: 0.05 + index * 0.045 }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-[0.55rem] shrink-0">
          <DietMark diet={item.diet} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h4 className="relative text-[clamp(1.35rem,2.2vw,1.75rem)] uppercase">
              <span
                aria-hidden
                className="absolute -inset-x-1 bottom-[0.08em] -z-10 h-[0.45em] origin-left scale-x-0 bg-lime transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100"
              />
              <span className="type-display">{item.name}</span>
            </h4>
            {item.tags?.map((t) => <TagPill key={t} tag={t} />)}
          </div>
          <p className="mt-1.5 max-w-xl text-[0.94rem] leading-relaxed text-ink/70">{item.description}</p>
        </div>
        <span className="mt-2 shrink-0 font-mono text-sm text-ink/65 tabular-nums">
          {item.price ? `₹${item.price}` : String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </motion.li>
  );
}

function TagPill({ tag }: { tag: Tag }) {
  const style: Record<Tag, string> = {
    signature: "bg-ink text-lime",
    bestseller: "bg-lime text-ink",
    new: "border border-ink text-ink",
    spicy: "bg-brick text-paper",
    seasonal: "border border-teal-2 text-teal-2",
  };
  return (
    <span className={`translate-y-[-3px] px-2 py-[3px] font-mono text-[0.6rem] uppercase tracking-[0.14em] ${style[tag]}`}>
      {tagLabels[tag]}
    </span>
  );
}

function Stamp({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none aspect-square ${className}`} aria-hidden>
      <div className="relative h-full w-full rounded-full bg-lime shadow-[0_10px_30px_rgb(11_12_9/0.25)]">
        <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full text-ink">
          <defs>
            <path id="stamp-circle" d="M50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" />
          </defs>
          <text className="fill-current font-mono text-[8.6px] uppercase tracking-[0.18em]">
            <textPath href="#stamp-circle">Cafe 17 ✱ Ravipuram ✱ Since 2014 ✱ </textPath>
          </text>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <LogoMark className="h-[38%] w-auto" color="#0b0c09" cupColor="#A9CC3B" />
        </div>
      </div>
    </div>
  );
}
