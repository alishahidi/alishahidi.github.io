import { GraphNode, Connection } from '@/types';

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface SimulationNode extends GraphNode {
  velocity: Vector3;
  force: Vector3;
}

const REPULSION = 500;
const ATTRACTION = 0.01;
const DAMPING = 0.9;
const MIN_DISTANCE = 5;

export function calculateForceDirectedLayout(
  nodes: GraphNode[],
  connections: Connection[],
  iterations: number = 100
): GraphNode[] {
  // Initialize simulation nodes with velocity and force
  const simNodes: SimulationNode[] = nodes.map((node) => ({
    ...node,
    velocity: { x: 0, y: 0, z: 0 },
    force: { x: 0, y: 0, z: 0 },
  }));

  // Create position map
  const positionMap = new Map<string, Vector3>();
  simNodes.forEach((node) => {
    const pos = node.position || [
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 30,
    ];
    positionMap.set(node.id, { x: pos[0], y: pos[1], z: pos[2] });
  });

  // Create connection map for quick lookup
  const connectionMap = new Map<string, Set<string>>();
  connections.forEach((conn) => {
    if (!connectionMap.has(conn.from)) {
      connectionMap.set(conn.from, new Set());
    }
    connectionMap.get(conn.from)!.add(conn.to);

    if (conn.bidirectional) {
      if (!connectionMap.has(conn.to)) {
        connectionMap.set(conn.to, new Set());
      }
      connectionMap.get(conn.to)!.add(conn.from);
    }
  });

  // Run simulation
  for (let i = 0; i < iterations; i++) {
    // Reset forces
    simNodes.forEach((node) => {
      node.force = { x: 0, y: 0, z: 0 };
    });

    // Calculate repulsion forces between all node pairs
    for (let j = 0; j < simNodes.length; j++) {
      for (let k = j + 1; k < simNodes.length; k++) {
        const nodeA = simNodes[j];
        const nodeB = simNodes[k];
        const posA = positionMap.get(nodeA.id)!;
        const posB = positionMap.get(nodeB.id)!;

        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const dz = posB.z - posA.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;

        if (distance < MIN_DISTANCE) {
          const force = REPULSION / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          const fz = (dz / distance) * force;

          nodeA.force.x -= fx;
          nodeA.force.y -= fy;
          nodeA.force.z -= fz;
          nodeB.force.x += fx;
          nodeB.force.y += fy;
          nodeB.force.z += fz;
        }
      }
    }

    // Calculate attraction forces for connected nodes
    connections.forEach((conn) => {
      const nodeA = simNodes.find((n) => n.id === conn.from);
      const nodeB = simNodes.find((n) => n.id === conn.to);
      if (!nodeA || !nodeB) return;

      const posA = positionMap.get(nodeA.id)!;
      const posB = positionMap.get(nodeB.id)!;

      const dx = posB.x - posA.x;
      const dy = posB.y - posA.y;
      const dz = posB.z - posA.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;

      const force = distance * ATTRACTION * conn.strength;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      const fz = (dz / distance) * force;

      nodeA.force.x += fx;
      nodeA.force.y += fy;
      nodeA.force.z += fz;
      nodeB.force.x -= fx;
      nodeB.force.y -= fy;
      nodeB.force.z -= fz;
    });

    // Apply forces to positions
    simNodes.forEach((node) => {
      const pos = positionMap.get(node.id)!;

      node.velocity.x = (node.velocity.x + node.force.x) * DAMPING;
      node.velocity.y = (node.velocity.y + node.force.y) * DAMPING;
      node.velocity.z = (node.velocity.z + node.force.z) * DAMPING;

      pos.x += node.velocity.x;
      pos.y += node.velocity.y;
      pos.z += node.velocity.z;
    });
  }

  // Return nodes with updated positions
  return simNodes.map((node) => {
    const pos = positionMap.get(node.id)!;
    return {
      ...node,
      position: [pos.x, pos.y, pos.z] as [number, number, number],
    };
  });
}

export function getClusterCenter(
  nodes: GraphNode[],
  type: string
): [number, number, number] {
  const filtered = nodes.filter((n) => n.type === type && n.position);
  if (filtered.length === 0) return [0, 0, 0];

  const sum = filtered.reduce(
    (acc, node) => {
      const pos = node.position!;
      return [acc[0] + pos[0], acc[1] + pos[1], acc[2] + pos[2]];
    },
    [0, 0, 0]
  );

  return [
    sum[0] / filtered.length,
    sum[1] / filtered.length,
    sum[2] / filtered.length,
  ];
}

export function findPath(
  nodes: GraphNode[],
  connections: Connection[],
  startId: string,
  endId: string
): string[] {
  const visited = new Set<string>();
  const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.id === endId) {
      return current.path;
    }

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    // Find connected nodes
    const connectedIds = connections
      .filter((c) => c.from === current.id || (c.bidirectional && c.to === current.id))
      .map((c) => (c.from === current.id ? c.to : c.from));

    connectedIds.forEach((id) => {
      if (!visited.has(id)) {
        queue.push({ id, path: [...current.path, id] });
      }
    });
  }

  return [];
}
