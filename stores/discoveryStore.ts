import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DiscoveryState {
  discoveredNodes: string[];
  visitedNodes: string[];
  totalClicks: number;
  terminalCommandsUsed: number;
  secretsFound: number;
  philosophyRead: number;
  startTime: number | null;

  // New tracking fields
  connectionsFollowed: number;
  firstVisitDate: number | null;
  totalVisits: number;
  recentNodeTimestamps: number[];
  sunClicked: boolean;
  planetsVisited: string[];
  projectsVisited: string[];
  nebulaeVisited: string[];

  // Actions
  discoverNode: (id: string) => void;
  visitNode: (id: string) => void;
  incrementClicks: () => void;
  incrementTerminalCommands: () => void;
  incrementSecrets: () => void;
  incrementPhilosophy: () => void;
  startSession: () => void;
  getProgress: () => number;
  getSessionDuration: () => number;
  reset: () => void;

  // New actions
  incrementConnections: () => void;
  recordFirstVisit: () => void;
  incrementTotalVisits: () => void;
  recordNodeTimestamp: () => void;
  getNodesPerMinute: () => number;
  setSunClicked: () => void;
  trackPlanetVisit: (id: string) => void;
  trackProjectVisit: (id: string) => void;
  trackNebulaVisit: (id: string) => void;
}

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      discoveredNodes: [],
      visitedNodes: [],
      totalClicks: 0,
      terminalCommandsUsed: 0,
      secretsFound: 0,
      philosophyRead: 0,
      startTime: null,

      // New fields
      connectionsFollowed: 0,
      firstVisitDate: null,
      totalVisits: 0,
      recentNodeTimestamps: [],
      sunClicked: false,
      planetsVisited: [],
      projectsVisited: [],
      nebulaeVisited: [],

      discoverNode: (id) =>
        set((state) => ({
          discoveredNodes: state.discoveredNodes.includes(id)
            ? state.discoveredNodes
            : [...state.discoveredNodes, id],
        })),

      visitNode: (id) =>
        set((state) => ({
          visitedNodes: state.visitedNodes.includes(id)
            ? state.visitedNodes
            : [...state.visitedNodes, id],
        })),

      incrementClicks: () =>
        set((state) => ({ totalClicks: state.totalClicks + 1 })),

      incrementTerminalCommands: () =>
        set((state) => ({
          terminalCommandsUsed: state.terminalCommandsUsed + 1,
        })),

      incrementSecrets: () =>
        set((state) => ({ secretsFound: state.secretsFound + 1 })),

      incrementPhilosophy: () =>
        set((state) => ({ philosophyRead: state.philosophyRead + 1 })),

      startSession: () =>
        set((state) => ({
          startTime: state.startTime || Date.now(),
        })),

      getProgress: () => {
        const { discoveredNodes } = get();
        const totalNodes = 30; // Approximate total
        return Math.round((discoveredNodes.length / totalNodes) * 100);
      },

      getSessionDuration: () => {
        const { startTime } = get();
        if (!startTime) return 0;
        return Math.floor((Date.now() - startTime) / 1000);
      },

      reset: () =>
        set({
          discoveredNodes: [],
          visitedNodes: [],
          totalClicks: 0,
          terminalCommandsUsed: 0,
          secretsFound: 0,
          philosophyRead: 0,
          startTime: null,
          connectionsFollowed: 0,
          firstVisitDate: null,
          totalVisits: 0,
          recentNodeTimestamps: [],
          sunClicked: false,
          planetsVisited: [],
          projectsVisited: [],
          nebulaeVisited: [],
        }),

      // New actions
      incrementConnections: () =>
        set((state) => ({ connectionsFollowed: state.connectionsFollowed + 1 })),

      recordFirstVisit: () =>
        set((state) => ({
          firstVisitDate: state.firstVisitDate || Date.now(),
        })),

      incrementTotalVisits: () =>
        set((state) => ({ totalVisits: state.totalVisits + 1 })),

      recordNodeTimestamp: () =>
        set((state) => ({
          recentNodeTimestamps: [...state.recentNodeTimestamps, Date.now()].slice(-20),
        })),

      getNodesPerMinute: () => {
        const { recentNodeTimestamps } = get();
        const oneMinuteAgo = Date.now() - 60000;
        return recentNodeTimestamps.filter((t) => t > oneMinuteAgo).length;
      },

      setSunClicked: () => set({ sunClicked: true }),

      trackPlanetVisit: (id) =>
        set((state) => ({
          planetsVisited: state.planetsVisited.includes(id)
            ? state.planetsVisited
            : [...state.planetsVisited, id],
        })),

      trackProjectVisit: (id) =>
        set((state) => ({
          projectsVisited: state.projectsVisited.includes(id)
            ? state.projectsVisited
            : [...state.projectsVisited, id],
        })),

      trackNebulaVisit: (id) =>
        set((state) => ({
          nebulaeVisited: state.nebulaeVisited.includes(id)
            ? state.nebulaeVisited
            : [...state.nebulaeVisited, id],
        })),
    }),
    {
      name: 'consciousness-discovery-storage',
    }
  )
);
