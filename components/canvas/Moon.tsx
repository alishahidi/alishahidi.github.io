'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MoonConfig } from '@/data/solarSystem';

interface MoonProps {
  config: MoonConfig;
  planetId: string;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function Moon({
  config,
  isSelected,
  isHovered,
  onClick,
  onHover,
}: MoonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = config.startAngle + t * config.orbitSpeed;
    const x = config.orbitRadius * Math.cos(angle);
    const z = config.orbitRadius * Math.sin(angle);

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); onHover(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[config.size, 24, 24]} />
        <meshStandardMaterial
          color={config.color}
          roughness={0.5}
          metalness={0.2}
          emissive={config.color}
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.4 : 0.25}
        />
      </mesh>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[config.size * 1.3, 24, 24]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={isSelected ? 0.35 : 0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Label */}
      <Html
        position={[0, config.size + 0.5, 0]}
        center
        distanceFactor={30}
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-center whitespace-nowrap pointer-events-none select-none">
          <span
            className="font-mono text-[10px] px-1.5 py-0.5 rounded"
            style={{
              color: config.color,
              backgroundColor: 'rgba(0,0,0,0.6)',
              textShadow: `0 0 6px ${config.color}`,
            }}
          >
            {config.label}
          </span>
        </div>
      </Html>
    </group>
  );
}
