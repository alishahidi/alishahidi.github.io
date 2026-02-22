'use client';

import { useCallback, useMemo } from 'react';
import { useGraphStore } from '@/stores/graphStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useAchievementStore } from '@/stores/achievementStore';

export function useGraph() {
  // Use individual selectors to avoid unnecessary re-renders
  const nodes = useGraphStore((state) => state.nodes);
  const connections = useGraphStore((state) => state.connections);
  const focusedNodeId = useGraphStore((state) => state.focusedNodeId);
  const hoveredNodeId = useGraphStore((state) => state.hoveredNodeId);
  const setFocusedNode = useGraphStore((state) => state.setFocusedNode);
  const setHoveredNode = useGraphStore((state) => state.setHoveredNode);
  const discoverNode = useGraphStore((state) => state.discoverNode);
  const unlockNode = useGraphStore((state) => state.unlockNode);
  const getDiscoveredCount = useGraphStore((state) => state.getDiscoveredCount);
  const getTotalCount = useGraphStore((state) => state.getTotalCount);

  const discoveredNodes = useDiscoveryStore((state) => state.discoveredNodes);
  const incrementClicks = useDiscoveryStore((state) => state.incrementClicks);
  const incrementSecrets = useDiscoveryStore((state) => state.incrementSecrets);
  const incrementPhilosophy = useDiscoveryStore((state) => state.incrementPhilosophy);
  const terminalCommandsUsed = useDiscoveryStore((state) => state.terminalCommandsUsed);
  const secretsFound = useDiscoveryStore((state) => state.secretsFound);
  const philosophyRead = useDiscoveryStore((state) => state.philosophyRead);
  const recordNodeTimestamp = useDiscoveryStore((state) => state.recordNodeTimestamp);
  const getNodesPerMinute = useDiscoveryStore((state) => state.getNodesPerMinute);
  const trackPlanetVisit = useDiscoveryStore((state) => state.trackPlanetVisit);
  const trackProjectVisit = useDiscoveryStore((state) => state.trackProjectVisit);
  const trackNebulaVisit = useDiscoveryStore((state) => state.trackNebulaVisit);

  const checkAndUnlock = useAchievementStore((state) => state.checkAndUnlock);

  // Filter visible nodes based on unlock conditions
  const visibleNodes = useMemo(() => {
    return nodes.filter((node) => {
      if (!node.locked) return true;

      if (node.unlockCondition) {
        const [type, value] = node.unlockCondition.split(':');
        const threshold = parseInt(value, 10);

        if (type === 'nodes' && discoveredNodes.length >= threshold) {
          return true;
        }
        if (type === 'terminal' && terminalCommandsUsed >= threshold) {
          return true;
        }
        if (type === 'secrets' && secretsFound >= threshold) {
          return true;
        }
      }

      return false;
    });
  }, [nodes, discoveredNodes.length, terminalCommandsUsed, secretsFound]);

  // Filter visible connections
  const visibleConnections = useMemo(() => {
    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    return connections.filter(
      (c) => visibleIds.has(c.from) && visibleIds.has(c.to)
    );
  }, [connections, visibleNodes]);

  // Get connected nodes for focused node
  const connectedToFocused = useMemo(() => {
    if (!focusedNodeId) return [];
    const connectedIds = new Set<string>();

    connections.forEach((c) => {
      if (c.from === focusedNodeId) connectedIds.add(c.to);
      if (c.bidirectional && c.to === focusedNodeId) connectedIds.add(c.from);
    });

    return visibleNodes.filter((n) => connectedIds.has(n.id));
  }, [focusedNodeId, connections, visibleNodes]);

  // Handle node click
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      incrementClicks();
      const node = nodes.find((n) => n.id === nodeId);

      if (node) {
        if (node.locked) {
          unlockNode(nodeId);
        }

        discoverNode(nodeId);
        setFocusedNode(nodeId);

        if (node.type === 'secret') {
          incrementSecrets();
          const newSecretsCount = useDiscoveryStore.getState().secretsFound;
          checkAndUnlock('secrets', newSecretsCount);
        }
        if (node.type === 'philosophy') {
          incrementPhilosophy();
          const newPhilosophyCount = useDiscoveryStore.getState().philosophyRead;
          checkAndUnlock('philosophy', newPhilosophyCount);
        }

        // Node count achievement
        const discoveredCount = getDiscoveredCount() + 1;
        checkAndUnlock('nodes', discoveredCount);

        // Speed tracking
        recordNodeTimestamp();
        const nodesPerMinute = getNodesPerMinute();
        checkAndUnlock('speed', nodesPerMinute);

        // Category tracking
        if (node.type === 'experience') {
          trackPlanetVisit(node.id);
          const planetCount = useDiscoveryStore.getState().planetsVisited.length;
          checkAndUnlock('planets', planetCount);
        }
        if (node.type === 'project') {
          trackProjectVisit(node.id);
          const projectCount = useDiscoveryStore.getState().projectsVisited.length;
          checkAndUnlock('projects', projectCount);
        }
        if (node.type === 'philosophy') {
          trackNebulaVisit(node.id);
          const nebulaCount = useDiscoveryStore.getState().nebulaeVisited.length;
          checkAndUnlock('nebulae', nebulaCount);
        }
      }
    },
    [
      nodes,
      incrementClicks,
      unlockNode,
      discoverNode,
      setFocusedNode,
      incrementSecrets,
      incrementPhilosophy,
      getDiscoveredCount,
      checkAndUnlock,
      recordNodeTimestamp,
      getNodesPerMinute,
      trackPlanetVisit,
      trackProjectVisit,
      trackNebulaVisit,
    ]
  );

  // Handle node hover
  const handleNodeHover = useCallback(
    (nodeId: string | null) => {
      setHoveredNode(nodeId);
    },
    [setHoveredNode]
  );

  // Get single node by ID
  const getNode = useCallback(
    (id: string) => nodes.find((n) => n.id === id),
    [nodes]
  );

  // Calculate progress
  const progress = useMemo(() => {
    const discovered = getDiscoveredCount();
    const total = getTotalCount();
    return total > 0 ? Math.round((discovered / total) * 100) : 0;
  }, [getDiscoveredCount, getTotalCount]);

  return {
    nodes: visibleNodes,
    connections: visibleConnections,
    focusedNode: focusedNodeId ? getNode(focusedNodeId) : null,
    hoveredNode: hoveredNodeId ? getNode(hoveredNodeId) : null,
    focusedNodeId,
    hoveredNodeId,
    connectedToFocused,
    progress,
    discoveredCount: getDiscoveredCount(),
    totalCount: getTotalCount(),
    handleNodeClick,
    handleNodeHover,
    setFocusedNode,
    getNode,
  };
}
