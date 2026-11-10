"use client";

import type { LayerSpecification, Map as MLMap, StyleSpecification } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { LOGO } from "@/components/brand/Logo";
import { site } from "@/data/site";

const CENTER: [number, number] = [site.geo.lng, site.geo.lat];
const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";
const CSS_HREF = "/vendor/maplibre-gl-5.24.0.css";
const START = { center: [76.6, 10.4] as [number, number], zoom: 4.2, pitch: 0, bearing: 0 };
const FINAL = { center: CENTER, zoom: 16.6, pitch: 62, bearing: -28 };

const INK = "#0b0c09";
const LIME = "#A9CC3B";

/** Re-theme OpenFreeMap's dark style to the Cafe 17 palette, with 3D lime-tinted buildings. */
function themeStyle(style: StyleSpecification): StyleSpecification {
  const fill: Record<string, string> = {
    water: "#0b2a26",
    landcover_wood: "#10170e",
    landuse_park: "#10170e",
    landuse_residential: "#0f110c",
    aeroway_area: "#0f110c",
  };
  const line: Record<string, string> = {
    waterway: "#0e3832",
    highway_path: "#1d2118",
    highway_minor: "#262a20",
    highway_major_casing: "rgba(169,204,59,0.30)",
    highway_major_inner: "#22261c",
    highway_major_subtle: "#2c3224",
    highway_motorway_casing: "rgba(169,204,59,0.45)",
    highway_motorway_inner: "#2f3b15",
    highway_motorway_subtle: "#2c3224",
  };
  const layers: LayerSpecification[] = [];
  for (const layer of style.layers) {
    const l = { ...layer, paint: { ...(("paint" in layer && layer.paint) || {}) } } as LayerSpecification & {
      paint: Record<string, unknown>;
    };
    if (l.type === "background") l.paint["background-color"] = INK;
    if (l.type === "fill" && fill[l.id]) l.paint["fill-color"] = fill[l.id];
    if (l.type === "line" && line[l.id]) l.paint["line-color"] = line[l.id];
    if (l.type === "symbol") {
      const isWater = l.id.startsWith("water");
      l.paint["text-color"] = isWater ? "#5b9a8c" : l.id.startsWith("place") ? "rgba(239,233,220,0.78)" : "rgba(239,233,220,0.5)";
      l.paint["text-halo-color"] = "rgba(11,12,9,0.92)";
    }
    if (l.id === "building") {
      layers.push({
        id: "building-3d",
        type: "fill-extrusion",
        source: "openmaptiles",
        "source-layer": "building",
        minzoom: 14,
        paint: {
          "fill-extrusion-color": [
            "interpolate",
            ["linear"],
            ["coalesce", ["get", "render_height"], 6],
            0,
            "#1b1f16",
            25,
            "#29321a",
            70,
            "#46581c",
          ],
          "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 14, 0, 15.2, ["coalesce", ["get", "render_height"], 6]],
          "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
          "fill-extrusion-opacity": 0.9,
        },
      } as LayerSpecification);
      continue;
    }
    layers.push(l);
  }
  return { ...style, layers };
}

const MARKER_HTML = `
  <span class="cafe-marker__ripple"></span>
  <span class="cafe-marker__ripple cafe-marker__ripple--late"></span>
  <span class="cafe-marker__shadow"></span>
  <span class="cafe-marker__inner">
    <svg class="cafe-marker__pin" viewBox="76 26 148 228" aria-hidden="true">
      <path d="${LOGO.pin}" fill="${LIME}"/>
      <rect x="${LOGO.handle.x}" y="${LOGO.handle.y}" width="${LOGO.handle.width}" height="${LOGO.handle.height}" rx="${LOGO.handle.rx}" fill="${INK}"/>
      <circle cx="${LOGO.ring.cx}" cy="${LOGO.ring.cy}" r="${LOGO.ring.r}" fill="none" stroke="${INK}" stroke-width="${LOGO.ring.strokeWidth}"/>
      <path d="${LOGO.bowl}" fill="${INK}"/>
    </svg>
    <span class="cafe-marker__label">Cafe 17 · here</span>
  </span>`;

