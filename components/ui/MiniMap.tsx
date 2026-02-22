'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGraph } from '@/hooks/useGraph';
import { useNavigationStore } from '@/stores/navigationStore';
import { planets } from '@/data/solarSystem';

export function MiniMap() {
  const { showMiniMap, toggleMiniMap } = useNavigationStore();
  const { focusedNodeId, handleNodeClick } = useGraph();

  // Map scale: fit the largest orbit into the minimap
  const mapSize = 180;
  const maxOrbit = Math.max(...planets.map((p) => p.orbitRadius));
  const scale = (mapSize * 0.45) / maxOrbit;

  // Orbit circles and planet dots
  const orbitData = useMemo(
    () =>
      planets.map((p) => ({
        id: p.id,
        name: p.name,
        radius: p.orbitRadius * scale,
        color: p.color,
        size: Math.max(4, p.size * 2),
      })),
    [scale]
  );

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleMiniMap}
        className="fixed bottom-4 right-4 z-40 px-3 py-1.5
          bg-black/50 backdrop-blur-sm border border-[#FDB813]/30 rounded
          text-[#FDB813] font-mono text-xs hover:bg-[#FDB813]/10 hover:border-[#FDB813]/50
          transition-all"
      >
        [M] MAP
      </button>

      <AnimatePresence>
        {showMiniMap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-14 right-4 z-40"
          >
            <div
              className="bg-black/80 backdrop-blur-sm border border-[#FDB813]/30 rounded-lg p-2"
              style={{ width: 200, height: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#FDB813]/70 font-mono text-xs uppercase">
                  Orbital Map
                </span>
                <button
                  onClick={toggleMiniMap}
                  className="text-[#FDB813]/50 hover:text-[#FDB813] text-xs"
                >
                  [x]
                </button>
              </div>

              {/* Top-down orbital diagram */}
              <div className="relative w-full h-[calc(100%-24px)] overflow-hidden">
                <svg
                  viewBox={`0 0 ${mapSize} ${mapSize}`}
                  className="w-full h-full"
                >
                  {/* Sun at center */}
                  <circle
                    cx={mapSize / 2}
                    cy={mapSize / 2}
                    r={3}
                    fill="#FDB813"
                    style={{ filter: 'drop-shadow(0 0 3px #FDB813)' }}
                  />

                  {/* Orbit rings */}
                  {orbitData.map((orbit) => (
                    <circle
                      key={`ring-${orbit.id}`}
                      cx={mapSize / 2}
                      cy={mapSize / 2}
                      r={orbit.radius}
                      fill="none"
                      stroke={orbit.color}
                      strokeWidth={0.5}
                      opacity={0.3}
                    />
                  ))}

                  {/* Planet dots — positioned at their orbit radius (static positions for minimap) */}
                  {orbitData.map((orbit, i) => {
                    // Static position at a fixed angle for the minimap
                    const angle = (i / orbitData.length) * Math.PI * 2 - Math.PI / 2;
                    const cx = mapSize / 2 + orbit.radius * Math.cos(angle);
                    const cy = mapSize / 2 + orbit.radius * Math.sin(angle);
                    const isFocused = focusedNodeId === orbit.id;

                    return (
                      <g key={`planet-${orbit.id}`}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={orbit.size}
                          fill={orbit.color}
                          opacity={0.9}
                          className="cursor-pointer"
                          onClick={() => handleNodeClick(orbit.id)}
                          style={{ filter: isFocused ? `drop-shadow(0 0 3px ${orbit.color})` : undefined }}
                        />
                        {isFocused && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={orbit.size + 2}
                            fill="none"
                            stroke="white"
                            strokeWidth={1}
                          />
                        )}
                        <text
                          x={cx}
                          y={cy + orbit.size + 9}
                          textAnchor="middle"
                          fill={orbit.color}
                          fontSize={7}
                          fontFamily="monospace"
                          opacity={0.8}
                        >
                          {orbit.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
