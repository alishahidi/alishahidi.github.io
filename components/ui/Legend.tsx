'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegendItem {
  type: string;
  shape: string;
  color: string;
  description: string;
}

const legendItems: LegendItem[] = [
  {
    type: 'Planet',
    shape: 'Sphere',
    color: '#FDB813',
    description: 'Career roles — orbit the sun',
  },
  {
    type: 'Moon',
    shape: 'Small sphere',
    color: '#FF6B35',
    description: 'Skills — each has its own color',
  },
  {
    type: 'Station',
    shape: 'Cube',
    color: '#57D9A3',
    description: 'Projects in the asteroid belt',
  },
  {
    type: 'Nebula',
    shape: 'Cloud',
    color: '#9D7BFF',
    description: 'Philosophy and ideas',
  },
  {
    type: 'Comet',
    shape: 'Trail',
    color: '#FF6B6B',
    description: 'Hidden secrets to discover',
  },
];

export function Legend() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="fixed left-[6.5rem] bottom-4 z-40"
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Hide legend' : 'Show legend'}
        className="flex min-h-9 items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur-sm
          border border-[#FDB813]/30 rounded font-mono text-xs text-[#FDB813]
          hover:bg-[#FDB813]/10 hover:border-[#FDB813]/50 transition-all"
      >
        <span className="text-lg leading-none">{isExpanded ? '−' : '?'}</span>
        <span>LEGEND</span>
      </button>

      {/* Legend panel — opens upward so it never overlaps the corner controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2 bg-black/90 backdrop-blur-sm border border-[#FDB813]/30
              rounded overflow-hidden max-h-[60vh] overflow-y-auto w-56 sm:w-64"
          >
            <div className="p-3">
              <h3 className="text-[#FDB813] font-mono text-xs uppercase mb-3 border-b border-[#FDB813]/20 pb-2">
                Celestial Bodies
              </h3>

              <div className="space-y-2">
                {legendItems.map((item) => (
                  <div key={item.type} className="flex items-center gap-3">
                    {/* Color indicator */}
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 8px ${item.color}50`,
                      }}
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-xs font-bold"
                          style={{ color: item.color }}
                        >
                          {item.type}
                        </span>
                        <span className="text-[#9AA5CC] text-[10px] font-mono">
                          ({item.shape})
                        </span>
                      </div>
                      <p className="text-[#9AA5CC] text-[11px] font-mono">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls hint */}
              <div className="mt-4 pt-3 border-t border-[#FDB813]/20">
                <h4 className="text-[#FDB813]/70 font-mono text-[10px] uppercase mb-2">
                  Controls
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono text-[#9AA5CC]">
                  <div><span className="text-[#FDB813]">Click</span> Select body</div>
                  <div><span className="text-[#FDB813]">Drag</span> Orbit view</div>
                  <div><span className="text-[#FDB813]">Scroll</span> Zoom in/out</div>
                  <div><span className="text-[#FDB813]">~</span> Terminal</div>
                  <div><span className="text-[#FDB813]">ESC</span> Overview</div>
                  <div><span className="text-[#FDB813]">L</span> Exploration log</div>
                  <div><span className="text-[#FDB813]">?</span> This legend</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
