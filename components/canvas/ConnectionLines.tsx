'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useGraphStore } from '@/stores/graphStore';
import { planets, nebulae, comets } from '@/data/solarSystem';
import { connections as allConnections } from '@/data/loaders';

interface ConnectionLinesProps {
  positionsRef: React.RefObject<Map<string, [number, number, number]>>;
}

// Brighter type colors for connection lines
const TYPE_COLORS: Record<string, string> = {
  skill: '#00ffff',
  project: '#00ff41',
  philosophy: '#ff44ff',
  experience: '#FFD044',
  secret: '#ff3377',
  core: '#ffffff',
};

// Build lookup: nodeId -> position key used by useSolarSystem
function buildPositionKeyMap(): Map<string, string> {
  const map = new Map<string, string>();

  for (const planet of planets) {
    map.set(planet.id, planet.id);
    for (const moon of planet.moons) {
      if (!map.has(moon.nodeId)) {
        map.set(moon.nodeId, `${planet.id}/${moon.nodeId}`);
      }
    }
  }

  for (const comet of comets) {
    map.set(comet.nodeId, comet.nodeId);
  }

  return map;
}

function getNebulaPosition(nodeId: string): [number, number, number] | null {
  const nebula = nebulae.find((n) => n.nodeId === nodeId);
  return nebula ? nebula.position : null;
}

function resolvePosition(
  nodeId: string,
  map: Map<string, [number, number, number]>,
  keyMap: Map<string, string>,
): [number, number, number] | null {
  const nebulaPos = getNebulaPosition(nodeId);
  if (nebulaPos) return nebulaPos;

  const key = keyMap.get(nodeId);
  if (key) {
    const pos = map.get(key);
    if (pos) return pos;
  }

  const directPos = map.get(nodeId);
  if (directPos) return directPos;

  return null;
}

// Individual connection line — updates positions per frame
function ConnectionLine({
  conn,
  positionsRef,
  keyMap,
  color,
  strength,
}: {
  conn: { id: string; from: string; to: string; strength: number };
  positionsRef: React.RefObject<Map<string, [number, number, number]>>;
  keyMap: Map<string, string>;
  color: string;
  strength: number;
}) {
  const coreRef = useRef<any>(null);
  const glowRef = useRef<any>(null);

  useFrame((state) => {
    const map = positionsRef.current;
    if (!map) return;

    const fromPos = resolvePosition(conn.from, map, keyMap);
    const toPos = resolvePosition(conn.to, map, keyMap);

    if (!fromPos || !toPos) {
      if (coreRef.current) coreRef.current.visible = false;
      if (glowRef.current) glowRef.current.visible = false;
      return;
    }

    const positions = [...fromPos, ...toPos];
    const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 2.5 + strength * 10) * 0.2;

    if (coreRef.current) {
      coreRef.current.visible = true;
      coreRef.current.geometry.setPositions(positions);
      coreRef.current.material.opacity = strength * pulse;
    }

    if (glowRef.current) {
      glowRef.current.visible = true;
      glowRef.current.geometry.setPositions(positions);
      glowRef.current.material.opacity = strength * pulse * 0.35;
    }
  });

  return (
    <>
      {/* Core line — sharp and visible */}
      <Line
        ref={coreRef}
        points={[[0, 0, 0], [0, 0, 0.01]]}
        color={color}
        lineWidth={2.5}
        transparent
        opacity={0}
        depthWrite={false}
      />
      {/* Glow line — wider, softer */}
      <Line
        ref={glowRef}
        points={[[0, 0, 0], [0, 0, 0.01]]}
        color={color}
        lineWidth={8}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </>
  );
}

export function ConnectionLines({ positionsRef }: ConnectionLinesProps) {
  const focusedNodeId = useGraphStore((s) => s.focusedNodeId);
  const hoveredNodeId = useGraphStore((s) => s.hoveredNodeId);
  const nodes = useGraphStore((s) => s.nodes);

  const keyMap = useMemo(() => buildPositionKeyMap(), []);
  const activeNodeId = hoveredNodeId || focusedNodeId;

  const relevantConnections = useMemo(() => {
    if (!activeNodeId) return [];
    return allConnections
      .filter((c) => c.from === activeNodeId || c.to === activeNodeId)
      .slice(0, 30);
  }, [activeNodeId]);

  // Compute color for each connection based on the "other" node's type
  const connectionColors = useMemo(() => {
    return relevantConnections.map((conn) => {
      const otherNodeId = conn.from === activeNodeId ? conn.to : conn.from;
      const otherNode = nodes.find((n) => n.id === otherNodeId);
      return otherNode
        ? TYPE_COLORS[otherNode.type] || TYPE_COLORS.skill
        : TYPE_COLORS.skill;
    });
  }, [relevantConnections, activeNodeId, nodes]);

  return (
    <group>
      {relevantConnections.map((conn, i) => (
        <ConnectionLine
          key={conn.id}
          conn={conn}
          positionsRef={positionsRef}
          keyMap={keyMap}
          color={connectionColors[i]}
          strength={conn.strength}
        />
      ))}
    </group>
  );
}
