export type NodeType = 'skill' | 'project' | 'philosophy' | 'experience' | 'memory' | 'secret' | 'core';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  content: string;
  position?: [number, number, number];
  size: number;
  color?: string;
  discovered: boolean;
  locked: boolean;
  unlockCondition?: string;
  tags: string[];
  year?: number;
  links?: { label: string; url: string }[];
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
  strength: number;
  bidirectional: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
  reward?: string;
}

export interface TerminalCommand {
  name: string;
  description: string;
  usage: string;
  hidden: boolean;
  execute: (args: string[], context: TerminalContext) => string | Promise<string>;
}

export interface TerminalContext {
  focusNode: (id: string) => void;
  getNodes: () => GraphNode[];
  getDiscovered: () => string[];
  getAchievements: () => Achievement[];
  discoverNode: (id: string) => void;
  unlockAchievement: (id: string) => void;
  setTheme: (theme: string) => void;
  toggleMatrixRain: () => void;
  triggerGlitch: () => void;
}

export interface TerminalHistoryEntry {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  timestamp: number;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}
