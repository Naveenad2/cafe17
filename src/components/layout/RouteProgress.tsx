"use client";

import { m as motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { navLinks } from "@/data/site";

/**
 * Desktop-only scroll indicator: a tiny pin travels down a dotted route,
 * with a stop for every section. Click a stop to jump there.
 */
export function RouteProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.0005 });
  const top = useTransform(smooth, (v) => `${v * 100}%`);
  const [stops, setStops] = useState<{ id: string; label: string; at: number }[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setStops(
        navLinks
          .map((l) => {
            const el = document.getElementById(l.href.slice(1));
            return el ? { id: l.href.slice(1), label: l.label, at: Math.min(1, el.offsetTop / max) } : null;
          })
          .filter(Boolean) as { id: string; label: string; at: number }[],
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setVisible(v > 0.04 && v < 0.985));
  }, [scrollYProgress]);

  return (
    <motion.nav
      aria-label="Page progress"
      className="fixed right-5 top-1/2 z-40 hidden h-[52vh] -translate-y-1/2 xl:block"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 16 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="relative h-full w-6">
        <span className="absolute left-1/2 top-0 h-full w-0 -translate-x-1/2 border-l border-dashed border-paper/25" />
        {stops.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5"
            style={{ top: `${s.at * 100}%` }}
            aria-label={`Jump to ${s.label}`}
          >
            <span className="block size-1.5 rounded-full bg-paper/50 ring-2 ring-ink transition-transform duration-300 group-hover:scale-150 group-hover:bg-lime" />
            <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 translate-x-2 whitespace-nowrap bg-ink px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              {s.label}
            </span>
          </a>
        ))}
        <motion.span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-full" style={{ top }}>
          <LogoMark className="h-7 w-auto drop-shadow-[0_4px_8px_rgb(0_0_0/0.6)]" />
        </motion.span>
      </div>
    </motion.nav>
  );
}
