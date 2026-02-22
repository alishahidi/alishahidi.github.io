'use client';

import { useRef, useState } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sunConfig } from '@/data/solarSystem';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useAchievementStore } from '@/stores/achievementStore';

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  const setSunClicked = useDiscoveryStore((s) => s.setSunClicked);
  const checkAndUnlock = useAchievementStore((s) => s.checkAndUnlock);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * sunConfig.pulseSpeed) * sunConfig.pulseAmplitude;

    if (meshRef.current) {
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.rotation.y += 0.002;
    }

    if (coronaRef.current) {
      coronaRef.current.scale.setScalar(pulse * 1.3);
      const mat = coronaRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 2) * 0.05;
    }

    if (lightRef.current) {
      lightRef.current.intensity = sunConfig.lightIntensity * 1.15 + Math.sin(t * sunConfig.pulseSpeed) * 0.3;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSunClicked();
    checkAndUnlock('sun', 1);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group>
      {/* Point light — the sun illuminates everything */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={sunConfig.lightIntensity}
        color={sunConfig.color}
        distance={200}
        decay={1}
      />

      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[sunConfig.size, 32, 32]} />
        <meshBasicMaterial color={hovered ? '#FFD700' : sunConfig.color} />
      </mesh>

      {/* Corona glow (slightly larger, translucent) */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[sunConfig.size * 1.4, 32, 32]} />
        <meshBasicMaterial
          color={sunConfig.coronaColor}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[sunConfig.size * 2, 32, 32]} />
        <meshBasicMaterial
          color={sunConfig.color}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
