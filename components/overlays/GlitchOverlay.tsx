'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlitchOverlayProps {
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

export function GlitchOverlay({
  active,
  duration = 1000,
  onComplete,
}: GlitchOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [glitchLines, setGlitchLines] = useState<Array<{
    top: number;
    height: number;
    offset: number;
    color: string;
  }>>([]);

  useEffect(() => {
    if (active) {
      setIsVisible(true);

      // Generate random glitch lines
      const lines = Array.from({ length: 20 }, () => ({
        top: Math.random() * 100,
        height: Math.random() * 5 + 1,
        offset: (Math.random() - 0.5) * 20,
        color: Math.random() > 0.5 ? '#ff0055' : '#00ffff',
      }));
      setGlitchLines(lines);

      // End glitch after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] pointer-events-none overflow-hidden"
        >
          {/* Glitch lines */}
          {glitchLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: line.offset }}
              animate={{
                opacity: [0, 1, 0],
                x: [line.offset, -line.offset, line.offset],
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 0.2,
              }}
              className="absolute w-full"
              style={{
                top: `${line.top}%`,
                height: `${line.height}px`,
                backgroundColor: line.color,
                mixBlendMode: 'screen',
              }}
            />
          ))}

          {/* RGB shift overlay */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0, 0.1, 0],
            }}
            transition={{
              duration: 0.05,
              repeat: Infinity,
            }}
            style={{
              background:
                'linear-gradient(90deg, rgba(255,0,0,0.1) 0%, rgba(0,255,0,0.1) 50%, rgba(0,0,255,0.1) 100%)',
            }}
          />

          {/* Noise overlay */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 0.03,
              repeat: Infinity,
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Screen flash */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 0.1,
              times: [0, 0.1, 1],
            }}
          />

          {/* Glitch text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              x: [0, -5, 5, -5, 0],
              y: [0, 3, -3, 3, 0],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
            }}
          >
            <div className="text-[#ff0055] font-mono text-6xl font-bold opacity-30">
              ERROR
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