function ensureCss() {
  if (document.querySelector(`link[href="${CSS_HREF}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CSS_HREF;
  document.head.appendChild(link);
}

export function LiveMap({ fallback }: { fallback: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const flyAgain = useRef<() => void>(() => {});
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let map: MLMap | null = null;
    let markerEl: HTMLDivElement | null = null;
    let cancelled = false;
    let raf = 0;
    let inView = false;
    let wantFly = false;
    let flying = false;
    let landed = false;
    let pausedUntil = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const lowEnd = ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) < 4;

    const stopOrbit = () => cancelAnimationFrame(raf);
    const startOrbit = () => {
      stopOrbit();
      if (reduce || lowEnd) return;
      // A slow cinematic orbit, re-rendered at ~30 fps to keep phones cool and smooth
      let last = performance.now();
      const tick = (t: number) => {
        const dt = t - last;
        if (dt >= 32) {
          last = t;
          if (map && inView && landed && !document.hidden && t > pausedUntil && !map.isMoving()) {
            map.setBearing(map.getBearing() + Math.min(dt, 100) * 0.0032);
          }
        }
        if (inView) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const fly = () => {
      if (!map || flying) return;
      flying = true;
      landed = false;
      markerEl?.classList.remove("is-landed");
      setArrived(false);
      const land = () => {
        flying = false;
        landed = true;
        markerEl?.classList.add("is-landed");
        setArrived(true);
        startOrbit();
      };
      if (reduce) {
        map.jumpTo(FINAL);
        land();
        return;
      }
      map.flyTo({ ...FINAL, duration: 5600, curve: 1.45, essential: true });
      map.once("moveend", land);
    };

    flyAgain.current = () => {
      if (!map) return;
      map.jumpTo(START);
      flying = false;
      fly();
    };

    const init = async () => {
      setStatus("loading");
      ensureCss();
      try {
        const [{ default: maplibregl }, style] = await Promise.all([
          import("maplibre-gl"),
          fetch(STYLE_URL).then((r) => {
            if (!r.ok) throw new Error(`style ${r.status}`);
            return r.json() as Promise<StyleSpecification>;
          }),
        ]);
        if (cancelled || !mapEl.current) return;
        map = new maplibregl.Map({
          container: mapEl.current,
          style: themeStyle(style),
          ...START,
          attributionControl: false,
          cooperativeGestures: true,
          pixelRatio: Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2),
          maxPitch: 70,
          fadeDuration: 200,
        });
        map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");

        markerEl = document.createElement("div");
        markerEl.className = "cafe-marker";
        markerEl.innerHTML = MARKER_HTML;
        new maplibregl.Marker({ element: markerEl, anchor: "bottom" }).setLngLat(CENTER).addTo(map);

        const pause = () => {
          pausedUntil = performance.now() + 7000;
        };
        map.on("mousedown", pause);
        map.on("touchstart", pause);
        map.on("wheel", pause);

        map.once("load", () => {
          if (cancelled) return;
          // Start the compact attribution collapsed (it stays one tap away)
          const attrib = mapEl.current?.querySelector(".maplibregl-ctrl-attrib");
          attrib?.classList.remove("maplibregl-compact-show");
          attrib?.removeAttribute("open");
          setStatus("ready");
          if (wantFly) fly();
        });
      } catch {
        if (!cancelled) setStatus("failed");
      }
    };

    // Load the library only when the map is near the viewport (keeps the page fast)
    let started = false;
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          started = true;
          void init();
        }
      },
      { rootMargin: "700px 0px" },
    );
    // Fly in once it's properly on screen; pause orbiting when it isn't
    const visible = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) {
          if (map?.loaded() && !landed) fly();
          else wantFly = true;
          if (landed) startOrbit();
        } else {
          stopOrbit();
        }
      },
      { threshold: 0.45 },
    );
    near.observe(wrap);
    visible.observe(wrap);

    return () => {
      cancelled = true;
      near.disconnect();
      visible.disconnect();
      stopOrbit();
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-label="Live map showing Cafe 17 in Ravipuram, Kochi"
      className="cafe-map relative aspect-[4/5] overflow-hidden border border-paper/12 bg-ink-2 sm:aspect-[6/5] lg:aspect-[5/4]"
    >
      {/* Poster / fallback (hand-drawn map) until the live map is ready */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${status === "ready" ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        {fallback}
      </div>

      <div ref={mapEl} className={`absolute inset-0 transition-opacity duration-700 ${status === "ready" ? "opacity-100" : "opacity-0"}`} />

      {/* Overlay UI */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 bg-ink/85 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-paper">
        <span className="relative flex size-2">
          <span className="pulse-ring absolute inset-0 rounded-full bg-lime" />
          <span className="relative size-2 rounded-full bg-lime" />
        </span>
        {status === "ready" ? "Live map" : status === "failed" ? "Map" : "Loading map…"}
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 flex flex-col items-end gap-2">
        {status === "ready" && arrived ? (
          <button
            type="button"
            onClick={() => flyAgain.current()}
            className="pointer-events-auto inline-flex min-h-10 items-center gap-2 bg-ink/85 px-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper transition-colors hover:text-lime"
          >
            ↻ Fly in again
          </button>
        ) : (
          <span className="bg-ink/85 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper/80">
            {site.coords.lat} · {site.coords.lng}
          </span>
        )}
        <a
          href={site.links.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex min-h-10 items-center bg-lime px-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink transition-transform duration-500 hover:-translate-y-0.5"
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
}
