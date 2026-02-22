'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useGraphStore } from '@/stores/graphStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { getNodeColor } from '@/lib/utils';
import { planets } from '@/data/solarSystem';
import { connections as allConnections } from '@/data/loaders';

export function NodeDetail() {
  const { focusedNodeId, setFocusedNode, getNode, getConnectedNodes } = useGraphStore();
  const incrementConnections = useDiscoveryStore((s) => s.incrementConnections);
  const checkAndUnlock = useAchievementStore((s) => s.checkAndUnlock);
  const node = focusedNodeId ? getNode(focusedNodeId) : null;
  const connectedNodes = focusedNodeId ? getConnectedNodes(focusedNodeId) : [];

  // Build a map of connected node id → connection label
  const connectionLabels = useMemo(() => {
    if (!focusedNodeId) return new Map<string, string>();
    const map = new Map<string, string>();
    for (const c of allConnections) {
      if (c.from === focusedNodeId && c.label) {
        map.set(c.to, c.label);
      } else if (c.to === focusedNodeId && c.label) {
        map.set(c.from, c.label);
      }
    }
    return map;
  }, [focusedNodeId]);

  // Find planet config if this node is an experience (planet) node
  const planetConfig = useMemo(() => {
    if (!node || node.type !== 'experience') return null;
    return planets.find((p) => p.id === node.id) || null;
  }, [node]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusedNodeId) {
        setFocusedNode(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedNodeId, setFocusedNode]);

  if (!node) return null;

  const color = planetConfig?.color || getNodeColor(node.type, node.color);

  // Determine body type label for the badge
  const bodyTypeLabel = (() => {
    switch (node.type) {
      case 'experience': return 'company';
      case 'skill': return 'skill';
      case 'project': return 'project';
      case 'philosophy': return 'philosophy';
      case 'secret': return 'secret';
      case 'core': return 'core';
      default: return node.type;
    }
  })();

  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:top-4 sm:right-4 w-full sm:w-80 md:w-96 max-h-[60vh] sm:max-h-[calc(100vh-2rem)] z-40 overflow-hidden"
      >
        <div
          className="bg-black/90 border border-t sm:border rounded-t-xl sm:rounded-lg backdrop-blur-sm overflow-hidden"
          style={{
            borderColor: `${color}50`,
            boxShadow: `0 0 30px ${color}20`,
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{
              borderColor: `${color}30`,
              backgroundColor: `${color}10`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: color }}
              />
              <div>
                <h2
                  className="font-mono text-lg font-bold"
                  style={{ color }}
                >
                  {planetConfig ? planetConfig.name : node.label}
                </h2>
                {planetConfig?.description && (
                  <p className="font-mono text-xs text-gray-500">
                    {planetConfig.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setFocusedNode(null)}
              className="text-gray-500 hover:text-white transition-colors font-mono text-sm"
            >
              [x]
            </button>
          </div>

          {/* Type badge + year */}
          <div className="px-4 py-2 border-b border-gray-800 flex items-center gap-2">
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-mono uppercase"
              style={{
                backgroundColor: `${color}20`,
                color,
                border: `1px solid ${color}50`,
              }}
            >
              {bodyTypeLabel}
            </span>
            {node.year && (
              <span className="text-gray-500 text-xs font-mono">
                {node.year}
              </span>
            )}
          </div>

          {/* Planet-specific: Roles at this company */}
          {planetConfig && planetConfig.roles.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-800">
              <h4 className="text-xs font-mono text-gray-500 mb-1.5 uppercase">
                Roles
              </h4>
              <div className="space-y-1">
                {planetConfig.roles.map((role, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                    <span className="text-xs font-mono text-gray-200">
                      {role.title}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 shrink-0">
                      {role.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Planet-specific: Skills (moons) */}
          {planetConfig && (
            <div className="px-4 py-2 border-b border-gray-800">
              <h4 className="text-xs font-mono text-gray-500 mb-1.5 uppercase">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {planetConfig.moons.map((moon) => (
                  <button
                    key={`${planetConfig.id}-${moon.nodeId}`}
                    onClick={() => {
                      incrementConnections();
                      const count = useDiscoveryStore.getState().connectionsFollowed;
                      checkAndUnlock('connections', count);
                      setFocusedNode(moon.nodeId);
                    }}
                    className="px-2 py-0.5 text-xs font-mono rounded transition-colors hover:brightness-125"
                    style={{
                      backgroundColor: `${moon.color}15`,
                      color: moon.color,
                      border: `1px solid ${moon.color}30`,
                    }}
                  >
                    {moon.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-3 sm:p-4 overflow-y-auto max-h-[35vh] sm:max-h-[50vh] overscroll-contain">
            <div
              className="prose prose-invert prose-sm max-w-none
                prose-headings:font-mono
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-strong:text-white
                prose-blockquote:border-l-gray-600 prose-blockquote:text-gray-400 prose-blockquote:italic
                prose-code:text-[#ff00ff] prose-code:bg-gray-900 prose-code:px-1 prose-code:rounded
                prose-ul:text-gray-300 prose-li:marker:text-gray-500"
              style={{
                '--tw-prose-headings': color,
              } as React.CSSProperties}
            >
              <ReactMarkdown>{node.content}</ReactMarkdown>
            </div>
          </div>

          {/* Tags */}
          {node.tags.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-800 flex flex-wrap gap-2">
              {node.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-900 rounded text-xs font-mono text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          {node.links && node.links.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-800">
              <div className="flex gap-3">
                {node.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono hover:underline"
                    style={{ color }}
                  >
                    [{link.label}]
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Connected nodes */}
          {connectedNodes.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-800">
              <h4 className="text-xs font-mono text-gray-500 mb-2 uppercase">
                Connected
              </h4>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-thin">
                {connectedNodes.map((connected) => {
                  const connColor = getNodeColor(connected.type, connected.color);
                  const label = connectionLabels.get(connected.id);
                  return (
                    <button
                      key={connected.id}
                      onClick={() => {
                        incrementConnections();
                        const count = useDiscoveryStore.getState().connectionsFollowed;
                        checkAndUnlock('connections', count);
                        setFocusedNode(connected.id);
                      }}
                      className="px-2 py-1 text-xs font-mono rounded transition-colors"
                      style={{
                        backgroundColor: `${connColor}10`,
                        color: connColor,
                        border: `1px solid ${connColor}30`,
                      }}
                      title={label || undefined}
                    >
                      {connected.label}
                      {label && (
                        <span className="text-gray-500 ml-1 text-[10px]">
                          {label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
