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

  const planetConfig = useMemo(() => {
    if (!node || node.type !== 'experience') return null;
    return planets.find((p) => p.id === node.id) || null;
  }, [node]);

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

  const handleConnectionClick = (targetId: string) => {
    incrementConnections();
    const count = useDiscoveryStore.getState().connectionsFollowed;
    checkAndUnlock('connections', count);
    setFocusedNode(targetId);
  };

  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.25 }}
        className="
          fixed top-0 left-0 right-0 bottom-0 z-40
          sm:bottom-auto sm:left-auto sm:top-4 sm:right-4 sm:w-80 md:w-96 sm:max-h-[calc(100vh-2rem)]
        "
      >
        {/* Backdrop on mobile */}
        <div
          className="absolute inset-0 bg-black/60 sm:hidden"
          onClick={() => setFocusedNode(null)}
        />

        {/* Panel */}
        <div
          className="
            relative h-full sm:h-auto
            flex flex-col
            bg-black/95 sm:bg-black/90
            border-0 sm:border sm:rounded-lg
            backdrop-blur-md sm:backdrop-blur-sm
            overflow-hidden
          "
          style={{
            borderColor: `${color}50`,
            boxShadow: `0 0 30px ${color}20`,
          }}
        >
          {/* Header — always visible */}
          <div
            className="shrink-0 px-4 py-3 border-b flex items-center justify-between"
            style={{
              borderColor: `${color}30`,
              backgroundColor: `${color}10`,
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-3 h-3 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="min-w-0">
                <h2 className="font-mono text-base sm:text-lg font-bold truncate" style={{ color }}>
                  {planetConfig ? planetConfig.name : node.label}
                </h2>
                {planetConfig?.description && (
                  <p className="font-mono text-[11px] text-gray-500">{planetConfig.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setFocusedNode(null)}
              className="text-gray-500 hover:text-white transition-colors font-mono text-xs shrink-0 ml-2 p-1"
            >
              [x]
            </button>
          </div>

          {/* Scrollable body — everything scrolls together on mobile */}
          <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin">
            {/* Type badge + year */}
            <div className="px-4 py-2 border-b border-gray-800 flex items-center gap-2">
              <span
                className="inline-block px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono uppercase"
                style={{
                  backgroundColor: `${color}20`,
                  color,
                  border: `1px solid ${color}50`,
                }}
              >
                {bodyTypeLabel}
              </span>
              {node.year && (
                <span className="text-gray-500 text-[10px] sm:text-xs font-mono">{node.year}</span>
              )}
            </div>

            {/* Planet-specific: Roles */}
            {planetConfig && planetConfig.roles.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-800">
                <h4 className="text-[10px] sm:text-xs font-mono text-gray-500 mb-1 uppercase">Roles</h4>
                <div className="space-y-1">
                  {planetConfig.roles.map((role, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-2">
                      <span className="text-[11px] sm:text-xs font-mono text-gray-200">{role.title}</span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-gray-500 shrink-0">{role.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Planet-specific: Tech stack */}
            {planetConfig && (
              <div className="px-4 py-2 border-b border-gray-800">
                <h4 className="text-[10px] sm:text-xs font-mono text-gray-500 mb-1 uppercase">Tech Stack</h4>
                <div className="flex flex-wrap gap-1">
                  {planetConfig.moons.map((moon) => (
                    <button
                      key={`${planetConfig.id}-${moon.nodeId}`}
                      onClick={() => handleConnectionClick(moon.nodeId)}
                      className="px-1.5 py-0.5 text-[10px] sm:text-xs font-mono rounded transition-colors hover:brightness-125 active:brightness-150"
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
            <div className="px-4 py-3">
              <div
                className="prose prose-invert prose-sm max-w-none
                  prose-headings:font-mono prose-headings:text-sm
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-[13px]
                  prose-strong:text-white
                  prose-blockquote:border-l-gray-600 prose-blockquote:text-gray-400 prose-blockquote:italic
                  prose-code:text-[#ff00ff] prose-code:bg-gray-900 prose-code:px-1 prose-code:rounded
                  prose-ul:text-gray-300 prose-li:marker:text-gray-500"
                style={{ '--tw-prose-headings': color } as React.CSSProperties}
              >
                <ReactMarkdown>{node.content}</ReactMarkdown>
              </div>
            </div>

            {/* Tags */}
            {node.tags.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-800 flex flex-wrap gap-1.5">
                {node.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-gray-900 rounded text-[10px] sm:text-xs font-mono text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            {node.links && node.links.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-800">
                <div className="flex gap-3">
                  {node.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-mono hover:underline"
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
              <div className="px-4 py-2 border-t border-gray-800">
                <h4 className="text-[10px] sm:text-xs font-mono text-gray-500 mb-1.5 uppercase">Connected</h4>
                <div className="flex flex-wrap gap-1.5">
                  {connectedNodes.map((connected) => {
                    const connColor = getNodeColor(connected.type, connected.color);
                    const label = connectionLabels.get(connected.id);
                    return (
                      <button
                        key={connected.id}
                        onClick={() => handleConnectionClick(connected.id)}
                        className="px-1.5 py-0.5 text-[10px] sm:text-xs font-mono rounded transition-colors active:brightness-150"
                        style={{
                          backgroundColor: `${connColor}10`,
                          color: connColor,
                          border: `1px solid ${connColor}30`,
                        }}
                        title={label || undefined}
                      >
                        {connected.label}
                        {label && (
                          <span className="text-gray-500 ml-1 text-[9px]">{label}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom safe area for mobile */}
            <div className="h-[env(safe-area-inset-bottom,0px)] sm:hidden" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
