# Cafe 17 — Ravipuram, Kochi

Website for Cafe 17, built with Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Framer Motion and Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Before going live

1. **Set the domain before building.** Add `NEXT_PUBLIC_SITE_URL=https://your-domain` to your hosting environment so it's present when `npm run build` runs, because the page is prerendered. It drives the canonical URL, Open Graph URLs, sitemap, robots.txt and JSON-LD. On Vercel it falls back to the production URL automatically.
2. **Check the details** in `src/data/site.ts`: phone numbers, hours, and the Swiggy, Zomato and BOWLR links. Online listings disagree on hours, so confirm them.
3. **Add prices** (optional) in `src/data/menu.ts`. Give any item a `price: 450` and it appears on the site and in the Google menu markup.
4. **Swap in your own photos.** `public/images/hero/*` (the hero slideshow) and `public/images/menu/*` are licensed stock placeholders (Unsplash). `public/images/feed/*` are Cafe 17's own Instagram photos at small size. Replace any of them with full-resolution shots under the same file names. The hero slides and their "Now serving" captions are listed in `HERO_SLIDES` in `src/components/sections/Hero.tsx`.

## Where things live

| What | File |
| --- | --- |
| Address, phone, hours, links | `src/data/site.ts` |
| Menu (categories, dishes, tags, veg markers) | `src/data/menu.ts` |
| Reviews and FAQ | `src/data/content.ts` |
| Logo (vector) | `src/components/brand/Logo.tsx` |
| SEO keywords and structured data | `src/lib/seo.ts`, `src/app/layout.tsx` |
| Sections | `src/components/sections/*` |
| Live map (MapLibre + OpenFreeMap tiles, no API key) | `src/components/sections/LiveMap.tsx` |
| 3D photo ring ("The Space") | `src/components/sections/Space.tsx` |

## Performance notes

- Smooth scrolling (Lenis) runs only for mouse and trackpad users. Touch devices keep native scrolling.
- Looping animations run on GPU layers (transform and opacity only), so phones don't repaint on every frame.
- Scroll effects run on phones and tablets too: the hero zooms through the pin, the signature dishes scroll sideways, the 3D ring rotates, and the Polaroids fly in. The marquees react to scroll speed.
- The 3D ring gives each panel its own transform instead of relying on `preserve-3d`, so it renders the same in Safari.
- The map library loads only when you scroll near it. The camera fly-in and orbit pause when the map is off-screen, and the orbit is skipped on low-memory phones.
- `prefers-reduced-motion` is respected everywhere.
