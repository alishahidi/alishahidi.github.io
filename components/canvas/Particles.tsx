'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  spread?: number;
}

// Dust particles near the solar system — warm, subtle
export function Particles({ count = 300, spread = 50 }: ParticlesProps) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 10 + Math.random() * spread;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = (Math.random() - 0.5) * 8; // flatten to the orbital plane
      pos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, [count, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.003;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FDB813"
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        depthTest={false}
        opacity={0.1}
      />
    </Points>
  );
}

// Deep background stars — multi-layer for depth and density
export function Stars({ count = 3000 }: { count?: number }) {
  // Layer 1: Dense tiny white pin-prick stars — deep space feel
  const tinyCount = Math.floor(count * 2);
  const tinyPositions = useMemo(() => {
    const pos = new Float32Array(tinyCount * 3);
    for (let i = 0; i < tinyCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 120 + Math.random() * 350;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [tinyCount]);

  // Layer 2: Medium distant white stars
  const midCount = Math.floor(count * 0.8);
  const midPositions = useMemo(() => {
    const pos = new Float32Array(midCount * 3);
    for (let i = 0; i < midCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 160 + Math.random() * 250;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [midCount]);

  // Layer 3: Brighter closer stars — prominent white dots
  const nearCount = Math.floor(count * 0.3);
  const nearPositions = useMemo(() => {
    const pos = new Float32Array(nearCount * 3);
    for (let i = 0; i < nearCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 100 + Math.random() * 100;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [nearCount]);

  // Layer 4: Very distant faint stars — fills the void
  const farCount = Math.floor(count * 1.5);
  const farPositions = useMemo(() => {
    const pos = new Float32Array(farCount * 3);
    for (let i = 0; i < farCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 250 + Math.random() * 200;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [farCount]);

  return (
    <group>
      {/* Dense tiny white pin-prick stars */}
      <Points positions={tinyPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.1}
          sizeAttenuation={false}
          opacity={0.6}
          depthWrite={false}
          depthTest={false}
        />
      </Points>

      {/* Medium white stars */}
      <Points positions={midPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.15}
          sizeAttenuation={false}
          opacity={0.45}
          depthWrite={false}
          depthTest={false}
        />
      </Points>

      {/* Brighter closer white stars */}
      <Points positions={nearPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.25}
          sizeAttenuation={false}
          opacity={0.75}
          depthWrite={false}
          depthTest={false}
        />
      </Points>

      {/* Very distant faint white stars — deep background */}
      <Points positions={farPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#e8e8ff"
          size={0.07}
          sizeAttenuation={false}
          opacity={0.35}
          depthWrite={false}
          depthTest={false}
        />
      </Points>
    </group>
  );
}
