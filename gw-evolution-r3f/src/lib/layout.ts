/**
 * Layout helpers for positioning base classes and stacked items.
 */

export type Vec3 = [x: number, y: number, z: number];

/** Convert degrees to radians */
const toRad = (deg: number) => (deg * Math.PI) / 180;

export const DEFAULT_RING_RADIUS = 3;

/**
 * Returns 6 positions on the XZ plane laid out as a flat-top hex ring.
 * Angle order: 0°, 60°, 120°, 180°, 240°, 300°
 *
 * x = cos(theta) * r
 * z = sin(theta) * r
 * y = 0
 */
export function getBasePositions(radius: number): Vec3[] {
  if (!(radius > 0)) return Array.from({ length: 6 }, () => [0, 0, 0] as Vec3);
  const angles = [0, 60, 120, 180, 240, 300].map(toRad);
  return angles.map((a) => [Math.cos(a) * radius, 0, Math.sin(a) * radius]);
}

/**
 * Returns `count` positions stacked along Y, centered around 0, with a uniform `gap`.
 * Example (count=3, gap=1): y = [-1, 0, 1]
 */
export function stackPositions(count: number, gap: number): Vec3[] {
  const n = Math.max(0, Math.floor(count));
  if (n === 0) return [];
  if (n === 1) return [[0, 0, 0]];
  const g = Number.isFinite(gap) ? gap : 1;
  const half = (n - 1) / 2;
  const out: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const y = (i - half) * g;
    out.push([0, y, 0]);
  }
  return out;
}
