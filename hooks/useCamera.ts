'use client';

import { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useNavigationStore } from '@/stores/navigationStore';
import { useGraphStore } from '@/stores/graphStore';
import { easeInOutCubic } from '@/lib/utils';
import { planets } from '@/data/solarSystem';
import { computeOrbitalPosition } from '@/lib/orbital/mechanics';

interface UseCameraOptions {
  enabled?: boolean;
  transitionDuration?: number;
  offset?: [number, number, number];
}

export function useCamera(options: UseCameraOptions = {}) {
  const {
    enabled = true,
    transitionDuration = 1.5,
    offset = [0, 8, 20],
  } = options;

  const { camera } = useThree();
  const { cameraState, setCameraState, isTransitioning, setTransitioning, pushHistory } =
    useNavigationStore();
  const { focusedNodeId, getNode } = useGraphStore();

  const transitionRef = useRef({
    startPosition: new THREE.Vector3(),
    endPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    progress: 0,
    active: false,
  });

  const previousFocusedId = useRef<string | null>(null);

  useFrame((state, delta) => {
    if (!enabled) return;

    const transition = transitionRef.current;
    const t = state.clock.elapsedTime;

    // Check if we need to start a new transition
    if (focusedNodeId !== previousFocusedId.current) {
      previousFocusedId.current = focusedNodeId;

      if (focusedNodeId) {
        const node = getNode(focusedNodeId);
        if (node) {
          // For planets, compute their current orbital position
          const planetConfig = planets.find((p) => p.id === focusedNodeId);
          let targetPos: [number, number, number];

          if (planetConfig) {
            const angle = planetConfig.startAngle + t * planetConfig.orbitSpeed;
            targetPos = computeOrbitalPosition(planetConfig.orbitRadius, angle, planetConfig.tilt);
          } else if (node.position) {
            targetPos = node.position;
          } else {
            targetPos = [0, 0, 0];
          }

          transition.startPosition.copy(camera.position);
          transition.endPosition.set(
            targetPos[0] + offset[0],
            targetPos[1] + offset[1],
            targetPos[2] + offset[2]
          );
          transition.startTarget.set(...cameraState.target);
          transition.endTarget.set(...targetPos);
          transition.progress = 0;
          transition.active = true;
          setTransitioning(true);
          pushHistory(focusedNodeId);
        }
      }
    }

    // For focused planets, continuously update camera target to track the moving planet
    if (focusedNodeId && !transition.active) {
      const planetConfig = planets.find((p) => p.id === focusedNodeId);
      if (planetConfig) {
        const angle = planetConfig.startAngle + t * planetConfig.orbitSpeed;
        const pos = computeOrbitalPosition(planetConfig.orbitRadius, angle, planetConfig.tilt);
        // Smoothly follow the planet
        const targetVec = new THREE.Vector3(...pos);
        const cameraTarget = new THREE.Vector3(
          pos[0] + offset[0],
          pos[1] + offset[1],
          pos[2] + offset[2]
        );
        camera.position.lerp(cameraTarget, 0.02);
        camera.lookAt(targetVec);
        setCameraState({
          position: [camera.position.x, camera.position.y, camera.position.z],
          target: [targetVec.x, targetVec.y, targetVec.z],
        });
      }
    }

    // Update transition
    if (transition.active) {
      transition.progress += delta / transitionDuration;

      if (transition.progress >= 1) {
        transition.progress = 1;
        transition.active = false;
        setTransitioning(false);
      }

      const eased = easeInOutCubic(transition.progress);

      // Interpolate position
      camera.position.lerpVectors(
        transition.startPosition,
        transition.endPosition,
        eased
      );

      // Interpolate target (look-at)
      const currentTarget = new THREE.Vector3().lerpVectors(
        transition.startTarget,
        transition.endTarget,
        eased
      );
      camera.lookAt(currentTarget);

      // Update store
      setCameraState({
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [currentTarget.x, currentTarget.y, currentTarget.z],
      });
    }
  });

  const flyTo = useCallback(
    (position: [number, number, number], target: [number, number, number]) => {
      const transition = transitionRef.current;
      transition.startPosition.copy(camera.position);
      transition.endPosition.set(...position);
      transition.startTarget.set(...cameraState.target);
      transition.endTarget.set(...target);
      transition.progress = 0;
      transition.active = true;
      setTransitioning(true);
    },
    [camera, cameraState.target, setTransitioning]
  );

  const resetCamera = useCallback(() => {
    flyTo([0, 30, 80], [0, 0, 0]);
  }, [flyTo]);

  return {
    flyTo,
    resetCamera,
    isTransitioning,
    cameraState,
  };
}
