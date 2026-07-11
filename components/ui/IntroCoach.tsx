'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KEY = 'explore-intro-seen';

const SWATCHES: Array<[string, string, string]> = [
  ['#FDB813', 'Planets', 'career roles'],
  ['#FF6B35', 'Moons', 'skills'],
  ['#57D9A3', 'Stations', 'projects'],
  ['#9D7BFF', 'Nebulae', 'ideas'],
];

/**
 * One-time intro that frames the metaphor before dropping a first-time visitor
 * into the void. Persists a flag in localStorage so returning visitors skip it.
 */
export function IntroCoach() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-title"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss intro"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md rounded-2xl border border-[#FDB813]/30 bg-[#0E1428]/95 p-6 text-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] sm:p-8"
          >
            <div className="mx-auto mb-4 h-9 w-9 rounded-full bg-[radial-gradient(circle_at_38%_34%,#FFF3CE,#FDB813_55%,#E8760B)] shadow-[0_0_28px_6px_rgba(253,184,19,0.5)]" />
            <h2 id="intro-title" className="font-mono text-lg font-bold text-[#FDB813]">
              Ali&apos;s career, as a solar system
            </h2>
            <p className="mt-2 font-mono text-[13px] leading-relaxed text-[#9AA5CC]">
              Everything orbits one star. Click anything to explore — or open the{' '}
              <span className="text-[#48DFE3]">terminal</span> and type{' '}
              <span className="text-[#FDB813]">help</span>.
            </p>

            <ul className="mt-5 grid grid-cols-2 gap-2.5 text-left">
              {SWATCHES.map(([color, name, desc]) => (
                <li
                  key={name}
                  className="flex items-center gap-2.5 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-[12px] font-bold" style={{ color }}>
                      {name}
                    </span>
                    <span className="block font-mono text-[10px] text-[#9AA5CC]">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={dismiss}
              autoFocus
              className="mt-6 w-full rounded-full bg-[#FDB813] px-6 py-3 font-mono text-sm font-semibold text-[#060814] transition hover:brightness-110"
            >
              Enter the universe →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
