'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarData {
  id: number;
  dx: number;
  dy: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

interface WarpStreakData {
  angle: number;
  length: number;
  delay: number;
}

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [phase, setPhase] = useState<'idle' | 'warp'>('idle');
  const [stars, setStars] = useState<StarData[]>([]);
  const [warpStreaks] = useState<WarpStreakData[]>(() =>
    Array.from({ length: 50 }, (_, i) => ({
      angle: (i / 50) * 360,
      length: 40 + (((i * 7 + 13) % 47) / 47) * 60,
      delay: ((i * 11 + 3) % 20) / 100,
    }))
  );

  // Generate stars client-side only to avoid hydration mismatch
  useEffect(() => {
    const generated: StarData[] = Array.from({ length: 140 }, (_, i) => {
      const angleRad = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 90;
      const dx = Math.cos(angleRad) * dist;
      const dy = Math.sin(angleRad) * dist;
      const delay = Math.random() * 6;
      const duration = 8 + Math.random() * 12;
      const size = Math.random() < 0.2 ? 2.5 : Math.random() * 1.5 + 0.5;
      return { id: i, dx, dy, delay, duration, size, opacity: Math.random() * 0.5 + 0.4 };
    });
    setStars(generated);
  }, []);

  const handleEnter = () => {
    if (phase !== 'idle') return;
    setPhase('warp');
    setTimeout(onComplete, 900);
  };

  return (
    <AnimatePresence>
      {phase !== undefined && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={phase === 'warp' ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: phase === 'warp' ? 0.8 : 0, delay: phase === 'warp' ? 0.1 : 0 }}
          className="fixed inset-0 z-[100] overflow-hidden cursor-pointer"
          onClick={handleEnter}
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, #0a0a20 0%, #040410 50%, #000 100%)',
          }}
        >
          {/* ---- STATIC BACKGROUND STARS: tiny dots for depth ---- */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
                radial-gradient(1px 1px at 30% 70%, rgba(255,255,255,0.5) 0%, transparent 100%),
                radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.4) 0%, transparent 100%),
                radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.6) 0%, transparent 100%),
                radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.5) 0%, transparent 100%),
                radial-gradient(1px 1px at 15% 55%, rgba(255,255,255,0.3) 0%, transparent 100%),
                radial-gradient(1.5px 1.5px at 85% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
                radial-gradient(1px 1px at 45% 90%, rgba(255,255,255,0.4) 0%, transparent 100%),
                radial-gradient(1px 1px at 60% 60%, rgba(255,255,255,0.3) 0%, transparent 100%),
                radial-gradient(1.5px 1.5px at 25% 35%, rgba(255,255,255,0.5) 0%, transparent 100%),
                radial-gradient(1px 1px at 75% 25%, rgba(255,255,255,0.4) 0%, transparent 100%),
                radial-gradient(1px 1px at 5% 85%, rgba(255,255,255,0.5) 0%, transparent 100%),
                radial-gradient(1px 1px at 40% 45%, rgba(255,255,255,0.3) 0%, transparent 100%),
                radial-gradient(1.5px 1.5px at 95% 55%, rgba(255,255,255,0.6) 0%, transparent 100%),
                radial-gradient(1px 1px at 55% 30%, rgba(255,255,255,0.4) 0%, transparent 100%),
                radial-gradient(1px 1px at 20% 95%, rgba(255,255,255,0.3) 0%, transparent 100%)
              `,
            }}
          />

          {/* ---- DRIFTING STAR FIELD: radial outward from center ---- */}
          <div className="absolute inset-0">
            {stars.map((s) => (
              <div
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{
                  width: s.size,
                  height: s.size,
                  left: '50%',
                  top: '50%',
                  opacity: 0,
                  animation: `starDrift ${s.duration}s ${s.delay}s linear infinite`,
                  '--star-dx': `${s.dx}vh`,
                  '--star-dy': `${s.dy}vh`,
                  '--star-opacity': s.opacity,
                } as React.CSSProperties}
              />
            ))}
          </div>

          {/* ---- ORBITAL RINGS: thin rotating ellipses ---- */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              viewBox="-200 -100 400 200"
              className="w-[85vw] max-w-[800px] h-auto"
              style={{ opacity: 0.18 }}
            >
              {[75, 115, 160].map((rx, i) => (
                <ellipse
                  key={i}
                  cx="0"
                  cy="0"
                  rx={rx}
                  ry={rx * 0.32}
                  fill="none"
                  stroke="#FDB813"
                  strokeWidth="0.6"
                  strokeDasharray="4 8"
                  style={{
                    animation: `orbitSpin ${35 + i * 12}s linear infinite${i % 2 === 1 ? ' reverse' : ''}`,
                    transformOrigin: 'center',
                  }}
                />
              ))}
            </svg>
          </div>

          {/* ---- CENTER SUN GLOW ---- */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={
              phase === 'warp'
                ? { scale: 40, opacity: [1, 1, 0] }
                : { scale: 1, opacity: 1 }
            }
            transition={
              phase === 'warp'
                ? { duration: 0.8, ease: 'easeIn' }
                : { duration: 1, delay: 0.2 }
            }
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div
              className="w-5 h-5 rounded-full"
              style={{
                backgroundColor: '#FDB813',
                boxShadow:
                  '0 0 30px 8px #FDB813, 0 0 80px 20px rgba(253,184,19,0.35), 0 0 160px 50px rgba(253,184,19,0.12)',
              }}
            />
          </motion.div>

          {/* ---- CONTENT ---- */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center pointer-events-none select-none">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={
                phase === 'warp'
                  ? { opacity: 0, letterSpacing: '1em', y: -20 }
                  : { opacity: 1, letterSpacing: '0.3em', y: 0 }
              }
              transition={{ duration: phase === 'warp' ? 0.4 : 0.8, delay: phase === 'warp' ? 0 : 0.4 }}
              className="text-4xl md:text-6xl font-mono font-bold text-white mb-4"
              style={{
                textShadow: '0 0 30px rgba(253,184,19,0.3), 0 0 60px rgba(253,184,19,0.1)',
              }}
            >
              ALI SHAHIDI
            </motion.h1>

            {/* Subtitle line */}
            <motion.div
              initial={{ width: 0 }}
              animate={
                phase === 'warp'
                  ? { width: 0, opacity: 0 }
                  : { width: 160, opacity: 1 }
              }
              transition={{ duration: 0.6, delay: phase === 'warp' ? 0 : 0.8 }}
              className="h-px bg-gradient-to-r from-transparent via-[#FDB813]/40 to-transparent mb-5"
            />

            {/* Role */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={
                phase === 'warp'
                  ? { opacity: 0 }
                  : { opacity: 0.6 }
              }
              transition={{ duration: 0.6, delay: phase === 'warp' ? 0 : 1.0 }}
              className="font-mono text-sm md:text-base tracking-[0.4em] uppercase text-white/60"
            >
              Backend Developer
            </motion.p>

            {/* Spacer */}
            <div className="h-20" />

            {/* Enter prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={
                phase === 'warp'
                  ? { opacity: 0 }
                  : { opacity: 1 }
              }
              transition={{ duration: 0.5, delay: phase === 'warp' ? 0 : 1.3 }}
              className="pointer-events-auto"
            >
              <button
                onClick={(e) => { e.stopPropagation(); handleEnter(); }}
                className="group font-mono text-sm tracking-[0.3em] uppercase text-white/40 hover:text-[#FDB813]/80 transition-colors duration-300"
              >
                <span className="inline-flex items-center gap-1">
                  {'[ '}
                  <span className="group-hover:text-[#FDB813] transition-colors">ENTER</span>
                  {' ]'}
                </span>
                <span className="inline-block w-[1ch] animate-pulse ml-1 text-[#FDB813]/50">_</span>
              </button>
            </motion.div>

            {/* Click anywhere hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={phase === 'warp' ? { opacity: 0 } : { opacity: 0.25 }}
              transition={{ duration: 0.5, delay: phase === 'warp' ? 0 : 2.0 }}
              className="mt-4 font-mono text-[11px] text-white/25"
            >
              click anywhere to enter
            </motion.p>
          </div>

          {/* ---- WARP STREAKS: on enter, stars stretch ---- */}
          {phase === 'warp' && (
            <div className="absolute inset-0 pointer-events-none">
              {warpStreaks.map((streak, i) => (
                <motion.div
                  key={`warp-${i}`}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: [0, 0.9, 0], scaleY: 1 }}
                  transition={{ duration: 0.6, delay: streak.delay }}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: 1.5,
                    height: streak.length,
                    background: 'linear-gradient(to bottom, transparent, rgba(253,184,19,0.6), rgba(255,255,255,0.9), transparent)',
                    transformOrigin: 'top center',
                    transform: `rotate(${streak.angle}deg) translateY(-20px)`,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
