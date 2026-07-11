'use client';

import { motion } from 'framer-motion';

/**
 * Baseline cross-fade between routes so navigating home ⇆ /explore ⇆ /resume
 * feels like one continuous cosmos instead of a hard cut. Framer's MotionConfig
 * (reducedMotion="user") neutralizes the transform for reduced-motion users.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    // opacity-only: a transform here would become the containing block for the
    // explorer's position:fixed canvas/overlays and make them jump.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
