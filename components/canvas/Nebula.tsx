'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Html, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { NebulaConfig } from '@/data/solarSystem';

interface NebulaProps {
  config: NebulaConfig;
  isSelected: boolean;
  onClick: () => void;
}

export function Nebula({ config, isSelected, onClick }: NebulaProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Generate dust particle positions scattered around the nebula core
  const dustPositions = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Gaussian-ish distribution — dense center, sparse edges
      const r = (Math.random() + Math.random() + Math.random()) / 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = r * config.size * 1.5;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6; // flattened
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, [config.size]);

  // Generate cloud sprite layers — overlapping transparent blobs at different offsets
  const cloudLayers = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const spread = config.size * 0.4;
      return {
        position: [
          Math.cos(angle) * spread * (0.3 + Math.random() * 0.7),
          Math.sin(angle) * spread * (0.3 + Math.random() * 0.7) * 0.5,
          (Math.random() - 0.5) * spread * 0.3,
        ] as [number, number, number],
        scale: config.size * (0.5 + Math.random() * 0.8),
        opacity: config.opacity * (0.4 + Math.random() * 0.6),
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      };
    });
  }, [config.size, config.opacity]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Slow overall rotation — swirling effect
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.02;
    }

    // Core breathing
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 0.3 + config.position[0] * 0.1) * 0.08;
      coreRef.current.scale.setScalar(pulse);
    }

    // Dust rotation
    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.01;
      dustRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }
  });

  return (
    <group position={config.position}>
      <group ref={groupRef}>
        {/* Core glow — bright center */}
        <group ref={coreRef}>
          <Billboard>
            <mesh
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
              onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'default'; }}
            >
              <circleGeometry args={[config.size * 0.4, 32]} />
              <meshBasicMaterial
                color={config.color}
                transparent
                opacity={config.opacity * 1.5}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </Billboard>
        </group>

        {/* Cloud layers — overlapping translucent blobs */}
        {cloudLayers.map((layer, i) => (
          <Billboard key={i}>
            <mesh
              position={layer.position}
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
              onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'default'; }}
            >
              <circleGeometry args={[layer.scale, 32]} />
              <meshBasicMaterial
                color={config.color}
                transparent
                opacity={layer.opacity}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </Billboard>
        ))}

        {/* Dust particles — scattered points for gaseous look */}
        <Points ref={dustRef} positions={dustPositions} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color={config.color}
            size={0.3}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={config.opacity * 2}
          />
        </Points>
      </group>

      {/* Label */}
      <Html
        position={[0, config.size * 0.8, 0]}
        center
        distanceFactor={60}
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-center whitespace-nowrap pointer-events-none select-none">
          <span
            className="font-mono text-[10px] px-2 py-1 rounded"
            style={{
              color: config.color,
              backgroundColor: 'rgba(0,0,0,0.5)',
              textShadow: `0 0 12px ${config.color}, 0 0 24px ${config.color}`,
              opacity: isSelected ? 1 : 0.7,
            }}
          >
            {config.label}
          </span>
        </div>
      </Html>
    </group>
  );
}
