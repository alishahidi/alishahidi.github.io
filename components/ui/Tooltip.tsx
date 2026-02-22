'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGraphStore } from '@/stores/graphStore';
import { getNodeColor } from '@/lib/utils';

export function Tooltip() {
  const { hoveredNodeId, focusedNodeId, getNode } = useGraphStore();

  // Don't show tooltip if node is focused (detail panel is shown instead)
  const showTooltip = hoveredNodeId && hoveredNodeId !== focusedNodeId;
  const node = showTooltip ? getNode(hoveredNodeId) : null;

  if (!node) return null;

  const color = getNodeColor(node.type, node.color);

  return (
    <AnimatePresence>
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15 }}
          className="fixed left-1/2 bottom-16 sm:bottom-20 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div
            className="bg-black/95 backdrop-blur-sm border rounded-lg px-4 py-2 max-w-xs"
            style={{
              borderColor: `${color}50`,
              boxShadow: `0 0 20px ${color}20`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <h3 className="font-mono text-sm font-bold" style={{ color }}>
                {node.label}
              </h3>
              <span className="text-xs font-mono text-gray-500 uppercase">
                {node.type}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-mono">
              {node.description}
            </p>
            {node.locked && (
              <p className="text-[#ff0055] text-xs font-mono mt-1">
                [LOCKED - Keep exploring]
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
