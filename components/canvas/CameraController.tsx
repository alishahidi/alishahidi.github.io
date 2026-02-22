'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigationStore } from '@/stores/navigationStore';
import { useGraphStore } from '@/stores/graphStore';
import { easeInOutCubic } from '@/lib/utils';
import {
  planets,
  projectStations,
  comets,
  nebulae,
  PlanetConfig,
  MoonConfig,
  AsteroidConfig,
  CometConfig,
} from '@/data/solarSystem';
import {
  computeOrbitalPosition,
  computeMoonPosition,
  computeCometPosition,
} from '@/lib/orbital/mechanics';

// ---------------------------------------------------------------------------
// Tracking target — unified type for any clickable body in the solar system
// ---------------------------------------------------------------------------
type TrackingTarget =
  | { type: 'planet'; config: PlanetConfig }
  | { type: 'moon'; moon: MoonConfig; parent: PlanetConfig }
  | { type: 'station'; config: AsteroidConfig }
  | { type: 'comet'; config: CometConfig }
  | { type: 'nebula'; position: [number, number, number]; size: number }
  | { type: 'static'; position: [number, number, number] }
  | null;

// Resolve a nodeId to a tracking target
function resolveTarget(
  nodeId: string,
  nodes: { id: string; position?: [number, number, number] }[],
): TrackingTarget {
  // 1. Planet
  const planet = planets.find((p) => p.id === nodeId);
  if (planet) return { type: 'planet', config: planet };

  // 2. Station (project in asteroid belt)
  const station = projectStations.find((s) => s.nodeId === nodeId);
  if (station) return { type: 'station', config: station };

  // 3. Moon (skill orbiting a planet)
  //    Use trackedBodyId from navigation store for correct parent when same
  //    skill appears as a moon on multiple planets
  {
    const trackedParentId = useNavigationStore.getState().trackedBodyId;
    if (trackedParentId) {
      const parent = planets.find((p) => p.id === trackedParentId);
      if (parent) {
        const moon = parent.moons.find((m) => m.nodeId === nodeId);
        if (moon) return { type: 'moon', moon, parent };
      }
    }
    // Fallback: search all planets
    for (const p of planets) {
      const moon = p.moons.find((m) => m.nodeId === nodeId);
      if (moon) return { type: 'moon', moon, parent: p };
    }
  }

  // 4. Comet (secret node)
  const comet = comets.find((c) => c.nodeId === nodeId);
  if (comet) return { type: 'comet', config: comet };

  // 5. Nebula (philosophy node)
  const neb = nebulae.find((n) => n.nodeId === nodeId);
  if (neb) return { type: 'nebula', position: neb.position, size: neb.size };

  // 6. Fallback — sun or unknown node
  if (nodeId === 'core-self') return { type: 'static', position: [0, 0, 0] };
  const node = nodes.find((n) => n.id === nodeId);
  return { type: 'static', position: node?.position || [0, 0, 0] };
}

// Compute real-time world position for any target
function computeTargetPosition(
  target: NonNullable<TrackingTarget>,
  elapsed: number,
): [number, number, number] {
  switch (target.type) {
    case 'planet': {
      const { config } = target;
      const angle = config.startAngle + elapsed * config.orbitSpeed;
      return computeOrbitalPosition(config.orbitRadius, angle, config.tilt);
    }
    case 'moon': {
      const { moon, parent } = target;
      const parentAngle = parent.startAngle + elapsed * parent.orbitSpeed;
      const parentPos = computeOrbitalPosition(parent.orbitRadius, parentAngle, parent.tilt);
      const moonAngle = moon.startAngle + elapsed * moon.orbitSpeed;
      return computeMoonPosition(parentPos, moon.orbitRadius, moonAngle);
    }
    case 'station': {
      const { config } = target;
      const angle = config.angle + elapsed * 0.003;
      return [
        config.orbitRadius * Math.cos(angle),
        config.height,
        config.orbitRadius * Math.sin(angle),
      ];
    }
    case 'comet': {
      const { config } = target;
      const angle = config.startAngle + elapsed * config.speed;
      return computeCometPosition(config.orbitRadius, config.eccentricity, angle, config.tilt);
    }
    case 'nebula':
      return target.position;
    case 'static':
      return target.position;
  }
}

// How far the camera should sit from the target
function computeViewDistance(target: NonNullable<TrackingTarget>): number {
  switch (target.type) {
    case 'planet':
      return 10 + target.config.size * 4;
    case 'moon':
      return 4 + target.moon.size * 12;
    case 'station':
      return 6 + target.config.size * 5;
    case 'comet':
      return 8;
    case 'nebula':
      return target.size * 4;
    case 'static':
      return 15;
  }
}

