'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { asteroidBeltConfig, projectStations } from '@/data/solarSystem';

interface AsteroidBeltProps {
  onStationClick: (nodeId: string) => void;
  onStationHover: (nodeId: string | null) => void;
  focusedStationId: string | null;
  hoveredStationId: string | null;
}

export function AsteroidBelt({
  onStationClick,
  onStationHover,
  focusedStationId,
  hoveredStationId,
}: AsteroidBeltProps) {
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random asteroid transforms
  const asteroids = useMemo(() => {
    const { innerRadius, outerRadius, count, ySpread } = asteroidBeltConfig;
    const items = [];
    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * ySpread * 2;
      const scale = 0.05 + Math.random() * 0.15;
      const rotSpeed = (Math.random() - 0.5) * 0.02;
      items.push({ radius, angle, y, scale, rotSpeed });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (!instancedRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < asteroids.length; i++) {
      const a = asteroids[i];
      const angle = a.angle + t * 0.001 + a.rotSpeed * t * 0.3;
      const x = a.radius * Math.cos(angle);
      const z = a.radius * Math.sin(angle);
      dummy.position.set(x, a.y, z);
      dummy.rotation.set(t * a.rotSpeed, t * a.rotSpeed * 0.7, 0);
      dummy.scale.setScalar(a.scale);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);
    }
    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Instanced mesh for small rocks */}
      <instancedMesh ref={instancedRef} args={[undefined, undefined, asteroids.length]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#665544"
          roughness={0.9}
          metalness={0.1}
          emissive="#332211"
          emissiveIntensity={0.05}
        />
      </instancedMesh>

      {/* Clickable project stations */}
      {projectStations.map((station) => (
        <ProjectStation
          key={station.nodeId}
          nodeId={station.nodeId}
          label={station.label}
          orbitRadius={station.orbitRadius}
          angle={station.angle}
          height={station.height}
          size={station.size}
          color={station.color}
          isSelected={focusedStationId === station.nodeId}
          isHovered={hoveredStationId === station.nodeId}
          onClick={() => onStationClick(station.nodeId)}
          onHover={(h) => onStationHover(h ? station.nodeId : null)}
        />
      ))}
    </group>
  );
}

interface ProjectStationProps {
  nodeId: string;
  label: string;
  orbitRadius: number;
  angle: number;
  height: number;
  size: number;
  color: string;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function ProjectStation({
  label,
  orbitRadius,
  angle: initialAngle,
  height,
  size,
  color,
  isSelected,
  isHovered,
  onClick,
  onHover,
}: ProjectStationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = initialAngle + t * 0.003;
    const x = orbitRadius * Math.cos(angle);
    const z = orbitRadius * Math.sin(angle);

    if (groupRef.current) {
      groupRef.current.position.set(x, height, z);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x += 0.001;
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
        <boxGeometry args={[size, size * 0.6, size]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.6}
          emissive={color}
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.4 : 0.2}
        />
      </mesh>

      {/* Station glow */}
      <mesh>
        <sphereGeometry args={[size * 0.8, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.35 : 0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Label */}
      <Html
        position={[0, size + 0.6, 0]}
        center
        distanceFactor={30}
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-center whitespace-nowrap pointer-events-none select-none">
          <span
            className="font-mono text-[10px] px-1.5 py-0.5 rounded"
            style={{
              color,
              backgroundColor: 'rgba(0,0,0,0.7)',
              textShadow: `0 0 6px ${color}`,
            }}
          >
            {label}
          </span>
        </div>
      </Html>
    </group>
  );
}
