'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Honors the OS "reduce motion" setting for every Framer Motion animation on
 * the site (transforms are dropped, opacity kept). Complements the CSS-level
 * prefers-reduced-motion gates and the reduced-motion checks in the 3D scene.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
