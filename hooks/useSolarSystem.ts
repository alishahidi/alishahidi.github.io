'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { planets, projectStations, comets, asteroidBeltConfig } from '@/data/solarSystem';
import { computeOrbitalPosition, computeMoonPosition, computeCometPosition } from '@/lib/orbital/mechanics';

export interface BodyPosition {
  id: string;
  position: [number, number, number];
  type: 'planet' | 'moon' | 'station' | 'comet';
  parentId?: string;  // for moons → planet id
}

export function useSolarSystem() {
  const positionsRef = useRef<Map<string, [number, number, number]>>(new Map());
  const elapsedRef = useRef(0);

  // Static station positions (they orbit slowly too, but precompute initial)
  const stationPositions = useMemo(() => {
    return projectStations.map((s) => ({
      id: s.nodeId,
      angle: s.angle,
      radius: s.orbitRadius,
      height: s.height,
    }));
  }, []);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    const t = elapsedRef.current;
    const map = positionsRef.current;

    // Compute planet positions
    for (const planet of planets) {
      const angle = planet.startAngle + t * planet.orbitSpeed;
      const pos = computeOrbitalPosition(planet.orbitRadius, angle, planet.tilt);
      map.set(planet.id, pos);

      // Compute moon positions
      for (const moon of planet.moons) {
        const moonAngle = moon.startAngle + t * moon.orbitSpeed;
        const moonPos = computeMoonPosition(pos, moon.orbitRadius, moonAngle);
        // Use composite key: planetId/moonNodeId to disambiguate same skill on different planets
        map.set(`${planet.id}/${moon.nodeId}`, moonPos);
      }
    }

    // Compute station positions (slow drift)
    for (const station of stationPositions) {
      const angle = station.angle + t * 0.003;
      const x = station.radius * Math.cos(angle);
      const z = station.radius * Math.sin(angle);
      map.set(station.id, [x, station.height, z]);
    }

    // Compute comet positions
    for (const comet of comets) {
      const angle = comet.startAngle + t * comet.speed;
      const pos = computeCometPosition(comet.orbitRadius, comet.eccentricity, angle, comet.tilt);
      map.set(comet.nodeId, pos);
    }
  });

  const getPosition = (id: string): [number, number, number] => {
    return positionsRef.current.get(id) || [0, 0, 0];
  };

  return {
    getPosition,
    elapsedRef,
    positionsRef,
  };
}
