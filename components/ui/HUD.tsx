'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGraph } from '@/hooks/useGraph';
import { useTerminalStore } from '@/stores/terminalStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { formatTime } from '@/lib/utils';
import { ExplorationBoard } from './ExplorationBoard';

export function HUD() {
  const { progress, discoveredCount, totalCount } = useGraph();
  const { toggleTerminal } = useTerminalStore();
  const { getSessionDuration, startSession, recordFirstVisit, incrementTotalVisits } =
    useDiscoveryStore();
  const checkAndUnlock = useAchievementStore((s) => s.checkAndUnlock);
  const getUnlockedCount = useAchievementStore((s) => s.getUnlockedCount);
  const toggleExplorationBoard = useNavigationStore((s) => s.toggleExplorationBoard);
  const [sessionTime, setSessionTime] = useState(0);
  const [showGuidance, setShowGuidance] = useState(true);
  const hasClickedRef = useRef(false);
  const hasInitRef = useRef(false);

  // Start session + visit tracking on mount
  useEffect(() => {
    startSession();

    if (!hasInitRef.current) {
      hasInitRef.current = true;
      recordFirstVisit();
      incrementTotalVisits();

      // Check return visitor achievement
      const totalVisits = useDiscoveryStore.getState().totalVisits;
      checkAndUnlock('visits', totalVisits);

      // Check night owl achievement (midnight - 5am)
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 5) {
        checkAndUnlock('time', 1);
      }
    }
  }, [startSession, recordFirstVisit, incrementTotalVisits, checkAndUnlock]);

  // Update session time
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(getSessionDuration());
    }, 1000);
    return () => clearInterval(interval);
  }, [getSessionDuration]);

  // Auto-hide guidance after first node click
  useEffect(() => {
    if (discoveredCount > 0 && !hasClickedRef.current) {
      hasClickedRef.current = true;
      const timeout = setTimeout(() => setShowGuidance(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [discoveredCount]);

  const unlockedCount = getUnlockedCount();
  const totalAchievements = useAchievementStore.getState().achievements.length;

  return (
    <div
      className="fixed inset-x-0 top-0 p-2 sm:p-4 z-30 pointer-events-none"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
        paddingLeft: 'max(0.5rem, env(safe-area-inset-left))',
        paddingRight: 'max(0.5rem, env(safe-area-inset-right))',
      }}
    >
      <div className="max-w-screen-xl mx-auto flex items-start justify-between gap-2">
        {/* Left side - Logo and stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pointer-events-auto min-w-0"
        >
          {/* Logo */}
          <div className="mb-2 sm:mb-4">
            <h1 className="text-[#FDB813] font-mono text-base sm:text-xl font-bold tracking-wider">
              Ali Shahidi
            </h1>
            <p className="text-[#FDB813]/75 font-mono text-[10px] sm:text-xs">
              Backend Developer
            </p>
          </div>

          {/* Progress */}
          <div className="bg-black/50 backdrop-blur-sm border border-[#FDB813]/30 rounded px-2 sm:px-3 py-1.5 sm:py-2">
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono">
              <span className="text-[#FDB813]/75 hidden sm:inline">EXPLORED</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-16 sm:w-32 h-1 bg-[#FDB813]/20 rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-[#FDB813]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-[#FDB813]">
                  {discoveredCount}/{totalCount}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Session info and controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-right pointer-events-auto shrink-0"
        >
          {/* Session time — hidden on very small screens */}
          <div className="mb-2 sm:mb-4 text-[#FDB813]/75 font-mono text-[10px] sm:text-xs hidden xs:block">
            SESSION: {formatTime(sessionTime)}
          </div>

          {/* Controls */}
          <div className="flex gap-1.5 sm:gap-2 justify-end">
            <button
              onClick={toggleExplorationBoard}
              title="Exploration log — achievements & progress"
              aria-label="Open exploration log"
              className="min-h-9 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-black/50 backdrop-blur-sm border border-[#FDB813]/30 rounded
                text-[#FDB813] font-mono text-[11px] sm:text-xs hover:bg-[#FDB813]/10 hover:border-[#FDB813]/50
                active:bg-[#FDB813]/20 transition-all"
            >
              <span className="sm:hidden">✦ Log {unlockedCount}/{totalAchievements}</span>
              <span className="hidden sm:inline">[*] LOG {unlockedCount}/{totalAchievements}</span>
            </button>
            <button
              onClick={toggleTerminal}
              title="Open the interactive terminal (~)"
              aria-label="Open terminal"
              className="min-h-9 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-black/50 backdrop-blur-sm border border-[#FDB813]/30 rounded
                text-[#FDB813] font-mono text-[11px] sm:text-xs hover:bg-[#FDB813]/10 hover:border-[#FDB813]/50
                active:bg-[#FDB813]/20 transition-all"
            >
              <span className="sm:hidden">❯ Terminal</span>
              <span className="hidden sm:inline">[~] TERMINAL</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Onboarding hint — pinned near the bottom (off the Sun's glow), above
          the control bar; auto-hides after the first click */}
      <AnimatePresence>
        {showGuidance && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ delay: 1.5 }}
            className="fixed inset-x-0 bottom-20 sm:bottom-24 flex justify-center px-4 pointer-events-none z-20"
          >
            <div className="bg-[#060814]/85 backdrop-blur-sm border border-[#FDB813]/25 rounded-lg px-4 py-2.5 text-center shadow-[0_8px_30px_-8px_rgba(0,0,0,0.7)]">
              <p className="text-white/90 font-mono text-[11px] sm:text-sm">
                Click any planet, moon, or station
              </p>
              <p className="text-[#9AA5CC] font-mono text-[10px] sm:text-xs mt-0.5">
                Drag to orbit &middot; Scroll to zoom &middot; press{' '}
                <span className="text-[#FDB813]">?</span> for the legend
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exploration Board overlay */}
      <ExplorationBoard />
    </div>
  );
}
