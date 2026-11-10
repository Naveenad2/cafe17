/**
 * Deterministic topographic contour generator (pure function, no randomness),
 * so the SVG is identical on server and client and can be prerendered.
 */

type Pt = [number, number];

function smoothClosedPath(points: Pt[]): string {
  // Closed Catmull-Rom → cubic Bézier
  const n = points.length;
  let d = `M${points[0][0].toFixed(0)} ${points[0][1].toFixed(0)}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(0)} ${c1y.toFixed(0)} ${c2x.toFixed(0)} ${c2y.toFixed(0)} ${p2[0].toFixed(0)} ${p2[1].toFixed(0)}`;
  }
  return d + "Z";
}

export function contourRings({
  cx,
  cy,
  count,
  start,
  step,
  seed = 1.7,
  squash = 0.62,
  segments = 40,
}: {
  cx: number;
  cy: number;
  count: number;
  start: number;
  step: number;
  seed?: number;
  squash?: number;
  segments?: number;
}) {
  const rings: { d: string; major: boolean }[] = [];
  for (let i = 0; i < count; i++) {
    const r = start + i * step;
    const pts: Pt[] = [];
    for (let s = 0; s < segments; s++) {
      const t = (s / segments) * Math.PI * 2;
      const wobble =
        1 +
        0.11 * Math.sin(3 * t + seed + i * 0.45) +
        0.06 * Math.sin(5 * t - seed * 2 + i * 0.8) +
        0.035 * Math.sin(9 * t + i * 1.3) +
        (i > count * 0.55 ? 0.05 * Math.sin(2 * t + i * 0.2) : 0);
      pts.push([cx + Math.cos(t) * r * wobble, cy + Math.sin(t) * r * wobble * squash]);
    }
    rings.push({ d: smoothClosedPath(pts), major: i % 4 === 3 });
  }
  return rings;
}
