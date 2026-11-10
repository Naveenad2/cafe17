"use client";

import { m as motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { WORDMARK_PATH } from "@/components/brand/logo-paths";
import { LOGO } from "@/components/brand/Logo";
import { navLinks, site } from "@/data/site";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rise = useTransform(scrollYProgress, [0, 0.9], ["45%", "0%"]);
  const tilt = useTransform(scrollYProgress, [0, 0.9], [4, -6]);

  return (
    <footer ref={ref} className="relative overflow-hidden bg-lime text-ink">
      <div className="mx-auto max-w-[1600px] px-4 pt-16 sm:px-6 lg:px-10 lg:pt-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="type-display text-[clamp(2.4rem,4.4vw,4rem)] uppercase">
              Save the pin.
              <br />
              <span className="type-script normal-case">see you soon</span>
            </p>
            <a
              href={site.phone.primaryHref}
              className="mt-6 inline-flex min-h-12 items-center gap-3 bg-ink px-5 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-lime transition-colors hover:bg-ink-3"
            >
              <LogoMark className="h-6 w-auto" />
              {site.phone.primary}
            </a>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-6">
            <p className="eyebrow text-ink/70">Explore</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="group inline-flex min-h-8 items-center gap-2 font-medium">
                    <span className="h-px w-0 bg-ink transition-all duration-300 group-hover:w-4" />
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="group inline-flex min-h-8 items-center gap-2 font-medium">
                  <span className="h-px w-0 bg-ink transition-all duration-300 group-hover:w-4" />
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="eyebrow text-ink/70">Visit</p>
            <address className="mt-4 not-italic leading-relaxed">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              Kochi, Kerala {site.address.postalCode}
            </address>
            <p className="mt-3 text-sm">{site.hours.label}</p>
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow text-ink/70">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {[
                ["Instagram", site.links.instagram],
                ["Facebook", site.links.facebook],
                ["Swiggy", site.links.swiggy],
                ["Zomato", site.links.zomato],
                ["Reserve on District", site.links.reserve],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink">
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="relative mt-12 overflow-hidden pt-4 lg:mt-16" aria-hidden>
        <motion.svg
          viewBox="0 -96 262 150"
          className="mx-auto block w-[min(94%,118vh)]"
          style={{ y: rise, rotate: tilt }}
        >
          <path d={WORDMARK_PATH} fill="#0b0c09" />
          <path d={LOGO.swash} fill="#0b0c09" />
        </motion.svg>
      </div>

      <div className="relative border-t border-ink/20">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-6 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>© Cafe 17, Kochi · Dropping pins since {site.founded}</p>
          <p>
            {site.coords.lat} {site.coords.lng}
          </p>
          <a href="#top" className="group inline-flex min-h-8 items-center gap-2 text-ink">
            Back to top
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
