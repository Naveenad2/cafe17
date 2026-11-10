"use client";

import { m as motion } from "framer-motion";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/bits";
import { faqs } from "@/data/content";

const EXPO = [0.16, 1, 0.3, 1] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="paper-texture relative py-24 text-ink sm:py-28 lg:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionLabel index="08" tone="dark">
              Good to know
            </SectionLabel>
            <h2 id="faq-title" className="mt-8">
              <span className="type-display block text-[clamp(3.4rem,7vw,6.5rem)] uppercase">Asked</span>
              <span className="type-script block -rotate-3 text-[clamp(2rem,4vw,3.4rem)] text-teal-2">&amp; answered</span>
            </h2>
          </div>
        </div>
        <ul className="border-t-2 border-ink lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-ink/20">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-ink/65">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[clamp(1.15rem,2vw,1.5rem)] font-medium tracking-[-0.015em] transition-colors group-hover:text-teal-2">
                        {f.q}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`relative grid size-10 shrink-0 place-items-center border-[1.5px] border-ink transition-colors duration-300 ${isOpen ? "bg-ink text-lime" : "group-hover:bg-lime"}`}
                    >
                      <span className="absolute h-[1.5px] w-3.5 bg-current" />
                      <motion.span
                        className="absolute h-3.5 w-[1.5px] bg-current"
                        animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                        transition={{ duration: 0.35, ease: EXPO }}
                      />
                    </span>
                  </button>
                </h3>
                <motion.div
                  id={`faq-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  inert={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EXPO }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 pl-9 text-[1rem] leading-relaxed text-ink/75">{f.a}</p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
