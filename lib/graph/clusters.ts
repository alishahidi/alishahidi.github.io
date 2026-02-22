import { GraphNode, NodeType } from '@/types';

export interface Cluster {
  id: string;
  type: NodeType;
  nodes: GraphNode[];
  center: [number, number, number];
}

export function groupNodesByType(nodes: GraphNode[]): Map<NodeType, GraphNode[]> {
  const groups = new Map<NodeType, GraphNode[]>();

  for (const node of nodes) {
    const existing = groups.get(node.type) || [];
    existing.push(node);
    groups.set(node.type, existing);
  }

  return groups;
}

export function createClusters(nodes: GraphNode[]): Cluster[] {
  const groups = groupNodesByType(nodes);
  const clusters: Cluster[] = [];

  groups.forEach((groupNodes, type) => {
    const center = calculateCenter(groupNodes);
    clusters.push({
      id: `cluster-${type}`,
      type,
      nodes: groupNodes,
      center,
    });
  });

  return clusters;
}

function calculateCenter(nodes: GraphNode[]): [number, number, number] {
  if (nodes.length === 0) return [0, 0, 0];

  const sum = nodes.reduce(
    (acc, node) => {
      const pos = node.position || [0, 0, 0];
      return [acc[0] + pos[0], acc[1] + pos[1], acc[2] + pos[2]];
    },
    [0, 0, 0]
  );

  return [
    sum[0] / nodes.length,
    sum[1] / nodes.length,
    sum[2] / nodes.length,
  ];
}

export function getClusterByType(
  clusters: Cluster[],
  type: NodeType
): Cluster | undefined {
  return clusters.find((c) => c.type === type);
}

export function getNodeCluster(
  nodeId: string,
  clusters: Cluster[]
): Cluster | undefined {
  return clusters.find((c) => c.nodes.some((n) => n.id === nodeId));
}

export const CLUSTER_COLORS: Record<NodeType, string> = {
  skill: '#00ffff',
  project: '#00ff00',
  philosophy: '#ff00ff',
  experience: '#ffff00',
  memory: '#ff69b4',
  secret: '#ff0055',
  core: '#ffffff',
};

export const CLUSTER_LABELS: Record<NodeType, string> = {
  skill: 'Skills',
  project: 'Projects',
  philosophy: 'Philosophy',
  experience: 'Experience',
  memory: 'Memories',
  secret: 'Secrets',
  core: 'Core',
};
