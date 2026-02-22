'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { CometConfig } from '@/data/solarSystem';
import { computeCometPosition } from '@/lib/orbital/mechanics';

interface CometProps {
  config: CometConfig;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function Comet({ config, isSelected, onClick, onHover }: CometProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = config.startAngle + t * config.speed;
    const pos = computeCometPosition(config.orbitRadius, config.eccentricity, angle, config.tilt);

    if (groupRef.current) {
      groupRef.current.position.set(...pos);
    }
  });

  return (
    <group ref={groupRef}>
      <Trail
        width={2.5}
        length={8}
        color={config.color}
        attenuation={(t) => t * t}
      >
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); onHover(false); document.body.style.cursor = 'default'; }}
        >
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color={config.color} />
        </mesh>
      </Trail>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={isSelected ? 0.35 : 0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Label — only when close or selected */}
      <Html
        position={[0, 1.2, 0]}
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
              opacity: isSelected ? 1 : 0.5,
            }}
          >
            {config.label}
          </span>
        </div>
      </Html>
    </group>
  );
}
