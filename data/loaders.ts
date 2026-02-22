import { GraphNode, Connection, Achievement } from '@/types';

import experienceData from './content/experience.json';
import skillsData from './content/skills.json';
import projectsData from './content/projects.json';
import philosophyData from './content/philosophy.json';
import secretsData from './content/secrets.json';
import connectionsData from './content/connections.json';
import achievementsData from './content/achievements.json';

export const experienceNodes = experienceData as GraphNode[];
export const skillNodes = skillsData as GraphNode[];
export const projectNodes = projectsData as GraphNode[];
export const philosophyNodes = philosophyData as GraphNode[];
export const secretNodes = secretsData as GraphNode[];

export const allNodes: GraphNode[] = [
  ...skillNodes,
  ...projectNodes,
  ...philosophyNodes,
  ...experienceNodes,
  ...secretNodes,
];

export const connections = connectionsData as Connection[];
export const achievements = achievementsData as Achievement[];