// Whether this target moves and needs per-frame tracking
function needsTracking(target: TrackingTarget): boolean {
  if (!target) return false;
  return target.type === 'planet'
    || target.type === 'moon'
    || target.type === 'station'
    || target.type === 'comet';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface CameraControllerProps {
  enabled?: boolean;
  minDistance?: number;
  maxDistance?: number;
}

export function CameraController({
  enabled = true,
  minDistance = 5,
  maxDistance = 350,
}: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const isTransitioning = useNavigationStore((s) => s.isTransitioning);
  const setTransitioning = useNavigationStore((s) => s.setTransitioning);
  const pushHistory = useNavigationStore((s) => s.pushHistory);
  const cameraTarget = useNavigationStore((s) => s.cameraState.target);
  const setCameraState = useNavigationStore((s) => s.setCameraState);

  const focusedNodeId = useGraphStore((s) => s.focusedNodeId);
  const nodes = useGraphStore((s) => s.nodes);

  const transitionRef = useRef({
    startPosition: new THREE.Vector3(),
    endPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    progress: 0,
    active: false,
  });

  const previousFocusedId = useRef<string | null>(null);
  const trackingRef = useRef<TrackingTarget>(null);

  // -----------------------------------------------------------------------
  // On focus change → start a fly-to transition
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (focusedNodeId === previousFocusedId.current) return;
    previousFocusedId.current = focusedNodeId;

    const transition = transitionRef.current;
    transition.startPosition.copy(camera.position);

    if (controlsRef.current) {
      transition.startTarget.copy(controlsRef.current.target);
    } else {
      transition.startTarget.set(...cameraTarget);
    }

    if (focusedNodeId) {
      const target = resolveTarget(focusedNodeId, nodes);
      trackingRef.current = target;

      if (!target) return;

      const elapsed = performance.now() / 1000;
      const pos = computeTargetPosition(target, elapsed);
      const dist = computeViewDistance(target);

      // Place camera above-behind the target
      transition.endPosition.set(
        pos[0],
        pos[1] + dist * 0.4,
        pos[2] + dist,
      );
      transition.endTarget.set(...pos);
      transition.progress = 0;
      transition.active = true;
      setTransitioning(true);
      pushHistory(focusedNodeId);
    } else {
      // Unfocus — fly back to overview
      trackingRef.current = null;
      transition.endPosition.set(0, 40, 90);
      transition.endTarget.set(0, 0, 0);
      transition.progress = 0;
      transition.active = true;
      setTransitioning(true);
    }
  }, [focusedNodeId, nodes, camera, cameraTarget, setTransitioning, pushHistory]);

  // -----------------------------------------------------------------------
  // Per-frame: animate transition + track moving bodies
  // -----------------------------------------------------------------------
  useFrame((state, delta) => {
    const transition = transitionRef.current;
    const elapsed = state.clock.elapsedTime;
    const target = trackingRef.current;

    // --- During fly-to transition ---
    if (transition.active) {
      transition.progress += delta / 1.2;

      if (transition.progress >= 1) {
        transition.progress = 1;
        transition.active = false;
        setTransitioning(false);
      }

      const eased = easeInOutCubic(Math.min(transition.progress, 1));

      // Update destination in real-time for moving targets
      if (target && needsTracking(target) && transition.active) {
        const pos = computeTargetPosition(target, elapsed);
        const dist = computeViewDistance(target);
        transition.endPosition.set(pos[0], pos[1] + dist * 0.4, pos[2] + dist);
        transition.endTarget.set(...pos);
      }

      camera.position.lerpVectors(
        transition.startPosition,
        transition.endPosition,
        eased,
      );

      const currentTarget = new THREE.Vector3().lerpVectors(
        transition.startTarget,
        transition.endTarget,
        eased,
      );

      if (controlsRef.current) {
        controlsRef.current.target.copy(currentTarget);
        controlsRef.current.update();
      }

      setCameraState({
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [currentTarget.x, currentTarget.y, currentTarget.z],
      });
      return;
    }

    // --- After transition: track orbiting bodies ---
    if (focusedNodeId && target && needsTracking(target) && controlsRef.current) {
      const pos = computeTargetPosition(target, elapsed);
      const targetVec = new THREE.Vector3(...pos);

      const ct = controlsRef.current.target as THREE.Vector3;
      ct.lerp(targetVec, 0.12);

      const offset = camera.position.clone().sub(ct);
      const desiredCamPos = targetVec.clone().add(offset);
      camera.position.lerp(desiredCamPos, 0.12);

      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled && !isTransitioning}
      enableDamping
      dampingFactor={0.05}
      minDistance={minDistance}
      maxDistance={maxDistance}
      enablePan={false}
      rotateSpeed={0.7}
      zoomSpeed={1.8}
      makeDefault
    />
  );
}
