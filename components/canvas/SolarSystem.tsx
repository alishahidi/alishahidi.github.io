'use client';

import { useCallback } from 'react';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { OrbitalPath } from './OrbitalPath';
import { AsteroidBelt } from './AsteroidBelt';
import { Nebula } from './Nebula';
import { Comet } from './Comet';
import { ConnectionLines } from './ConnectionLines';
import { planets, nebulae, comets } from '@/data/solarSystem';
import { useGraph } from '@/hooks/useGraph';
import { useSolarSystem } from '@/hooks/useSolarSystem';
import { useNavigationStore } from '@/stores/navigationStore';

export function SolarSystem() {
  const {
    focusedNodeId,
    hoveredNodeId,
    handleNodeClick,
    handleNodeHover,
  } = useGraph();

  const { positionsRef } = useSolarSystem();
  const setTrackedBody = useNavigationStore((s) => s.setTrackedBody);

  const onPlanetClick = useCallback(
    (planetId: string) => handleNodeClick(planetId),
    [handleNodeClick]
  );

  const onPlanetHover = useCallback(
    (planetId: string, hovered: boolean) => handleNodeHover(hovered ? planetId : null),
    [handleNodeHover]
  );

  const onMoonClick = useCallback(
    (moonNodeId: string, planetId: string) => {
      // Store parent planet context so CameraController tracks the correct moon
      setTrackedBody(planetId);
      handleNodeClick(moonNodeId);
    },
    [handleNodeClick, setTrackedBody]
  );

  const onMoonHover = useCallback(
    (moonNodeId: string | null) => handleNodeHover(moonNodeId),
    [handleNodeHover]
  );

  return (
    <group>
      {/* The Sun */}
      <Sun />

      {/* Orbital paths for each planet */}
      {planets.map((planet) => (
        <OrbitalPath
          key={`orbit-${planet.id}`}
          radius={planet.orbitRadius}
          tilt={planet.tilt}
          color={planet.color}
          opacity={0.2}
          lineWidth={1}
          focused={focusedNodeId === planet.id}
        />
      ))}

      {/* Planets with their moons */}
      {planets.map((planet) => (
        <Planet
          key={planet.id}
          config={planet}
          isSelected={focusedNodeId === planet.id}
          isHovered={hoveredNodeId === planet.id}
          onClick={() => onPlanetClick(planet.id)}
          onHover={(h) => onPlanetHover(planet.id, h)}
          onMoonClick={onMoonClick}
          onMoonHover={onMoonHover}
          selectedMoonId={focusedNodeId}
          hoveredMoonId={hoveredNodeId}
        />
      ))}

      {/* Asteroid belt with project stations */}
      <AsteroidBelt
        onStationClick={(id) => handleNodeClick(id)}
        focusedStationId={focusedNodeId}
        hoveredStationId={hoveredNodeId}
        onStationHover={(id) => handleNodeHover(id)}
      />

      {/* Nebulae — philosophy nodes in background */}
      {nebulae.map((nebula) => (
        <Nebula
          key={nebula.nodeId}
          config={nebula}
          isSelected={focusedNodeId === nebula.nodeId}
          onClick={() => handleNodeClick(nebula.nodeId)}
        />
      ))}

      {/* Comets — secret nodes */}
      {comets.map((comet) => (
        <Comet
          key={comet.nodeId}
          config={comet}
          isSelected={focusedNodeId === comet.nodeId}
          onClick={() => handleNodeClick(comet.nodeId)}
          onHover={(h) => handleNodeHover(h ? comet.nodeId : null)}
        />
      ))}

      {/* Connection lines between nodes */}
      <ConnectionLines positionsRef={positionsRef} />
    </group>
  );
}
