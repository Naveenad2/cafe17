"use client";

import Lenis from "lenis";
import { LazyMotion, MotionConfig } from "framer-motion";
import { createContext, useContext, useEffect, useState } from "react";

const loadMotionFeatures = () => import("./motion-features").then((mod) => mod.default);

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/**
 * Lenis smooth scrolling for mouse/trackpad users only.
 * Touch devices keep native momentum scrolling (faster, no jank, no bugs),
 * and reduced-motion users get plain scrolling.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const instance = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      autoRaf: true,
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Lenis must be created on the client after mount
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Smooth in-page anchor navigation for every <a href="#...">
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return (
    <LenisContext.Provider value={lenis}>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </LenisContext.Provider>
  );
}
