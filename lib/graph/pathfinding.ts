import { GraphNode, Connection } from '@/types';

interface PathResult {
  path: string[];
  distance: number;
}

export function findShortestPath(
  fromId: string,
  toId: string,
  nodes: GraphNode[],
  connections: Connection[]
): PathResult | null {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const adjacency = buildAdjacencyList(connections);

  // BFS for shortest path
  const queue: { id: string; path: string[]; distance: number }[] = [
    { id: fromId, path: [fromId], distance: 0 },
  ];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { id, path, distance } = queue.shift()!;

    if (id === toId) {
      return { path, distance };
    }

    if (visited.has(id)) continue;
    visited.add(id);

    const neighbors = adjacency.get(id) || [];
    for (const { nodeId, strength } of neighbors) {
      if (!visited.has(nodeId) && nodeMap.has(nodeId)) {
        queue.push({
          id: nodeId,
          path: [...path, nodeId],
          distance: distance + (1 - strength),
        });
      }
    }
  }

  return null;
}

export function getReachableNodes(
  fromId: string,
  connections: Connection[],
  maxDepth: number = 3
): Set<string> {
  const adjacency = buildAdjacencyList(connections);
  const reachable = new Set<string>();
  const queue: { id: string; depth: number }[] = [{ id: fromId, depth: 0 }];

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;

    if (depth > maxDepth) continue;
    if (reachable.has(id)) continue;

    reachable.add(id);

    const neighbors = adjacency.get(id) || [];
    for (const { nodeId } of neighbors) {
      if (!reachable.has(nodeId)) {
        queue.push({ id: nodeId, depth: depth + 1 });
      }
    }
  }

  return reachable;
}

export function findRelatedNodes(
  nodeId: string,
  connections: Connection[]
): string[] {
  const related: string[] = [];

  for (const conn of connections) {
    if (conn.from === nodeId) {
      related.push(conn.to);
    } else if (conn.to === nodeId && conn.bidirectional) {
      related.push(conn.from);
    }
  }

  return [...new Set(related)];
}

export function getConnectionBetween(
  fromId: string,
  toId: string,
  connections: Connection[]
): Connection | null {
  return (
    connections.find(
      (c) =>
        (c.from === fromId && c.to === toId) ||
        (c.bidirectional && c.from === toId && c.to === fromId)
    ) || null
  );
}

function buildAdjacencyList(
  connections: Connection[]
): Map<string, { nodeId: string; strength: number }[]> {
  const adjacency = new Map<string, { nodeId: string; strength: number }[]>();

  for (const conn of connections) {
    if (!adjacency.has(conn.from)) {
      adjacency.set(conn.from, []);
    }
    adjacency.get(conn.from)!.push({ nodeId: conn.to, strength: conn.strength });

    if (conn.bidirectional) {
      if (!adjacency.has(conn.to)) {
        adjacency.set(conn.to, []);
      }
      adjacency
        .get(conn.to)!
        .push({ nodeId: conn.from, strength: conn.strength });
    }
  }

  return adjacency;
}
