import { LogoMark } from "@/components/brand/Logo";

/** "N°01 — The story" style section eyebrow */
export function SectionLabel({
  index,
  children,
  tone = "light",
  className = "",
}: {
  index: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const color = tone === "light" ? "text-paper/70" : "text-ink/70";
  return (
    <p className={`eyebrow flex items-center gap-3 ${color} ${className}`}>
      <LogoMark className="h-4 w-auto shrink-0" color={tone === "light" ? "#A9CC3B" : "#0b0c09"} cupColor={tone === "light" ? "#0b0c09" : "#A9CC3B"} />
      <span>N°{index}</span>
      <span aria-hidden className={`h-px w-8 ${tone === "light" ? "bg-paper/30" : "bg-ink/30"}`} />
      <span>{children}</span>
    </p>
  );
}

/** CSS-only marquee (runs on the compositor, cheap on phones). */
export function Marquee({
  children,
  duration = 36,
  reverse = false,
  pauseOnHover = false,
  className = "",
  gap = "gap-10",
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  gap?: string;
}) {
  return (
    <div className={`marquee flex overflow-hidden ${className}`}>
      <div
        className={`marquee-track flex shrink-0 ${gap} pr-10 will-change-transform`}
        data-pause={pauseOnHover}
        style={
          {
            "--marquee-duration": `${duration}s`,
            "--marquee-direction": reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div className={`flex shrink-0 items-center ${gap}`}>{children}</div>
        <div className={`flex shrink-0 items-center ${gap}`} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Bracketed "stamp" CTA — the house button style. */
export function StampLink({
  href,
  children,
  variant = "lime",
  external = false,
  className = "",
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "lime" | "ghost" | "ink" | "paper";
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const styles: Record<string, string> = {
    lime: "bg-lime text-ink [--fill:var(--color-ink)] hover:text-lime",
    ink: "bg-ink text-paper [--fill:var(--color-lime)] hover:text-ink",
    paper: "bg-paper text-ink [--fill:var(--color-ink)] hover:text-paper",
    ghost: "text-paper ring-1 ring-inset ring-paper/40 [--fill:var(--color-paper)] hover:text-ink",
  };
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group/stamp relative isolate inline-flex min-h-12 items-center gap-2.5 overflow-hidden px-4 py-3 font-mono text-[0.72rem] sm:gap-3 sm:px-5 sm:text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors duration-500 ease-[var(--ease-expo)] ${styles[variant]} ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-[var(--fill)] transition-transform duration-500 ease-[var(--ease-expo)] group-hover/stamp:scale-y-100"
      />
      <span aria-hidden className="hidden text-[0.95em] opacity-70 sm:inline">[</span>
      <span className="relative">{children}</span>
      <span aria-hidden className="inline-block transition-transform duration-500 ease-[var(--ease-expo)] group-hover/stamp:translate-x-1">
        →
      </span>
      <span aria-hidden className="hidden text-[0.95em] opacity-70 sm:inline">]</span>
    </a>
  );
}

export function DietMark({ diet }: { diet?: "veg" | "nonveg" | "both" }) {
  if (!diet) return null;
  const mark = (kind: "veg" | "nonveg") => (
    <span
      key={kind}
      title={kind === "veg" ? "Vegetarian" : "Non-vegetarian"}
      className={`inline-grid size-[13px] shrink-0 place-items-center border-[1.5px] ${
        kind === "veg" ? "border-[#2f8a3c]" : "border-[#9b3b22]"
      }`}
    >
      {kind === "veg" ? (
        <span className="size-[5px] rounded-full bg-[#2f8a3c]" />
      ) : (
        <span className="h-0 w-0 border-x-[3.5px] border-b-[6px] border-x-transparent border-b-[#9b3b22]" />
      )}
    </span>
  );
  return (
    <span className="inline-flex translate-y-[-2px] gap-1" aria-label={diet === "veg" ? "Vegetarian" : diet === "nonveg" ? "Non-vegetarian" : "Veg and non-veg options"}>
      {diet === "both" ? [mark("veg"), mark("nonveg")] : mark(diet)}
    </span>
  );
}
