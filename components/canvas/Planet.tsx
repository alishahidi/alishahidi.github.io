'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetConfig } from '@/data/solarSystem';
import { computeOrbitalPosition } from '@/lib/orbital/mechanics';
import { Moon } from './Moon';

interface PlanetProps {
  config: PlanetConfig;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
  onMoonClick: (nodeId: string, planetId: string) => void;
  onMoonHover: (nodeId: string | null) => void;
  selectedMoonId: string | null;
  hoveredMoonId: string | null;
}

export function Planet({
  config,
  isSelected,
  isHovered,
  onClick,
  onHover,
  onMoonClick,
  onMoonHover,
  selectedMoonId,
  hoveredMoonId,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = config.startAngle + t * config.orbitSpeed;
    const pos = computeOrbitalPosition(config.orbitRadius, angle, config.tilt);

    if (groupRef.current) {
      groupRef.current.position.set(...pos);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += config.rotationSpeed * 0.01;
      // Smooth hover/select scale via ref (no setState in useFrame)
      const target = isHovered || isSelected ? 1.15 : 1;
      scaleRef.current += (target - scaleRef.current) * 0.1;
      meshRef.current.scale.setScalar(scaleRef.current);

      // Update emissive intensity
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      const targetEmissive = isSelected ? 0.5 : isHovered ? 0.35 : 0.2;
      mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.1;
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isSelected ? 0.3 : isHovered ? 0.18 : 0.1;
      mat.opacity += (targetOpacity - mat.opacity) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Planet body */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); onHover(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[config.size, 48, 48]} />
        <meshStandardMaterial
          color={config.color}
          roughness={0.5}
          metalness={0.3}
          emissive={config.color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[config.size * 1.2, 48, 48]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Optional ring */}
      {config.hasRing && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[config.size * 1.4, config.size * 2.2, 64]} />
          <meshBasicMaterial
            color={config.ringColor || config.color}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Label */}
      <Html
        position={[0, config.size + 1.2, 0]}
        center
        distanceFactor={40}
        occlude
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-center whitespace-nowrap pointer-events-none select-none">
          <span
            className="font-mono text-sm font-bold px-2 py-0.5 rounded"
            style={{
              color: config.color,
              backgroundColor: 'rgba(0,0,0,0.75)',
              textShadow: `0 0 10px ${config.color}`,
              border: `1px solid ${config.color}50`,
            }}
          >
            {config.name}
          </span>
          {config.description && (
            <div
              className="font-mono text-[10px] mt-0.5 opacity-60"
              style={{ color: config.color }}
            >
              {config.description}
            </div>
          )}
        </div>
      </Html>

      {/* Moons — rendered relative to planet */}
      {config.moons.map((moon) => (
        <Moon
          key={`${config.id}-${moon.nodeId}`}
          config={moon}
          planetId={config.id}
          isSelected={selectedMoonId === moon.nodeId}
          isHovered={hoveredMoonId === moon.nodeId}
          onClick={() => onMoonClick(moon.nodeId, config.id)}
          onHover={(h) => onMoonHover(h ? moon.nodeId : null)}
        />
      ))}
    </group>
  );
}
