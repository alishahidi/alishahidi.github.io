import { create } from 'zustand';
import { GraphNode, Connection } from '@/types';
import { allNodes, connections } from '@/data/loaders';

interface GraphState {
  nodes: GraphNode[];
  connections: Connection[];
  focusedNodeId: string | null;
  hoveredNodeId: string | null;

  // Actions
  setFocusedNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  discoverNode: (id: string) => void;
  unlockNode: (id: string) => void;
  getNode: (id: string) => GraphNode | undefined;
  getConnectedNodes: (id: string) => GraphNode[];
  getDiscoveredNodes: () => GraphNode[];
  getDiscoveredCount: () => number;
  getTotalCount: () => number;
  resetDiscovery: () => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: allNodes,
  connections: connections,
  focusedNodeId: null,
  hoveredNodeId: null,

  setFocusedNode: (id) => {
    set({ focusedNodeId: id });
    if (id) {
      get().discoverNode(id);
    }
  },

  setHoveredNode: (id) => set({ hoveredNodeId: id }),

  discoverNode: (id) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, discovered: true } : node
      ),
    }));
  },

  unlockNode: (id) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, locked: false } : node
      ),
    }));
  },

  getNode: (id) => get().nodes.find((n) => n.id === id),

  getConnectedNodes: (id) => {
    const conns = get().connections.filter(
      (c) => c.from === id || c.to === id
    );
    const connectedIds = conns.map((c) => (c.from === id ? c.to : c.from));
    return get().nodes.filter((n) => connectedIds.includes(n.id));
  },

  getDiscoveredNodes: () => get().nodes.filter((n) => n.discovered),

  getDiscoveredCount: () => get().nodes.filter((n) => n.discovered).length,

  getTotalCount: () => get().nodes.filter((n) => !n.locked).length,

  resetDiscovery: () => {
    set((state) => ({
      nodes: state.nodes.map((node) => ({
        ...node,
        discovered: false,
        locked: node.type === 'secret' || node.type === 'core',
      })),
    }));
  },
}));
