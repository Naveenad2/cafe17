import { SectionLabel } from "@/components/ui/bits";
import { Reveal, VelocityMarquee } from "@/components/ui/motion";
import { reviews, type Review } from "@/data/content";
import { site } from "@/data/site";

export function Reviews() {
  const half = Math.ceil(reviews.length / 2);
  const rowA = reviews.slice(0, half);
  const rowB = reviews.slice(half);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden bg-ink py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="07">Word of mouth</SectionLabel>
            <h2 id="reviews-title" className="mt-8">
              <span className="type-display block text-[clamp(3.6rem,9vw,8.5rem)] uppercase text-paper">Overheard</span>
              <span className="type-script block -rotate-2 pl-1 text-[clamp(2.2rem,4.6vw,4rem)] text-lime">at table seventeen</span>
            </h2>
          </div>
          <dl className="grid grid-cols-3 gap-3 lg:col-span-5">
            {site.ratings.map((r, i) => (
              <Reveal key={r.source} delay={i * 0.08} className="border border-paper/15 p-4">
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper/65">{r.source}</dt>
                <dd className="mt-2">
                  <span className="type-display text-[clamp(2.4rem,4vw,3.6rem)] text-lime">{r.score}</span>
                  <span className="ml-1 text-lime">★</span>
                  <span className="mt-1 block font-mono text-[0.62rem] uppercase tracking-[0.12em] text-paper/60">{r.count}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-5 lg:mt-20">
        <VelocityMarquee baseVelocity={-1.4} className="py-2">
          {rowA.map((r) => (
            <Quote key={r.quote} review={r} />
          ))}
        </VelocityMarquee>
        <VelocityMarquee baseVelocity={1.4} className="py-2">
          {rowB.map((r) => (
            <Quote key={r.quote} review={r} tilt />
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}

function Quote({ review, tilt = false }: { review: Review; tilt?: boolean }) {
  return (
    <figure
      className={`ticket flex w-[min(82vw,440px)] shrink-0 flex-col justify-between gap-6 bg-paper px-8 py-7 text-ink ${tilt ? "rotate-[0.6deg]" : "-rotate-[0.6deg]"}`}
    >
      <blockquote className="text-[1.08rem] font-medium leading-snug tracking-[-0.01em]">
        <span className="type-script mr-1 align-[-0.35em] text-[2.6rem] leading-none text-lime-lo">“</span>
        {review.quote}
      </blockquote>
      <figcaption className="flex items-center justify-between gap-4 border-t border-dashed border-ink/25 pt-4 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink/70">
        <span>{review.who}</span>
        <span className="text-ink">{review.source}</span>
      </figcaption>
    </figure>
  );
}
