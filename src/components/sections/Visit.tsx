"use client";

import Image from "next/image";
import { m as motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { SectionLabel, StampLink } from "@/components/ui/bits";
import { MaskLines } from "@/components/ui/motion";
import { contourRings } from "@/components/ui/topo";
import { LiveMap } from "./LiveMap";
import { site } from "@/data/site";

const EXPO = [0.16, 1, 0.3, 1] as const;
const MAP_RINGS = contourRings({ cx: 300, cy: 230, count: 9, start: 26, step: 30, seed: 3.3, squash: 0.72, segments: 40 });

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Live open/closed badge in Kochi time. Rendered after mount to avoid hydration drift. */
function OpenStatus() {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const tick = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
      const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      const now = h * 60 + m;
      const open = now >= toMinutes(site.hours.opens) && now < toMinutes(site.hours.closes);
      setState({
        open,
        label: open ? "Open now · until 11:30 pm" : "Closed · opens 12 noon",
      });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className={`inline-flex min-h-8 items-center gap-2 border px-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-opacity duration-500 ${
        state ? "opacity-100" : "opacity-0"
      } ${state?.open ? "border-lime/60 text-lime" : "border-paper/30 text-paper/70"}`}
      aria-live="polite"
    >
      <span className="relative flex size-2">
        {state?.open && <span className="pulse-ring absolute inset-0 rounded-full bg-lime" />}
        <span className={`relative size-2 rounded-full ${state?.open ? "bg-lime" : "bg-paper/50"}`} />
      </span>
      {state?.label ?? "Checking…"}
    </span>
  );
}

export function Visit() {
  return (
    <section id="visit" aria-labelledby="visit-title" className="relative overflow-hidden bg-ink py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <SectionLabel index="09">Visit</SectionLabel>

        <div className="mt-8 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 id="visit-title">
              <MaskLines
                lines={[
                  <span key="a" className="type-display block text-[clamp(4.4rem,11vw,10.5rem)] uppercase text-paper">
                    Find
                  </span>,
                  <span key="b" className="type-display block text-[clamp(4.4rem,11vw,10.5rem)] uppercase text-lime">
                    the pin
                  </span>,
                ]}
              />
            </h2>

            <div className="mt-10">
              <OpenStatus />
            </div>

            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <dt className="eyebrow text-paper/60">Address</dt>
                <dd className="mt-3 text-[1.05rem] leading-relaxed text-paper">
                  <address className="not-italic">
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                    <br />
                    {site.address.city}, {site.address.region} {site.address.postalCode}
                  </address>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-paper/60">Hours</dt>
                <dd className="mt-3 text-[1.05rem] leading-relaxed text-paper">
                  Every day
                  <br />
                  {site.hours.short}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-paper/60">Call &amp; reserve</dt>
                <dd className="mt-3 flex flex-col gap-1 text-[1.05rem]">
                  <a href={site.phone.primaryHref} className="w-fit text-lime underline-offset-4 hover:underline">
                    {site.phone.primary}
                  </a>
                  <a href={site.phone.landlineHref} className="w-fit text-paper/80 underline-offset-4 hover:underline">
                    {site.phone.landline}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-paper/60">Follow</dt>
                <dd className="mt-3 flex flex-col gap-1 text-[1.05rem]">
                  <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="w-fit text-paper underline-offset-4 hover:underline">
                    Instagram {site.links.instagramHandle}
                  </a>
                  <a href={site.links.facebook} target="_blank" rel="noopener noreferrer" className="w-fit text-paper/80 underline-offset-4 hover:underline">
                    Facebook
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-12 flex flex-wrap gap-3">
              <StampLink href={site.links.maps} external>
                Get directions
              </StampLink>
              <StampLink href={site.phone.primaryHref} variant="ghost">
                Book a table
              </StampLink>
            </div>
          </div>

          <div className="lg:col-span-6">
            <MapCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function MapCard() {
  return (
    <div className="relative">
      <LiveMap fallback={<MapPoster />} />
      <motion.figure
        className="absolute -right-2 -top-14 z-10 w-[34%] max-w-[200px] bg-paper p-2 pb-2.5 shadow-[0_24px_50px_rgb(0_0_0/0.55)] sm:-right-6 lg:-right-10"
        initial={{ opacity: 0, rotate: 14, y: -30 }}
        whileInView={{ opacity: 1, rotate: 6, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1, ease: EXPO, delay: 0.4 }}
      >
        <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[4deg]" aria-hidden />
        <Image
          src="/images/feed/signboard.webp"
          alt="The round Cafe 17 signboard among the trees on R. Madhavan Nair Road"
          width={562}
          height={500}
          sizes="200px"
          className="h-auto w-full"
        />
        <figcaption className="type-script mt-1.5 text-center text-[1.1rem] text-ink/80">look for the sign</figcaption>
      </motion.figure>
    </div>
  );
}

/** Hand-drawn map shown while the live map loads (and if WebGL isn't available). */
function MapPoster() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  return (
    <div ref={ref} className="absolute inset-0">
      <svg viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <g fill="none" stroke="#A9CC3B" strokeOpacity="0.2">
          {MAP_RINGS.map((r, i) => (
            <path key={i} d={r.d} strokeWidth={r.major ? 1.4 : 0.8} />
          ))}
        </g>
        <g stroke="#efe9dc" strokeOpacity="0.16" strokeLinecap="round" fill="none">
          <path d="M-20 150 C 160 170, 380 140, 620 190" strokeWidth="14" />
          <path d="M180 -20 C 200 140, 260 330, 230 520" strokeWidth="10" />
          <path d="M-20 380 C 150 360, 420 400, 620 350" strokeWidth="8" />
          <path d="M420 -20 C 440 120, 400 300, 470 520" strokeWidth="6" />
        </g>
      </svg>
      <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-full">
        <motion.div
          initial={{ y: -220, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : undefined}
          transition={{ type: "spring", stiffness: 220, damping: 13, delay: 0.2 }}
        >
          <LogoMark className="h-20 w-auto drop-shadow-[0_10px_20px_rgb(0_0_0/0.6)] sm:h-24" />
        </motion.div>
        <span className="ripple absolute left-1/2 top-full -ml-8 -mt-2 h-4 w-16 rounded-[50%] border border-lime" />
      </div>
    </div>
  );
}
