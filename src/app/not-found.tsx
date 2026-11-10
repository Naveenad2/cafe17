import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Off the map",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden bg-ink px-6 text-center">
      <div className="relative">
        <LogoMark className="bob h-28 w-auto" />
        <span className="ripple absolute left-1/2 top-full -ml-10 -mt-2 h-4 w-20 rounded-[50%] border border-lime" />
      </div>
      <p className="eyebrow text-paper/60">Error 404 · Coordinates unknown</p>
      <h1 className="type-display text-[clamp(3.5rem,12vw,9rem)] uppercase text-paper">
        You&apos;re off <span className="type-script normal-case text-lime">the map</span>
      </h1>
      <p className="max-w-md text-paper/70">
        This page wandered off. The burgers, the steak and your favourite table are right where we left them.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-12 items-center gap-3 bg-lime px-6 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-lime-hi"
      >
        Back to Cafe 17 →
      </Link>
    </main>
  );
}
