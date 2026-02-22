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
    <div className="fixed inset-x-0 top-0 p-2 sm:p-4 z-30 pointer-events-none">
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
            <p className="text-[#FDB813]/50 font-mono text-[10px] sm:text-xs">
              Backend Developer
            </p>
          </div>

          {/* Progress */}
          <div className="bg-black/50 backdrop-blur-sm border border-[#FDB813]/30 rounded px-2 sm:px-3 py-1.5 sm:py-2">
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono">
              <span className="text-[#FDB813]/70 hidden sm:inline">EXPLORED</span>
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
          <div className="mb-2 sm:mb-4 text-[#FDB813]/50 font-mono text-[10px] sm:text-xs hidden xs:block">
            SESSION: {formatTime(sessionTime)}
          </div>

          {/* Controls */}
          <div className="flex gap-1.5 sm:gap-2 justify-end">
            <button
              onClick={toggleExplorationBoard}
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-black/50 backdrop-blur-sm border border-[#FDB813]/30 rounded
                text-[#FDB813] font-mono text-[10px] sm:text-xs hover:bg-[#FDB813]/10 hover:border-[#FDB813]/50
                active:bg-[#FDB813]/20 transition-all"
            >
              <span className="sm:hidden">[*] {unlockedCount}/{totalAchievements}</span>
              <span className="hidden sm:inline">[*] LOG {unlockedCount}/{totalAchievements}</span>
            </button>
            <button
              onClick={toggleTerminal}
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-black/50 backdrop-blur-sm border border-[#FDB813]/30 rounded
                text-[#FDB813] font-mono text-[10px] sm:text-xs hover:bg-[#FDB813]/10 hover:border-[#FDB813]/50
                active:bg-[#FDB813]/20 transition-all"
            >
              <span className="sm:hidden">[~]</span>
              <span className="hidden sm:inline">[~] TERMINAL</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom guidance — auto-hides after first click */}
      <AnimatePresence>
        {showGuidance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none w-[calc(100%-2rem)] sm:w-auto"
          >
            <div className="bg-black/60 backdrop-blur-sm border border-[#FDB813]/20 rounded-lg px-3 sm:px-4 py-2">
              <p className="text-[#FDB813]/70 font-mono text-[10px] sm:text-xs">
                Click any planet, moon, or station to explore
              </p>
              <p className="text-gray-500 font-mono text-[10px] sm:text-[11px] mt-1">
                Drag to orbit | Scroll to zoom | Press ? for help
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
