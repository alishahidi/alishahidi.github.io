import { NodeType } from '@/types';

export function getNodeColor(type: NodeType, customColor?: string): string {
  if (customColor) return customColor;

  const colors: Record<NodeType, string> = {
    skill: '#00ffff',      // Cyan
    project: '#00ff00',    // Green
    philosophy: '#ff00ff', // Magenta/Purple
    experience: '#ffff00', // Yellow
    memory: '#ff69b4',     // Pink
    secret: '#ff0055',     // Red
    core: '#ffffff',       // White
  };

  return colors[type] || '#00ff00';
}

export function getNodeGeometry(type: NodeType): string {
  const geometries: Record<NodeType, string> = {
    skill: 'octahedron',
    project: 'box',
    philosophy: 'sphere',
    experience: 'octahedron',
    memory: 'tetrahedron',
    secret: 'dodecahedron',
    core: 'icosahedron',
  };

  return geometries[type] || 'sphere';
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function distance3(
  a: [number, number, number],
  b: [number, number, number]
): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
