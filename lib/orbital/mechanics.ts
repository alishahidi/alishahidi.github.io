// Orbital mechanics — computes positions for all celestial bodies

/**
 * Compute position on a circular orbit in the XZ plane.
 */
export function computeOrbitalPosition(
  radius: number,
  angle: number,
  tilt: number = 0,
): [number, number, number] {
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  // tilt rotates the orbit plane around the X axis
  const y = z * Math.sin(tilt);
  const zTilted = z * Math.cos(tilt);
  return [x, y, zTilted];
}

/**
 * Compute position of a moon relative to its parent planet.
 * Returns world-space position given the parent's world position.
 */
export function computeMoonPosition(
  parentPosition: [number, number, number],
  moonOrbitRadius: number,
  moonAngle: number,
): [number, number, number] {
  const mx = moonOrbitRadius * Math.cos(moonAngle);
  const mz = moonOrbitRadius * Math.sin(moonAngle);
  return [
    parentPosition[0] + mx,
    parentPosition[1],
    parentPosition[2] + mz,
  ];
}

/**
 * Compute an elliptical comet orbit position.
 * Uses eccentricity to stretch the orbit along one axis.
 */
export function computeCometPosition(
  semiMajorAxis: number,
  eccentricity: number,
  angle: number,
  tilt: number,
): [number, number, number] {
  // Elliptical orbit: r = a(1-e²) / (1 + e*cos(θ))
  const r = (semiMajorAxis * (1 - eccentricity * eccentricity)) /
    (1 + eccentricity * Math.cos(angle));
  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);
  // Apply tilt
  const y = z * Math.sin(tilt);
  const zTilted = z * Math.cos(tilt);
  return [x, y, zTilted];
}

/**
 * Generate points along an orbit path for rendering.
 */
export function generateOrbitPoints(
  radius: number,
  segments: number = 128,
  tilt: number = 0,
): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(computeOrbitalPosition(radius, angle, tilt));
  }
  return points;
}
