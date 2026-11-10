"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query hook. Returns `fallback` on the server and during
 * hydration, then the live value — without a hydration mismatch.
 */
export function useMedia(query: string, fallback = false) {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", notify);
      return () => mql.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useIsDesktop = () => useMedia("(min-width: 1024px)");
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");
