"use client";

import { AnimatePresence, m as motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { useLenis } from "@/components/providers/SmoothScroll";
import { navLinks, site } from "@/data/site";

const EXPO = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const lenis = useLenis();
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Cached layout numbers — never read layout inside the scroll handler (forces reflow)
  const metrics = useRef({ vh: 800, heroEnd: 1600 });
  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      metrics.current = { vh, heroEnd: (document.getElementById("top")?.offsetHeight ?? vh) - 80 };
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    const hero = document.getElementById("top");
    if (hero) ro.observe(hero);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const { vh, heroEnd } = metrics.current;
    setSolid(y > heroEnd);
    setShowLogo(y > vh * 0.3);
    if (open) return;
    if (y > vh * 0.6 && y > prev + 4) setHidden(true);
    else if (y < prev - 4 || y < vh * 0.6) setHidden(false);
  });

  // Scroll-spy for the active link
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Lock scroll + Escape while the overlay is open
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      lenis?.stop();
      root.style.overflow = "hidden";
    } else {
      lenis?.start();
      root.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.7, ease: EXPO }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`nav-in transition-colors duration-500 ${
            solid && !open ? "bg-ink/92 shadow-[0_1px_0_rgb(239_233_220/0.08)]" : "bg-transparent"
          }`}
        >
          <nav
            aria-label="Primary"
            className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[72px] lg:px-10"
          >
            <a
              href="#top"
              aria-label="Cafe 17 — back to top"
              className="group flex items-center gap-2.5"
              onClick={close}
            >
              <motion.span
                className="flex items-center gap-2.5"
                initial={false}
                animate={{ opacity: showLogo || open ? 1 : 0, y: showLogo || open ? 0 : -8 }}
                transition={{ duration: 0.5, ease: EXPO }}
              >
                <LogoMark className="h-9 w-auto transition-transform duration-500 group-hover:-translate-y-0.5" />
                <Wordmark className="h-8 w-auto" title="Cafe 17" />
              </motion.span>
            </a>

            <ul className="hidden items-center gap-1 xl:flex">
              {navLinks.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group relative flex items-center gap-2 px-3 py-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper/75 transition-colors hover:text-paper"
                    >
                      <span
                        aria-hidden
                        className={`size-1.5 rounded-full bg-lime transition-transform duration-300 ${isActive ? "scale-100" : "scale-0"}`}
                      />
                      {link.label}
                      <span
                        aria-hidden
                        className="absolute inset-x-3 bottom-1 h-px origin-right scale-x-0 bg-lime transition-transform duration-500 ease-[var(--ease-expo)] group-hover:origin-left group-hover:scale-x-100"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={site.phone.primaryHref}
                className="hidden min-h-11 items-center gap-2 bg-lime px-4 font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-lime-hi sm:inline-flex"
              >
                <span aria-hidden className="relative flex size-2">
                  <span className="pulse-ring absolute inset-0 rounded-full bg-ink/60" />
                  <span className="relative size-2 rounded-full bg-ink" />
                </span>
                Book a table
              </a>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="site-menu"
                className="group flex min-h-11 items-center gap-3 px-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper xl:hidden"
              >
                <span className="relative block h-4 w-12 overflow-hidden">
                  <motion.span
                    className="absolute left-0 top-0 flex flex-col"
                    animate={{ y: open ? "-50%" : "0%" }}
                    transition={{ duration: 0.5, ease: EXPO }}
                  >
                    <span className="h-4 leading-4">Menu</span>
                    <span className="h-4 leading-4 text-lime">Close</span>
                  </motion.span>
                </span>
                <span aria-hidden className="relative block h-3 w-7">
                  <motion.span
                    className="absolute left-0 top-0 h-[2px] w-full bg-current"
                    animate={open ? { top: "50%", rotate: 45, y: "-50%" } : { top: "0%", rotate: 0, y: "0%" }}
                    transition={{ duration: 0.45, ease: EXPO }}
                  />
                  <motion.span
                    className="absolute bottom-0 right-0 h-[2px] w-2/3 bg-lime"
                    animate={open ? { bottom: "50%", rotate: -45, y: "50%", width: "100%" } : { bottom: "0%", rotate: 0, y: "0%", width: "66%" }}
                    transition={{ duration: 0.45, ease: EXPO }}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && <MenuOverlay onClose={close} active={active} />}
      </AnimatePresence>
    </>
  );
}

function MenuOverlay({ onClose, active }: { onClose: () => void; active: string }) {
  const firstLink = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const t = setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-lenis-prevent
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink pt-20"
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* contour decoration */}
      <svg aria-hidden className="pointer-events-none absolute -right-24 top-24 h-[70vh] w-auto opacity-[0.14]" viewBox="0 0 400 400" fill="none" stroke="#A9CC3B">
        {[40, 70, 100, 130, 160, 190].map((r, i) => (
          <ellipse key={r} cx="200" cy="200" rx={r * (1 + (i % 2) * 0.08)} ry={r * 0.8} transform={`rotate(${i * 9} 200 200)`} />
        ))}
      </svg>

      <ul className="relative flex flex-1 flex-col justify-center gap-1 px-5 sm:px-10">
        {navLinks.map((link, i) => (
          <li key={link.href} className="overflow-hidden">
            <motion.a
              ref={i === 0 ? firstLink : undefined}
              href={link.href}
              onClick={onClose}
              className="group flex items-baseline gap-4 py-1"
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              exit={{ y: "105%", transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, ease: EXPO, delay: 0.18 + i * 0.05 }}
            >
              <span className="font-mono text-xs text-paper/60">0{i + 1}</span>
              <span
                className={`type-display text-[clamp(2.75rem,13vw,6.5rem)] uppercase transition-colors duration-300 group-hover:text-lime ${
                  active === link.href.slice(1) ? "text-lime" : "text-paper"
                }`}
              >
                {link.label}
              </span>
            </motion.a>
          </li>
        ))}
      </ul>

      <motion.div
        className="relative grid gap-6 border-t border-paper/10 px-5 py-8 sm:grid-cols-3 sm:px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: EXPO }}
      >
        <div>
          <p className="eyebrow text-paper/60">Find us</p>
          <p className="mt-2 text-sm leading-relaxed text-paper/85">
            {site.address.line1}
            <br />
            {site.address.line2}, Kochi
          </p>
        </div>
        <div>
          <p className="eyebrow text-paper/60">Hours</p>
          <p className="mt-2 text-sm text-paper/85">{site.hours.label}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="eyebrow text-paper/60">Say hi</p>
          <a href={site.phone.primaryHref} className="mt-2 text-sm text-lime underline-offset-4 hover:underline">
            {site.phone.primary}
          </a>
          <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-paper/85 underline-offset-4 hover:underline">
            Instagram {site.links.instagramHandle}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
